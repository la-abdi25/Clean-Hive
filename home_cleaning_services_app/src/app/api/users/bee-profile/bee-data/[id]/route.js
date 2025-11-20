import { NextResponse } from "next/server";
import BeeModel from "@/models/beeModel";

//route that retrieves bee information
export const GET = async (request, { params }) => {
  try {
    //holds bee data
    const beeData = {};
    //get id from params in api url
    const data = await params;
    const id = data.id;
    //if id exists locate id in the Bee model
    if (id) {
      const bee = await BeeModel.findById({ _id: id });
      //if bee exists, construct beeData to hold bee information
      if (bee) {
        beeData.firstName = bee.firstName;
        beeData.lastName = bee.lastName;
        beeData.id = id;
        beeData.address = bee.address;
        beeData.phoneNumber = bee.phoneNumber;
        beeData.email = bee.email;
        beeData.accountId = bee.accountId;
        //return success response
        return NextResponse.json(
          {
            message: "Bee information found successfully.",
            beeData,
            idExists: true,
          },
          { status: 200 }
        );
      } else {
        //user enters something that is not an Object Id, and id does not exist in Bee Model
        return NextResponse.json(
          { message: "Bee does not exist.", idExists: false },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Not a valid bee id." },
        { status: 400 }
      );
    }
  } catch (err) {
    //all other errors
    //user enters something that is not an Object Id
    if (err.message.includes("Cast to ObjectId failed for value")) {
      return NextResponse.json(
        { message: "Cast Error.", idExists: false },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: "Server Error." }, { status: 500 });
    }
  }
};
