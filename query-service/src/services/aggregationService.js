import { pool } from "../db/db.js";

// KTable simulation
const productCache = new Map();

export const handleProductEvent = async (event) => {
  const product = event.payload;
  productCache.set(product.id, product);
};

export const handleOrderEvent = async (event) => {
  const order = event.payload;

  for (const item of order.items) {
    const product = productCache.get(item.productId);

    if (!product) {
      console.log("⚠ Product not found, skipping...");
      continue;
    }

    const totalValue = item.quantity * item.price;

    // ✅ PRODUCT SALES (correct value)
    await pool.query(
      `INSERT INTO product_sales(product_id, total_sales)
       VALUES($1, $2)
       ON CONFLICT (product_id)
       DO UPDATE SET total_sales = product_sales.total_sales + $2`,
      [item.productId, totalValue]
    );

    // ✅ CATEGORY REVENUE (dynamic category)
    await pool.query(
      `INSERT INTO category_revenue(category, total_revenue)
       VALUES($1, $2)
       ON CONFLICT (category)
       DO UPDATE SET total_revenue = category_revenue.total_revenue + $2`,
      [product.category, totalValue]
    );

    // ✅ WINDOW (use event timestamp)
    const eventTime = new Date(event.timestamp);

    const hourStart = new Date(eventTime);
    hourStart.setMinutes(0, 0, 0);

    const hourEnd = new Date(hourStart.getTime() + 3600000);

    await pool.query(
      `INSERT INTO hourly_sales(window_start, window_end, total_sales)
       VALUES($1, $2, $3)
       ON CONFLICT (window_start, window_end)
       DO UPDATE SET total_sales = hourly_sales.total_sales + $3`,
      [hourStart, hourEnd, totalValue]
    );
  }
};