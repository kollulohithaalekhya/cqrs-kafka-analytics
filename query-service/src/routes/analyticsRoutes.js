import express from "express";
import {
  getProductSales,
  getCategoryRevenue,
  getHourlySales,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics/product-sales", getProductSales);
router.get("/analytics/category-revenue", getCategoryRevenue);
router.get("/analytics/hourly-sales", getHourlySales);

export default router;