import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Introduzca un nombre de usuario"],
    },
    email: {
      type: String,
      require: [true, "Introduzca una dirección de correo electrónico"],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Introduzca una dirección de correo electrónico válida",
      ],
    },
    password: {
      type: String,
      require: [true, "Introduzca su contraseña"],
      minlength: 6,
      select: false,
    },
    favorites: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: {
          type: [],
        },
      },
    ],
    role: {
      type: String,
      require: false,
    },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      // email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

UserSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      // email: this.email,
      role: this.role,
    },
    process.env.JWT_REFRESH,
    {
      expiresIn: "1 week",
    }
  );
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
