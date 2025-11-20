import mongoose from "mongoose";
import { testApiHandler } from "next-test-api-route-handler";
import * as route from "../../src/app/api/users/login/route.js";
//connect to database

beforeAll(async function () {
  process.env.NODE_ENV = "test";
  await mongoose.connect(process.env.MONGO_DB_URI);
});

//disconnect from database
afterAll(async function () {
  await mongoose.connection.close();
});

//tests for logging in as a bee or nectar
describe("Login ", () => {
  describe("login as a bee", () => {
    it("login as bee successfully", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "tyler@gmail.com",
              password: "hello123",
              role: "bee",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe("john logged in successfully.");
          expect(res.status).toBe(200);
          const cookie = res.headers.get("set-cookie");
          expect(cookie).toBeDefined();
        },
      });
    });
    it("login as bee incorrect password", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "tyler@gmail.com",
              password: "hello1234",
              role: "bee",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe(
            "The password entered is incorrect. Please try again."
          );
          expect(res.status).toBe(400);
        },
      });
    });
    it("login as bee incorrect email", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "tyler1@gmail.com",
              password: "hello123",
              role: "bee",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe(
            "User does not exist, please register first."
          );
          expect(res.status).toBe(400);
        },
      });
    });
  });
  describe("login as a nectar", () => {
    it("login as nectar successfully", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "oliver@gmail.com",
              password: "hello123",
              role: "nectar",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe("lola logged in successfully.");
          expect(res.status).toBe(200);
          const cookie = res.headers.get("set-cookie");
          expect(cookie).toBeDefined();
        },
      });
    });
    it("login as nectar incorrect password", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "oliver@gmail.com",
              password: "hello1234",
              role: "nectar",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe(
            "The password entered is incorrect. Please try again."
          );
          expect(res.status).toBe(400);
        },
      });
    });
    it("login as nectar incorrect email", async () => {
      await testApiHandler({
        appHandler: route,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              email: "oliver1@gmail.com",
              password: "hello123",
              role: "nectar",
            }),
          });
          const data = await res.json();
          expect(data.message).toBe(
            "User does not exist, please register first."
          );
          expect(res.status).toBe(400);
        },
      });
    });
  });
});
