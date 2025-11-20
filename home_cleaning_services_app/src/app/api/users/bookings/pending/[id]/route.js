import { NextResponse } from "next/server";
import BookingsModel from "@/models/bookingsModel";
import BeeModel from "@/models/beeModel";
import NectarModel from "@/models/nectarModel";

//route to get all pending bookings for a logged in user
export async function GET(request, { params }) {
  try {
    //get params data, id
    const data = await params;
    //if id exists
    if (data.id) {
      const id = data.id;
      const beeUser = await BeeModel.findById(id);
      const nectarUser = await NectarModel.findById(id);
      //if bee user get their pending bookings
      if (beeUser) {
        const bookings = await BookingsModel.find({
          pending: true,
          beeId: id,
        });
        return NextResponse.json(
          {
            message: "Bee pending bookings found.",
            bookings,
          },
          { status: 200 }
        );
      } else if (nectarUser) {
        //if nectar user get their pending bookings
        const bookings = await BookingsModel.find({
          pending: true,
          nectarId: id,
        });
        return NextResponse.json(
          {
            message: "Nectar pending bookings found.",
            bookings,
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      { message: "No pending bookings found." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
