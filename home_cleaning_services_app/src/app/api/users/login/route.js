//Login Route
import { connectToDB } from "../../../../db/dbConfig";
import BeeModel from "../../../../models/beeModel";
import NectarModel from "../../../../models/nectarModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
//connect to db
connectToDB();

//route to get currently logged in user info to frontend
export async function GET(request) {
  try {
    //check if token exists
    let token = request.cookies.get("jwt")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (token) {
      const { payload } = await jwtVerify(token, secret);
      //if it does check role of user, bee
      if (payload.role === "bee") {
        const beeUser = await BeeModel.findById({ _id: payload.id });
        if (beeUser) {
          return NextResponse.json(
            {
              firstName: beeUser.firstName,
              userId: beeUser._id,
              message: "Bee user found.",
            },
            { status: 200 }
          );
        }
      } else if (payload.role === "nectar") {
        //if it does check role of user, nectar
        const nectarUser = await NectarModel.findById({ _id: payload.id });
        if (nectarUser) {
          return NextResponse.json(
            {
              firstName: nectarUser.firstName,
              userId: nectarUser._id,
              message: "Nectar user found.",
            },
            { status: 200 }
          );
        }
      }
    }
    return NextResponse.json(
      { message: "User is not logged in." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
//route for logging in users
export async function POST(request) {
  try {
    //get data from the form
    const reqBody = await request.json();
    const { email, password, role } = reqBody;

    //if the user is logging in as a bee, verify email
    if (role === "bee") {
      //find user in the database
      const beeUser = await BeeModel.findOne({ email });
      if (beeUser) {
        const verify = await bcrypt.compare(password, beeUser.password);
        //passwords match, login in user successfully
        if (verify) {
          //create a token data
          const tokenData = { id: beeUser._id, role: "bee" };

          //create token
          const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
          //create response
          const response = NextResponse.json(
            { message: `${beeUser.firstName} logged in successfully.` },
            { status: 200 }
          );
          //set cookies on users browser
          response.cookies.set("jwt", token, { httpOnly: true });
          //send the response
          return response;
        } else {
          return NextResponse.json(
            { message: "The password entered is incorrect. Please try again." },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User does not exist, please register first." },
          { status: 400 }
        );
      }
    }
    //if the user is logging in as a nectar, verify email
    else if (role === "nectar") {
      //verify email exists in database
      const nectarUser = await NectarModel.findOne({ email });
      if (nectarUser) {
        const verify = await bcrypt.compare(password, nectarUser.password);
        //passwords match, login in user successfully
        if (verify) {
          //create a token data
          const tokenData = { id: nectarUser._id, role: "nectar" };
          //create token for user
          const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
          //create a reponse for the user
          const response = NextResponse.json(
            { message: `${nectarUser.firstName} logged in successfully.` },
            { status: 200 }
          );
          //set cookies
          response.cookies.set("jwt", token, { httpOnly: true });
          //return response
          return response;
        } else {
          return NextResponse.json(
            { message: "The password entered is incorrect. Please try again." },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User does not exist, please register first." },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "Please select a role." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
