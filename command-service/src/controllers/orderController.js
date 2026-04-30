import { pool } from "../db/db.js";
import { producer } from "../kafka/producer.js";
import { env } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // ✅ Idempotency (simple check)
    const existing = await pool.query(
      "SELECT * FROM orders WHERE customer_id=$1 AND items=$2",
      [customerId, JSON.stringify(items)]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO orders(customer_id, status, items) VALUES($1,$2,$3) RETURNING *",
      [customerId, "CREATED", JSON.stringify(items)]
    );

    const order = result.rows[0];

    // ✅ Add schemaVersion
    const event = {
      eventId: uuidv4(),
      schemaVersion: "1.0",
      eventType: "OrderCreated",
      timestamp: new Date().toISOString(),
      payload: order,
    };

    await producer.send({
      topic: env.ORDER_TOPIC,
      messages: [
        {
          key: String(order.id),
          value: JSON.stringify(event),
        },
      ],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );

    const order = result.rows[0];

    const event = {
      eventId: uuidv4(),
      schemaVersion: "1.0",
      eventType: "OrderUpdated",
      timestamp: new Date().toISOString(),
      payload: {
        orderId: id,
        newStatus: status,
      },
    };

    await producer.send({
      topic: env.ORDER_TOPIC,
      messages: [
        {
          key: String(id),
          value: JSON.stringify(event),
        },
      ],
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};