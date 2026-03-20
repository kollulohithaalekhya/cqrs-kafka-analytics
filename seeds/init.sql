CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Materialized views (query side tables)
CREATE TABLE product_sales (
  product_id INT PRIMARY KEY,
  total_sales BIGINT DEFAULT 0
);

CREATE TABLE category_revenue (
  category VARCHAR(100) PRIMARY KEY,
  total_revenue BIGINT DEFAULT 0
);

CREATE TABLE hourly_sales (
  window_start TIMESTAMP,
  window_end TIMESTAMP,
  total_sales BIGINT,
  PRIMARY KEY (window_start, window_end)
);