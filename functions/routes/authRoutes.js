import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  // refreshToken,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.put("/resetPassword/:resetToken", resetPassword);

// router.post("/refreshToken", async (req, res, next) => {
//   console.log("This is my req", req.body);
//   const oldRefreshToken = req.body.refreshToken;
//   console.log("This is my old token", oldRefreshToken);
//   if (!oldRefreshToken) {
//     const err = new Error("Refresh token missing");
//     err.httpStatusCode = 400;
//     next(err);
//   } else {
//     try {
//       const newTokens = await refreshToken(oldRefreshToken);
//       res.send(newTokens);
//     } catch (error) {
//       console.log(error);
//       const err = new Error(error);
//       err.httpStatusCode = 401;
//       next(err);
//     }
//   }
// });

export default router;
