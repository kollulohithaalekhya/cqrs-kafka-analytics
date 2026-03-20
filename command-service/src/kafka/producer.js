import { Kafka } from "kafkajs";
import { env } from "../config/env.js";

const kafka = new Kafka({
  clientId: "command-service",
  brokers: [env.KAFKA_BROKER],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  while (true) {
    try {
      await producer.connect();
      console.log("✅ Kafka connected");
      break;
    } catch (err) {
      console.log("⏳ Kafka not ready, retrying in 3s...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};