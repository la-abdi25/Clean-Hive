import mongoose from "mongoose";
import { testApiHandler } from "next-test-api-route-handler";
import BeeModel from "/src/models/beeModel";
import * as route from "../../../home_cleaning_services_app/src/app/api/users/register-bee/route.js";

//connect to database

beforeAll(async function () {
  process.env.NODE_ENV = "test";
  await mongoose.connect(process.env.MONGO_DB_URI); // connect to test db
});

//disconnect from database
afterAll(async function () {
  await mongoose.connection.close();
});

//tests for registering as a bee
describe("Register Bee", () => {
  it("register as bee successfully", async () => {
    await testApiHandler({
      appHandler: route,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            firstName: "john",
            lastName: "tyler",
            email: "tyler@gmail.com",
            phoneNumber: "123-234-456",
            address: "123 Hello ST, Minneapolis, MN, 55412",
            password: "hello123",
          }),
        });
        const data = await res.json();
        expect(data.message).toBe("john has been registered successfully.");
        expect(res.status).toBe(201);
        const user = await BeeModel.findOne({ email: "tyler@gmail.com" });
        expect(user).not.toBeNull();
      },
    });
  });
  it("register as bee again with same email, does not allow", async () => {
    await testApiHandler({
      appHandler: route,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            firstName: "john",
            lastName: "tyler",
            email: "tyler@gmail.com",
            phoneNumber: "123-234-456",
            address: "123 Hello ST, Minneapolis, MN, 55412",
            password: "hello123",
          }),
        });
        const data = await res.json();
        expect(data.errors.email).toBe(
          "This email is in use, please enter a different email."
        );
        expect(data.status).toBe(400);
      },
    });
  });
});
