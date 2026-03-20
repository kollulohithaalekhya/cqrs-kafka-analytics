import request from "supertest";

const BASE_URL = "http://localhost:8080";

describe("Command Service", () => {

  it("Health check", async () => {
    const res = await request(BASE_URL).get("/health");
    expect(res.statusCode).toBe(200);
  });

  it("Create Product", async () => {
    const res = await request(BASE_URL)
      .post("/api/products")
      .send({
        name: "Test Phone",
        category: "electronics",
        price: 500,
      });

    expect(res.statusCode).toBe(201); // ✅ FIXED
    expect(res.body.name).toBe("Test Phone");
  });

  it("Create Order", async () => {
    const res = await request(BASE_URL)
      .post("/api/orders")
      .send({
        customerId: 1,
        items: [{ productId: 1, quantity: 2, price: 500 }],
      });

    expect(res.statusCode).toBe(201); // ✅ FIXED
  });

});