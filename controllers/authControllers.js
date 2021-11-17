import User from "../models/Users.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const checkEmail = await User.findOne({ email });
  if (!checkEmail) {
    try {
      const user = await User.create({
        username,
        email,
        password,
      });
      return sendToken(user, 201, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    return res.status(500).json({
      error: "Existe ya un usuario con este correo electrónico",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorResponse("Por favor ingrese nombre de usuario y contraseña"),
      400
    );
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Credenciales no válidas"), 401);
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Credenciales no válidas"), 401);
    }
    user.refreshToken = user.getRefreshToken();
    user.save();
    return sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Error en el envío del email", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${CLIENT_URL}/resetpassword/${resetToken}`;

    const message = `
    <h1>Ha solicitado cambiar su contraseña.</h1>
    <p>Haga click en el link a continuación para continuar.</p>
    <p>Si no ha sido usted, puede ignorar este mensaje.</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset contraseña",
        text: message,
      });
      res.status(200).json({ success: true, data: "Email enviado" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return next(new ErrorResponse("Email no enviado", 500));
    }
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Reset Token no válido"), 400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Contraseña cambiada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const refreshToken = user.getRefreshToken();
  return res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user_id: user.id,
    role: user.role,
  });
};

// const verifyRefreshToken = (token) =>
//   new Promise((res, rej) =>
//     jwt.verify(token, process.env.JWT_REFRESH, (err, decoded) => {
//       if (err) rej(err);
//       res(decoded);
//     })
//   );

// const refreshToken = async (oldRefreshToken) => {
//   const decoded = await verifyRefreshToken(oldRefreshToken);
//   const user = await User.findOne({ _id: decoded.id });
//   if (!user) {
//     throw new Error("Accesso prohibido");
//   }
//   const currentRefreshToken = user.refreshToken;
//   if (currentRefreshToken !== oldRefreshToken) {
//     throw new Error("Refresh token no válido");
//   }
//   const newToken = user.getSignedToken();
//   const newRefreshToken = user.getRefreshToken();
//   user.refreshToken = newRefreshToken;
//   await user.save();
//   return { token: newToken, refreshToken: newRefreshToken };
// };

export {
  register,
  login,
  forgotPassword,
  resetPassword,
  // refreshToken
};
