import { vi, describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { connectToDatabase } from "../app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.test" });

let mongoServer;

beforeAll(async () => {
  //   console.log = vi.fn();
  //   console.error = vi.fn();
  //   console.warn = vi.fn();

  // Start the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory DB
  await connectToDatabase(mongoUri);
});

afterAll(async () => {
  // Clean up: Close the database connection and stop the in-memory server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

const userData = {
  fullname: "Dummy user",
  email: "dummyx@gmail.com",
  password: "Password@123",
  mobileNo: "1234567890",
  role: "user",
};

describe("Auth routes", () => {
  it("should return 401 for protected route when no token is provided", async () => {
    const res = await request(app).get("/api/user/profile").expect(401);

    expect(res.body).toEqual({
      message: "Access denied. No token provided Here.",
      success: false,
    });
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send(userData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  let token;
  it("should login as the user", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: userData.email, password: userData.password })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.success).toBe(true);
    token = res.body.user.token; // Access the token inside user object
    expect(token).toBeDefined();
  });

  it("should fetch profile for authenticated user", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Cookie", `token=${token}`)
      .expect(200);

    expect(res.body.email).toBe(userData.email); // Check the email
  });

  it("should delete logged in user", async () => {
    await request(app)
      .post("/api/user/deleteAccount")
      .set("Cookie", `token=${token}`)
      .expect(200);
  });

  it("should fail login after user account is deleted", async () => {
    await request(app)
      .post("/api/user/login")
      .send({ email: userData.email, password: userData.password })
      .expect(401);
  });
});
