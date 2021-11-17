import express from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
} from "../controllers/usersControllers.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, adminOnly, getAllUsers);

router.get("/:id", authenticate, getUserById);

router.post("/:id", deleteUser);

router.put("/:user/favorites/:id", addToFavorites);

router.put("/:user/favorites/:id/remove", removeFromFavorites);

export default router;
