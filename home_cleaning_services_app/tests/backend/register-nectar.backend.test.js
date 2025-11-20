import mongoose from "mongoose";
import { testApiHandler } from "next-test-api-route-handler";
import NectarModel from "/src/models/nectarModel";
import path from "path";
import fs from "fs";
import * as route from "../../../home_cleaning_services_app/src/app/api/users/register-nectar/route.js";
//connect to database
beforeAll(async function () {
  process.env.NODE_ENV = "test";
  await mongoose.connect(process.env.MONGO_DB_URI); //connect to test db
});

//disconnect from database
afterAll(async function () {
  await mongoose.connection.close();
});

//tests for registering as a nectar
describe("Register Nectar", () => {
  it("register as nectar successfully", async () => {
    await testApiHandler({
      appHandler: route,
      test: async ({ fetch }) => {
        const formData = new FormData();
        const imageLocation = path.resolve(__dirname, "profileimage12.png");
        const imageBuffer = fs.readFileSync(imageLocation);
        const profileImage = new File([imageBuffer], "profileimage12.png", {
          type: "image/png",
        });
        formData.append("profileImage", profileImage);
        formData.append("email", "oliver@gmail.com");
        formData.append("password", "hello123");
        formData.append("firstName", "Lola");
        formData.append("lastName", "Oliver");
        formData.append("bio", "I love to clean kitchens");
        formData.append("plan", "standard clean");
        formData.append("city_location", "Minneapolis");
        formData.append("time1", "10");
        formData.append("time2", "10");
        formData.append("time3", "10");
        formData.append("time4", "10");
        formData.append("time5", "10");
        formData.append("timeframe1", "am");
        formData.append("timeframe2", "am");
        formData.append("timeframe3", "am");
        formData.append("timeframe4", "am");
        formData.append("timeframe5", "am");
        formData.append("availabilitydate1", "2025-11-14");
        formData.append("availabilitydate2", "2025-11-14");
        formData.append("availabilitydate3", "2025-11-14");
        formData.append("availabilitydate4", "2025-11-14");
        formData.append("availabilitydate5", "2025-11-14");
        formData.append("address", "123 Hello ST, Minneapolis, MN, 55412");
        formData.append("phoneNumber", "123-456-1234");

        const res = await fetch({
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        expect(data.message).toBe("Lola registered successfully.");
        expect(data.status).toBe(201);
        const user = await NectarModel.findOne({ email: "test@gmail.com" });
        expect(user).not.toBeNull();
      },
    });
  }, 20000);
  it("register as nectar again with same email, does not allow", async () => {
    await testApiHandler({
      appHandler: route,
      test: async ({ fetch }) => {
        const formData = new FormData();
        const imageLocation = path.resolve(__dirname, "profileimage12.png");
        const imageBuffer = fs.readFileSync(imageLocation);
        const profileImage = new File([imageBuffer], "profileimage12.png", {
          type: "image/png",
        });
        formData.append("profileImage", profileImage);
        formData.append("email", "oliver@gmail.com");
        formData.append("password", "hello123");
        formData.append("firstName", "Lola");
        formData.append("lastName", "Oliver");
        formData.append("bio", "I love to clean kitchens");
        formData.append("plan", "standard clean");
        formData.append("city_location", "Minneapolis");
        formData.append("time1", "10");
        formData.append("time2", "10");
        formData.append("time3", "10");
        formData.append("time4", "10");
        formData.append("time5", "10");
        formData.append("timeframe1", "am");
        formData.append("timeframe2", "am");
        formData.append("timeframe3", "am");
        formData.append("timeframe4", "am");
        formData.append("timeframe5", "am");
        formData.append("availabilitydate1", "2025-11-14");
        formData.append("availabilitydate2", "2025-11-14");
        formData.append("availabilitydate3", "2025-11-14");
        formData.append("availabilitydate4", "2025-11-14");
        formData.append("availabilitydate5", "2025-11-14");
        formData.append("address", "123 Hello ST, Minneapolis, MN, 55412");
        formData.append("phoneNumber", "123-456-1234");

        const res = await fetch({
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        expect(data.errors.email).toBe(
          "This email is in use, please enter a different email."
        );
        expect(data.status).toBe(400);
      },
    });
  }, 20000);
});
