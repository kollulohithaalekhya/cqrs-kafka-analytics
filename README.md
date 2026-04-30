# CQRS Kafka Analytics System

## Overview

This project demonstrates a real-time event-driven microservices architecture using the CQRS (Command Query Responsibility Segregation) pattern with Apache Kafka and PostgreSQL.

The system separates write operations (Command Service) from read/analytics operations (Query Service) and processes data asynchronously using Kafka with stream-processing concepts.

---

## Architecture

Client → Command Service → PostgreSQL  
                      ↓  
                   Kafka  
                      ↓  
        Query Service (Stream Processing) → Analytics Tables  

---

## Flow

1. User sends request to Command Service  
2. Data is stored in PostgreSQL  
3. Event is published to Kafka  
4. Query Service consumes event streams  
5. Stream processing is applied:
   - Product events → stored in in-memory state (KTable simulation)
   - Order events → processed as stream (KStream simulation)
   - Join is performed between product and order streams  
6. Aggregations are computed and stored in analytics tables  

---

## Stream Processing Design

The Query Service simulates Kafka Streams concepts using KafkaJS:

- KTable → Product cache (in-memory state store)  
- KStream → Order events stream  
- Stream-Table Join → Order items joined with product data  
- Aggregations:
  - Product-wise sales  
  - Category-wise revenue  
  - Hourly windowed sales  

---

## Tech Stack

| Technology              | Purpose                  |
| ----------------------- | ------------------------ |
| Node.js + Express       | Backend APIs             |
| PostgreSQL              | Database                 |
| Apache Kafka            | Event streaming          |
| KafkaJS                 | Kafka client             |
| Docker & Docker Compose | Containerization         |
| Jest + Supertest        | Testing                  |

---

## Project Structure

cqrs-kafka-analytics/

command-service/ → Write side  
query-service/ → Stream processing + analytics  
tests/ → API tests  
seeds/ → DB schema  
docker-compose.yml  
.env  
.env.example  
README.md  

---

## Environment Variables

### `.env.example`

```env
DB_HOST=db
DB_PORT=5432
POSTGRES_DB=analytics_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password

KAFKA_BROKER=kafka:9092

PRODUCT_TOPIC=product-events
ORDER_TOPIC=order-events

COMMAND_SERVICE_PORT=8080
QUERY_SERVICE_PORT=8081

KAFKA_GROUP_ID=query-service-group
````

---

## Running the Project

### Start Services

```bash
docker-compose up --build
```

---

### Verify Services

```bash
curl http://localhost:8080/health
curl http://localhost:8081/health
```

---

## API Endpoints

### Command Service

Create Product

```bash
curl -X POST http://localhost:8080/api/products \
-H "Content-Type: application/json" \
-d '{"name":"Phone","category":"electronics","price":500}'
```

Create Order

```bash
curl -X POST http://localhost:8080/api/orders \
-H "Content-Type: application/json" \
-d '{"customerId":1,"items":[{"productId":1,"quantity":2,"price":500}]}'
```

---

### Query Service

Product Sales

```bash
curl http://localhost:8081/api/analytics/product-sales
```

Category Revenue

```bash
curl http://localhost:8081/api/analytics/category-revenue
```

Hourly Sales

```bash
curl http://localhost:8081/api/analytics/hourly-sales
```

---

## Database Schema

Core Tables:

* products
* orders

Analytics Tables:

* product_sales
* category_revenue
* hourly_sales

---

## Event Processing Logic

OrderCreated event triggers:

* Product lookup from state store (KTable simulation)
* Join with order items
* Aggregation updates:

  * Product sales (quantity × price)
  * Category revenue
  * Hourly windowed sales

---

## Testing

```bash
npm install
npm test
```

---

## Kafka Verification

```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list
```

---

## Database Verification

```bash
docker exec -it cqrs_db psql -U user -d analytics_db
```

```sql
SELECT * FROM product_sales;
SELECT * FROM category_revenue;
SELECT * FROM hourly_sales;
```

---

## Features Implemented

* CQRS architecture
* Event-driven microservices
* Stream processing (KStream + KTable simulation)
* Real-time aggregations
* Join between streams
* Windowed analytics
* Dockerized deployment
* Health checks and testing

---

## Real-World Use Cases

* E-commerce analytics
* Real-time dashboards
* Financial transaction monitoring
* Order processing systems

---

## Key Benefits

* Scalable event-driven architecture
* Real-time data processing
* Decoupled services
* Efficient analytics queries

---

## Demo

[https://drive.google.com/file/d/1o0939_Umfka4Ilp5jAnoCPLKHgnUYDAj/view?usp=sharing](https://drive.google.com/file/d/1o0939_Umfka4Ilp5jAnoCPLKHgnUYDAj/view?usp=sharing)

```

---
