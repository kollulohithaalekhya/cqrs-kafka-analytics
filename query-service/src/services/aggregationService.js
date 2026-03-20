import { pool } from "../db/db.js";

// in-memory product cache (for JOIN)
const productCache = new Map();

export const handleProductEvent = async (event) => {
  const product = event.payload;

  // store in cache
  productCache.set(product.id, product);
};

export const handleOrderEvent = async (event) => {
  const order = event.payload;

  const items = order.items;

  for (const item of items) {
    const product = productCache.get(item.productId);

    if (!product) continue;

    const totalAmount = item.quantity * item.price;

    // 🔹 PRODUCT SALES
    await pool.query(
      `INSERT INTO product_sales(product_id, total_sales)
       VALUES($1, $2)
       ON CONFLICT (product_id)
       DO UPDATE SET total_sales = product_sales.total_sales + $2`,
      [item.productId, item.quantity]
    );

    // 🔹 CATEGORY REVENUE
    await pool.query(
      `INSERT INTO category_revenue(category, total_revenue)
       VALUES($1, $2)
       ON CONFLICT (category)
       DO UPDATE SET total_revenue = category_revenue.total_revenue + $2`,
      [product.category, totalAmount]
    );

    // 🔹 HOURLY SALES
    const now = new Date();
    const hourStart = new Date(now.setMinutes(0, 0, 0));
    const hourEnd = new Date(hourStart.getTime() + 3600000);

    await pool.query(
      `INSERT INTO hourly_sales(window_start, window_end, total_sales)
       VALUES($1, $2, $3)
       ON CONFLICT (window_start, window_end)
       DO UPDATE SET total_sales = hourly_sales.total_sales + $3`,
      [hourStart, hourEnd, totalAmount]
    );
  }
};