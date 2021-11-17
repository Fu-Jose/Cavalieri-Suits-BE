import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  addProduct,
  removeProduct,
  modifyProduct,
} from "../controllers/productControllers.js";
import { authenticate, adminOnly } from "../middleware/auth.js";
import multer from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/categoria/:category", getProductsByCategory);

router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  adminOnly,
  multer.array("imageUrl", 12),
  addProduct
);

router.post("/:id", authenticate, adminOnly, removeProduct);

router.put("/:id", authenticate, adminOnly, modifyProduct);

export default router;
