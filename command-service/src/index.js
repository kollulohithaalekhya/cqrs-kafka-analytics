import express from "express";
import { env } from "./config/env.js";
import { connectProducer } from "./kafka/producer.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.get("/", (req, res) => {
  res.send("Command Service Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "command-service",
  });
});
const start = async () => {
  await connectProducer();
  app.listen(env.PORT, () =>
    console.log(`Command Service running on ${env.PORT}`)
  );
};

start();