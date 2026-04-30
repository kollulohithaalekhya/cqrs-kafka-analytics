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

-- PRODUCT SALES (use DECIMAL)
CREATE TABLE product_sales (
  product_id INT PRIMARY KEY,
  total_sales DECIMAL(12,2) DEFAULT 0
);

-- CATEGORY REVENUE
CREATE TABLE category_revenue (
  category VARCHAR(100) PRIMARY KEY,
  total_revenue DECIMAL(12,2) DEFAULT 0
);

-- HOURLY SALES
CREATE TABLE hourly_sales (
  window_start TIMESTAMP,
  window_end TIMESTAMP,
  total_sales DECIMAL(12,2),
  PRIMARY KEY (window_start, window_end)
);

-- INDEXES (important for performance)
CREATE INDEX idx_product_sales_product_id ON product_sales(product_id);
CREATE INDEX idx_category_revenue_category ON category_revenue(category);
CREATE INDEX idx_hourly_sales_window ON hourly_sales(window_start, window_end);