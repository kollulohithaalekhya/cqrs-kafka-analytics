import { Kafka } from "kafkajs";
import { env } from "../config/env.js";
import { pool } from "../db/db.js"; // ✅ FIX 1

const kafka = new Kafka({
  clientId: "query-service",
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

// retry connection
const connectConsumer = async () => {
  while (true) {
    try {
      await consumer.connect();
      console.log("✅ Kafka Consumer connected");
      break;
    } catch (err) {
      console.log("⏳ Kafka not ready, retrying...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

export const startConsumer = async () => {
  await connectConsumer();

  await consumer.subscribe({
    topic: process.env.ORDER_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log("🔥 RECEIVED EVENT:", event);

        const data = event.payload;

        for (const item of data.items) {

          // ✅ PRODUCT SALES
          await pool.query(
            `INSERT INTO product_sales (product_id, total_sales)
             VALUES ($1, $2)
             ON CONFLICT (product_id)
             DO UPDATE SET total_sales = product_sales.total_sales + $2`,
            [item.productId, item.quantity]
          );

          console.log("✅ product_sales updated");

          // ✅ CATEGORY REVENUE
          await pool.query(
            `INSERT INTO category_revenue (category, total_revenue)
             VALUES ($1, $2)
             ON CONFLICT (category)
             DO UPDATE SET total_revenue = category_revenue.total_revenue + $2`,
            ["electronics", item.price * item.quantity]
          );

          console.log("✅ category_revenue updated");

          // ✅ HOURLY SALES (FIXED)
          await pool.query(
            `INSERT INTO hourly_sales (window_start, window_end, total_sales)
             VALUES (date_trunc('hour', NOW()), date_trunc('hour', NOW()) + interval '1 hour', $1)
             ON CONFLICT (window_start, window_end)
             DO UPDATE SET total_sales = hourly_sales.total_sales + $1`,
            [item.quantity]
          );

          console.log("✅ hourly_sales updated");
        }
      } catch (err) {
        console.error("❌ Error processing event:", err);
      }
    },
  });
};