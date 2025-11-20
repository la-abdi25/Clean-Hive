import { NextResponse } from "next/server";
import BookingsModel from "@/models/bookingsModel";
import BeeModel from "@/models/beeModel";
import NectarModel from "@/models/nectarModel";

//route to get all completed bookings
export async function GET(request, { params }) {
  try {
    //get params data id
    const data = await params;
    const id = data.id;
    //if id exists
    if (id) {
      const beeUser = await BeeModel.findById({ _id: id });
      const nectarUser = await NectarModel.findById({ _id: id });
      //get completed bookings for bee user
      if (beeUser) {
        const bookings = await BookingsModel.find({
          completed: true,
          beeId: id,
        });
        return NextResponse.json(
          {
            message: "Bee completed bookings found.",
            bookings,
          },
          { status: 200 }
        );
        //get completed bookings for nectar user
      } else if (nectarUser) {
        const bookings = await BookingsModel.find({
          completed: true,
          nectarId: id,
        });
        return NextResponse.json(
          {
            message: "Nectar completed bookings found.",
            bookings,
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      { message: "No Bookings found." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
//route for marking a booking as complete
export async function PUT(request, { params }) {
  try {
    //get params data id
    const data = await params;
    const bookingId = data.id;
    //if there exists a booking id, find the booking in the Bookings Model
    if (bookingId) {
      //update booking to now a completed status
      const bookingData = await BookingsModel.updateOne(
        { _id: bookingId },
        {
          $set: {
            upcoming: false,
            cancelled: false,
            completed: true,
            pending: false,
          },
        }
      );
      return NextResponse.json(
        { message: "Booking status updated to completed." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Booking status could not be updated to completed." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
