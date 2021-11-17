import express from "express";
import {
  createOrder,
  getOrderById,
  getOrderAll,
  payOrder,
  getMyOrderList,
  deliverOrder,
} from "../controllers/ordersControllers.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, adminOnly, getOrderAll);

router.get("/:id", authenticate, getOrderById);

router.get("/history/list", authenticate, getMyOrderList);

router.post("/", authenticate, createOrder);

router.put("/:id/deliver", authenticate, adminOnly, deliverOrder);

router.put("/:id/pay", authenticate, payOrder);

export default router;
