import express from "express";
import { env } from "./config/env.js";
import { startConsumer } from "./kafka/consumer.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

app.use("/api", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Query Service Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "query-service",
  });
});

// ✅ START SERVER FIRST (IMPORTANT FIX)
app.listen(env.PORT, () => {
  console.log(`Query Service running on ${env.PORT}`);
});

// ✅ RUN CONSUMER IN BACKGROUND
startConsumer().catch(err => {
  console.error("❌ Kafka Consumer Error:", err.message);
});