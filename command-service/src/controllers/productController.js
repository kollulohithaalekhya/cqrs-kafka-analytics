import { pool } from "../db/db.js";
import { producer } from "../kafka/producer.js";
import { env } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";

export const createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const result = await pool.query(
      "INSERT INTO products(name, category, price) VALUES($1,$2,$3) RETURNING *",
      [name, category, price]
    );

    const product = result.rows[0];

    const event = {
      eventId: uuidv4(),
      eventType: "ProductCreated",
      timestamp: new Date().toISOString(),
      payload: product,
    };

    await producer.send({
      topic: env.PRODUCT_TOPIC,
      messages: [{ key: String(product.id), value: JSON.stringify(event) }],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};