import { NextResponse } from "next/server";
import { connectToDB } from "@/db/dbConfig";
import NectarModel from "@/models/nectarModel";
import axios from "axios";
//connect to the database
connectToDB();
//route to get all nectars
export const GET = async (request) => {
  try {
    //get all nectar data from Nectar Model
    const nectars = await NectarModel.find({});
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
        //get nectar user profile image from S3 Bucket/CloudFront
        const res = await axios.get(
          `${request.nextUrl.origin}/api/users/nectar-profile/${id}`
        );
        data.availability = nectars[nectar].availability;
        data.profileImage = res.data.url;
        return data;
      })
    );
    return NextResponse.json(
      { message: "Nectars found!", nectars: arr },
      { status: 200 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
};
