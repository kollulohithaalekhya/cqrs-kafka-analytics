import { Kafka } from "kafkajs";
import { env } from "../config/env.js";
import { handleProductEvent, handleOrderEvent } from "../services/aggregationService.js";

const kafka = new Kafka({
  clientId: "query-service",
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

export const startConsumer = async () => {
  await consumer.connect();

  // ✅ Subscribe BOTH topics (join simulation)
  await consumer.subscribe({ topic: env.PRODUCT_TOPIC, fromBeginning: true });
  await consumer.subscribe({ topic: env.ORDER_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());

      if (event.eventType === "ProductCreated") {
        await handleProductEvent(event);   // KTable
      }

      if (event.eventType === "OrderCreated") {
        await handleOrderEvent(event);     // KStream
      }
    },
  });
};