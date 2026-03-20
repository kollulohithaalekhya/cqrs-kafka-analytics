import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.COMMAND_SERVICE_PORT || 8080,
  DB_URL: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`,
  KAFKA_BROKER: process.env.KAFKA_BROKER,
  PRODUCT_TOPIC: process.env.PRODUCT_TOPIC,
  ORDER_TOPIC: process.env.ORDER_TOPIC,
};