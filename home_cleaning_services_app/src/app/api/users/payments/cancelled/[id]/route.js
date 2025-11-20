import PaymentsModel from "@/models/paymentsModel";
import { NextResponse } from "next/server";
import BeeModel from "@/models/beeModel";
import NectarModel from "@/models/nectarModel";
import BookingsModel from "@/models/bookingsModel";

//get cancelled payments for logged in user(bee/nectar)
export async function GET(request, { params }) {
  try {
    //get data from params, id
    const data = await params;
    const id = data.id;
    //check id params exists
    if (id) {
      //check if logged in user if a nectar or bee to find bookings associated with them
      const beeUser = await BeeModel.findById(id);
      const nectarUser = await NectarModel.findById(id);
      if (beeUser) {
        const bookings = await BookingsModel.find({
          beeId: id,
        });
        if (!bookings) {
          return NextResponse.json(
            { message: "No Bookings found." },
            { status: 400 }
          );
        } else {
          var payments = await PaymentsModel.find({
            bookingId: { $in: bookings },
            isCancelled: true,
          });
        }
        return NextResponse.json(
          {
            message: "Bee cancelled payments found.",
            payments,
          },
          { status: 200 }
        );
      } else if (nectarUser) {
        const bookings = await BookingsModel.find({
          nectarId: id,
        });
        if (!bookings) {
          return NextResponse.json(
            { message: "No Bookings found." },
            { status: 400 }
          );
        } else {
          var payments = await PaymentsModel.find({
            bookingId: { $in: bookings },
            isCancelled: true,
          });
        }
        return NextResponse.json(
          {
            message: "Nectar cancelled payments found.",
            payments,
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      {
        message: "User could not be found.",
      },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
