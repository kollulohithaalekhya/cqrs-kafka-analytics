import express from "express";
import {
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.put("/orders/:id/status", updateOrderStatus);

export default router;