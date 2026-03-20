import request from "supertest";

const BASE_URL = "http://localhost:8081";

describe("Query Service", () => {

  it("Health check", async () => {
    const res = await request(BASE_URL).get("/health");
    expect(res.statusCode).toBe(200);
  });

  it("Product Sales", async () => {
    const res = await request(BASE_URL).get("/api/analytics/product-sales");
    expect(res.statusCode).toBe(200);
  });

  it("Category Revenue", async () => {
    const res = await request(BASE_URL).get("/api/analytics/category-revenue");
    expect(res.statusCode).toBe(200);
  });

  it("Hourly Sales", async () => {
    const res = await request(BASE_URL).get("/api/analytics/hourly-sales");
    expect(res.statusCode).toBe(200);
  });

});