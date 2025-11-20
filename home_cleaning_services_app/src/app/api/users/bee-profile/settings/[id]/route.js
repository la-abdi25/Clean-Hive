import BeeModel from "@/models/beeModel";
import { NextResponse } from "next/server";

//route to update bee user settings information
export async function PUT(request, { params }) {
  try {
    //get bee user inputted data
    const reqBody = await request.json();
    const { address, phoneNumber } = reqBody;
    //get bee id from api url params
    const data = await params;
    const id = data.id;
    if (id) {
      const beeUser = await BeeModel.findById({ _id: id });
      //if bee user exists
      if (beeUser) {
        //user enters a phone number, update data in Bee Model
        if (phoneNumber) {
          const updatedBee = await BeeModel.updateOne(
            { _id: id },
            { $set: { phoneNumber } }
          );
        }
        //user enters an address, update data in Bee Model
        if (address) {
          const updatedBee = await BeeModel.updateOne(
            { _id: id },
            { $set: { address } }
          );
        }
        return NextResponse.json(
          {
            message: `${beeUser.firstName} your data has been updated successfully.`,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Not a valid bee user.",
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        message: "Not a valid id.",
      },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
