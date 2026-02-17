import { vi, describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import app, { connectToDatabase } from "../app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.test" });

let mongoServer;
let adminToken = "";

const adminData = {
  fullname: "Admin User",
  email: "admin@example.com",
  password: "Admin@123",
  mobileNo: "9999999999",
  role: "admin",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await connectToDatabase(mongoUri);

  // Register admin user
  await request(app).post("/api/user/register").send(adminData);
  const loginRes = await request(app)
    .post("/api/user/login")
    .send({ email: adminData.email, password: adminData.password });
  adminToken = loginRes.body.user.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Admin: Get All Users", () => {
  it("should return all users", async () => {
    const res = await request(app)
      .get("/api/admin/getallusers")
      .set("Cookie", `token=${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should not include passwords", async () => {
    const res = await request(app)
      .get("/api/admin/getallusers")
      .set("Cookie", `token=${adminToken}`);

    const user = res.body[0];
    expect(user.password).toBeUndefined();
  });

  it("should fail without token", async () => {
    await request(app).get("/api/admin/getallusers").expect(401);
  });
});

describe("Admin: Get User By Email", () => {
  it("should return 404 for non-existent email", async () => {
    await request(app)
      .get(`/api/admin/getuser?email=nonexistent@example.com`)
      .set("Cookie", `token=${adminToken}`)
      .expect(404);
  });

  it("should return 400 if email is not provided", async () => {
    await request(app)
      .get("/api/admin/getuser")
      .set("Cookie", `token=${adminToken}`)
      .expect(400);
  });

  it("should fail without token", async () => {
    await request(app).get("/api/admin/getuser").expect(401);
  });
});



describe("Admin: Delete Car", () => {
  it("should return 404 if car doesn't exist", async () => {
    await request(app)
      .delete("/api/admin/deletecar")
      .send({ regNumber: "XYZ123" })
      .set("Cookie", `token=${adminToken}`)
      .expect(404);
  });

  it("should return 400 if regNumber not sent", async () => {
    await request(app)
      .delete("/api/admin/deletecar")
      .send({})
      .set("Cookie", `token=${adminToken}`)
      .expect(400);
  });

  it("should fail without auth", async () => {
    await request(app)
      .delete("/api/admin/deletecar")
      .send({ regNumber: "XYZ123" })
      .expect(401);
  });
});