import express from "express";
import {
  newConversation,
  getConversation,
  newMessage,
  getMessages,
} from "../controllers/chatControllers.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/conversations", authenticate, newConversation);

router.get("/conversations/:userId", authenticate, getConversation);

router.post("/messages", authenticate, newMessage);

router.get("/messages/:conversationId", authenticate, getMessages);

export default router;
