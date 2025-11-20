import { NextResponse } from "next/server";
import { connectToDB } from "@/db/dbConfig";
import NectarModel from "@/models/nectarModel";
import axios from "axios";
//connect to the database
connectToDB();

//route to get all nectars from user search criteria
export const GET = async (request) => {
  try {
    let userInput = {};
    //extract req.query
    const data = request.nextUrl.searchParams;
    const nectarFirstName = data.get("searchValue");
    const cleaningPlan = data.get("plan");
    const rating = data.get("rating");
    const startDate = data.get("startDate");
    const endDate = data.get("endDate");
    const rating1 = rating.charAt(0);
    const rating2 = rating.charAt(2);
    //convert user dates to UTC to compare to dates in Nectar Model to avoid date mismatch
    const sDate = new Date(startDate + "T00:00:00Z");
    const eDate = new Date(endDate + "T00:00:00Z");

    //if user enters a firstName
    if (nectarFirstName) {
      userInput.firstName = nectarFirstName;
    }
    //if user enters a rating
    if (rating) {
      userInput.rating = {
        $gte: rating1,
        $lte: rating2,
      };
    }
    //if user enters a cleaning plan
    if (cleaningPlan) {
      userInput.plan = cleaningPlan;
    }
    //if user enters a start and end date
    if (startDate && endDate) {
      userInput.$or = [
        {
          availability: {
            $elemMatch: { availability_date1: { $gte: sDate, $lte: eDate } },
          },
        },
        {
          availability: {
            $elemMatch: { availability_date2: { $gte: sDate, $lte: eDate } },
          },
        },
        {
          availability: {
            $elemMatch: { availability_date3: { $gte: sDate, $lte: eDate } },
          },
        },
        {
          availability: {
            $elemMatch: { availability_date4: { $gte: sDate, $lte: eDate } },
          },
        },
        {
          availability: {
            $elemMatch: { availability_date5: { $gte: sDate, $lte: eDate } },
          },
        },
      ];
    }
    //construct nectars found
    const nectars = await NectarModel.find(userInput);
    const arr = await Promise.all(
      Object.keys(nectars).map(async (nectar) => {
        let data = {};
        data.availability = [];
        data.id = nectars[nectar]._id;
        data.firstName = nectars[nectar].firstName;
        data.lastName = nectars[nectar].lastName;
        data.bio = nectars[nectar].bio;
        data.plan = nectars[nectar].plan;
        data.city_location = nectars[nectar].city_location;
        data.rating = nectars[nectar].rating;
        nectars[nectar].availability;
        if (nectars[nectar].plan === "standard clean") {
          data.price = 150.0;
        } else if (nectars[nectar].plan === "deep clean") {
          data.price = 250.0;
        } else {
          data.price = 350.0;
        }
        let id = nectars[nectar]._id;
        const res = await axios.get(
          `${request.nextUrl.origin}/api/users/nectar-profile/${id}`
        );
        data.availability = nectars[nectar].availability;
        data.profileImage = res.data.url;
        return data;
      })
    );

    return NextResponse.json(
      {
        message: `Nectars found!`,
        nectars: arr,
      },
      { status: 200 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
};
