import mongoose from "mongoose";
import { testApiHandler } from "next-test-api-route-handler";
import * as route from "../../../home_cleaning_services_app/src/app/api/users/bee-profile/nectar-reviews/[id]/route.js";
//connect to database
beforeAll(async function () {
  process.env.NODE_ENV = "test";
  await mongoose.connect(process.env.MONGO_DB_URI); // connect to test db
});

//disconnect from database
afterAll(async function () {
  await mongoose.connection.close();
});

//tests for adding a review as a bee
describe("Create a review", () => {
  it("create a review as bee", async () => {
    await testApiHandler({
      params: { id: "6914d905ef8c7a58de37c167" },
      appHandler: route,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          url: `/bee-profile/nectar-reviews/[id]`,
          body: JSON.stringify({
            rating: 4,
            review: "Lola cleaned my bathroom very well!",
            plan: "standard clean",
            beeId: "6914d17e75f2bd4cc7d7d343",
          }),
        });
        const data = await res.json();
        expect(res.status).toBe(201);
        expect(data.message).toBe("Review for john added successfully.");
      },
    });
  });
});
