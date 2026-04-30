import express from "express";
import {
  getProductSales,
  getCategoryRevenue,
  getHourlySales,
} from "../controllers/analyticsController.js";

const router = express.Router();

// ✅ Separate routes (NO optional params)
router.get("/analytics/product-sales", getProductSales);
router.get("/analytics/product-sales/:productId", getProductSales);

router.get("/analytics/category-revenue", getCategoryRevenue);
router.get("/analytics/category-revenue/:category", getCategoryRevenue);

router.get("/analytics/hourly-sales", getHourlySales);

export default router;