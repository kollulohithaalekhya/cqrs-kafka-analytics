import { pool } from "../db/db.js";

export const getProductSales = async (req, res) => {
  const result = await pool.query("SELECT * FROM product_sales");
  res.json(result.rows);
};

export const getCategoryRevenue = async (req, res) => {
  const result = await pool.query("SELECT * FROM category_revenue");
  res.json(result.rows);
};

export const getHourlySales = async (req, res) => {
  const result = await pool.query("SELECT * FROM hourly_sales");
  res.json(result.rows);
};