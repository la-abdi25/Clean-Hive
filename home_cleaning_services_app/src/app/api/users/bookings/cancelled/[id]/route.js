import { NextResponse } from "next/server";
import BookingsModel from "@/models/bookingsModel";
import BeeModel from "@/models/beeModel";
import NectarModel from "@/models/nectarModel";
import PaymentsModel from "@/models/paymentsModel";
import Stripe from "stripe";
//initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//route to get all cancelled bookings for a logged in user(nectar/bee)
export async function GET(request, { params }) {
  try {
    //get id from params api url
    const data = await params;
    const id = data.id;
    if (id) {
      //locate either bee in Bee Model or nectar in Nectar Model
      const beeUser = await BeeModel.findById({ _id: id });
      const nectarUser = await NectarModel.findById({ _id: id });
      //get cancelled bookings for bee user
      if (beeUser) {
        const bookings = await BookingsModel.find({
          cancelled: true,
          beeId: id,
        });
        return NextResponse.json(
          {
            message: "Bee cancelled bookings found.",
            bookings,
          },
          { status: 200 }
        );
      } else if (nectarUser) {
        //get cancelled bookings for nectar user
        const bookings = await BookingsModel.find({
          cancelled: true,
          nectarId: id,
        });
        return NextResponse.json(
          {
            message: "Nectar cancelled bookings found.",
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

//route for bee or nectar to cancel a booking
export async function PUT(request, { params }) {
  try {
    //capture id from params of url
    const data = await params;
    var bookingId = data.id;
    //if there exists a booking id, find the booking in the BookingsModel
    if (bookingId) {
      var booking = await BookingsModel.findById({ _id: bookingId });
      if (booking) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          booking.paymentIntentId
        );
        //review the payment intent status and cancel
        if (
          paymentIntent.status === "requires_payment_method" ||
          paymentIntent.status === "requires_confirmation"
        ) {
          const cancelPaymentIntent = await stripe.paymentIntents.cancel(
            booking.paymentIntentId
          );
          const bookingData = await BookingsModel.updateOne(
            { _id: bookingId },
            {
              $set: {
                upcoming: false,
                cancelled: true,
                completed: false,
                pending: false,
              },
            }
          );
          return NextResponse.json(
            { message: "Booking status updated to cancelled." },
            { status: 200 }
          );
        } else if (paymentIntent.status === "succeeded") {
          //create a refund for bee user
          const refund = await stripe.refunds.create({
            payment_intent: booking.paymentIntentId,
          });
          if (refund.status === "succeeded") {
            //refund status succeeded, retrieve refund data
            const refundData = await stripe.refunds.retrieve(refund.id);
            const balanceTransaction =
              await stripe.balanceTransactions.retrieve(
                refundData.balance_transaction
              );
            //retrieve refund available on date
            var refundDate = new Date(
              balanceTransaction.available_on * 1000
            ).toLocaleDateString();
            const paymentInfo = await PaymentsModel.findOne({ bookingId });
            //find payment, and capture refund and transfer data
            if (paymentInfo) {
              //reverse transfer
              const transferReversal = await stripe.transfers.createReversal(
                paymentInfo.transferId
              );
              if (transferReversal) {
                const reversal = await stripe.transfers.retrieveReversal(
                  paymentInfo.transferId,
                  transferReversal.id
                );
                const balanceTransaction2 =
                  await stripe.balanceTransactions.retrieve(
                    transferReversal.balance_transaction
                  );
                //get transfer reversal date
                const transferReversalDate = new Date(
                  balanceTransaction2.available_on * 1000
                ).toLocaleDateString();
                //update data in payment model
                const paymentData = await PaymentsModel.updateOne(
                  { bookingId: booking._id },
                  {
                    $set: {
                      isCancelled: true,
                      isInRoute: false,
                      transferReversalDate,
                      refundDate,
                    },
                  }
                );
                //update booking to now cancelled status
                const bookingData = await BookingsModel.updateOne(
                  { _id: bookingId },
                  {
                    $set: {
                      upcoming: false,
                      cancelled: true,
                      completed: false,
                      pending: false,
                    },
                  }
                );
                //success response
                return NextResponse.json(
                  {
                    message: "Booking and payment status updated to cancelled.",
                  },
                  { status: 200 }
                );
              }
            } else {
              return NextResponse.json(
                { message: "No payment data found." },
                { status: 400 }
              );
            }
          }
        }
      } else {
        return NextResponse.json(
          { message: "Booking does not exist." },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "Booking data not found." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
