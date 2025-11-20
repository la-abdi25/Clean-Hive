import { NextResponse } from "next/server";
import BookingsModel from "@/models/bookingsModel";
import BeeModel from "@/models/beeModel";
import NectarModel from "@/models/nectarModel";

//route to get all upcoming bookings for a logged in user(bee/nectar)
export async function GET(request, { params }) {
  try {
    //get data from params, id
    const data = await params;
    const id = data.id;
    if (id) {
      const beeUser = await BeeModel.findById(id);
      const nectarUser = await NectarModel.findById(id);

      if (beeUser) {
        const bookings = await BookingsModel.find({
          upcoming: true,
          beeId: id,
        });
        return NextResponse.json(
          {
            message: "Bee upcoming bookings found.",
            bookings,
          },
          { status: 200 }
        );
      } else if (nectarUser) {
        const bookings = await BookingsModel.find({
          upcoming: true,
          nectarId: id,
        });

        return NextResponse.json(
          {
            message: "Nectar upcoming bookings found.",
            bookings,
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      {
        message: "No upcoming bookings found.",
      },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
//route for nectar to accept bee user booking request
export async function PUT(request, { params }) {
  try {
    //capture id from params of url
    const data = await params;
    const bookingId = data.id;
    //if there exists a booking id, find the booking in the Bookings Model
    if (bookingId) {
      //update booking to now upcoming status
      const bookingData = await BookingsModel.updateOne(
        { _id: bookingId },
        {
          $set: {
            upcoming: true,
            cancelled: false,
            completed: false,
            pending: false,
          },
        }
      );
      return NextResponse.json(
        { message: "Booking status updated to upcoming." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Not a valid booking id." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
