import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../server/app";

let app: Awaited<ReturnType<typeof buildApp>>["app"];
let db: Awaited<ReturnType<typeof buildApp>>["db"];

beforeAll(async () => {
  const built = await buildApp({ dbPath: ":memory:" });
  app = built.app;
  db = built.db;
});

afterAll(async () => {
  await db.close();
});

describe("backend API", () => {
  it("registers, logs in, and returns current user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    }).expect(201);

    const login = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password123",
    }).expect(200);

    expect(login.body.token).toBeTruthy();

    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer " + login.body.token)
      .expect(200);

    expect(me.body.user.email).toBe("test@example.com");
  });

  it("persists portfolio holdings and returns summary", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Portfolio User",
      email: "portfolio@example.com",
      password: "Password123",
    }).expect(201);

    const login = await request(app).post("/api/auth/login").send({
      email: "portfolio@example.com",
      password: "Password123",
    }).expect(200);

    const token = login.body.token;

    await request(app)
      .post("/api/portfolio/holdings")
      .set("Authorization", "Bearer " + token)
      .send({ asset: "Bitcoin", symbol: "BTC", amount: 1.5, value: 100000, pnl: 2500 })
      .expect(201);

    const holdings = await request(app)
      .get("/api/portfolio/holdings")
      .set("Authorization", "Bearer " + token)
      .expect(200);

    expect(holdings.body.data).toHaveLength(1);

    const summary = await request(app)
      .get("/api/portfolio/summary")
      .set("Authorization", "Bearer " + token)
      .expect(200);

    expect(summary.body.data.totalValue).toBe(100000);
    expect(summary.body.data.totalPnl).toBe(2500);
  });
});
