import { NextResponse } from "next/server";
import NectarModel from "../../../../../models/nectarModel";
import BookingsModel from "../../../../../models/bookingsModel";
import PaymentsModel from "../../../../../models/paymentsModel";
import { jwtVerify } from "jose";
import BeeModel from "../../../../../models/beeModel";
import Stripe from "stripe";
import { nanoid } from "nanoid";
//initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//route to create a paymentIntent, create a booking, add a payment to Payment Model
export async function POST(request) {
  try {
    // extract beeNotes, timeSlot, nectarId, paymentId,
    // and amount inputted by user during checkout
    var reqBody = await request.json();
    //locate nectar in Nectar Model
    if (reqBody.nectarId) {
      const nectarUser = await NectarModel.findById({
        _id: reqBody.nectarId,
      });
      if (nectarUser) {
        //locate currently logged in bee to get their account id
        let token = request.cookies.get("jwt")?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        //locate beeUser in Bee Model
        var beeUser = await BeeModel.findById({ _id: payload.id });
        //if beeUser exists
        if (beeUser) {
          //create payment intent, transfer to nectar Stripe account
          var paymentIntent = await stripe.paymentIntents.create({
            amount: reqBody.amount,
            currency: "usd",
            customer: beeUser.accountId,
            capture_method: "automatic",
            payment_method_types: ["card"],
            transfer_data: {
              destination: nectarUser.accountId,
            },
          });
          //if user enters both beeNotes and timeSlots,
          //user has submitted checkout form
          if (reqBody.beeNotes && reqBody.timeSlot) {
            //create a booking identifier
            const bookingRef = `BOOKING-${nanoid()}`;
            const amount = paymentIntent.amount / 100;
            //create booking with associated information
            const booking = await BookingsModel.create({
              nectarId: reqBody.nectarId,
              beeId: beeUser._id,
              beeStripeId: beeUser.accountId,
              nectarStripeId: nectarUser.accountId,
              paymentIntentId: reqBody.paymentId,
              beeNotes: reqBody.beeNotes,
              timeSlot: reqBody.timeSlot,
              amount,
              plan: nectarUser.plan,
              beeName: beeUser.firstName,
              nectarName: nectarUser.firstName,
              beeLocation: beeUser.address,
              bookingRef,
            });
            //ensure timeSlots selected by user is marked as no longer available in Nectar Model
            if (
              reqBody.timeSlot === nectarUser.availability[0].availability_time1
            ) {
              const updateNectar = await NectarModel.updateOne(
                {
                  _id: reqBody.nectarId,
                },
                { $set: { "availability.0.isAvailable": false } }
              );
            }
            if (
              reqBody.timeSlot === nectarUser.availability[1].availability_time2
            ) {
              const updateNectar = await NectarModel.updateOne(
                {
                  _id: reqBody.nectarId,
                },
                { $set: { "availability.1.isAvailable": false } }
              );
            }
            if (
              reqBody.timeSlot === nectarUser.availability[2].availability_time3
            ) {
              const updateNectar = await NectarModel.updateOne(
                {
                  _id: reqBody.nectarId,
                },
                {
                  $set: {
                    "availability.2.isAvailable": false,
                  },
                }
              );
            }
            if (
              reqBody.timeSlot === nectarUser.availability[3].availability_time4
            ) {
              const updateNectar = await NectarModel.updateOne(
                {
                  _id: reqBody.nectarId,
                },
                {
                  $set: {
                    "availability.3.isAvailable": false,
                  },
                }
              );
            }
            if (
              reqBody.timeSlot === nectarUser.availability[4].availability_time5
            ) {
              const updateNectar = await NectarModel.updateOne(
                {
                  _id: reqBody.nectarId,
                },
                { $set: { "availability.4.isAvailable": false } }
              );
            }
            //list charges associated with current payment intent
            if (reqBody.paymentId) {
              const charges = await stripe.charges.list({
                payment_intent: reqBody.paymentId,
              });
              //get the charge information
              const charge = charges.data[0];
              if (charges) {
                //check if charge has succeeded and has been transferred to nectar account
                if (
                  charge.status === "succeeded" &&
                  charge.transfer_data.destination === booking.nectarStripeId
                ) {
                  //list all transfers associated with the destination
                  const transfers = await stripe.transfers.list({
                    destination: charge.transfer_data.destination, // nectar Stripe Account id
                  });
                  //loop through all transfers to locate the one that matches the charge transfer
                  for (const transfer of transfers.data) {
                    if (transfer.id === charge.transfer) {
                      //take a look at the balanceTransaction on the transfer
                      const balanceTransaction =
                        await stripe.balanceTransactions.retrieve(
                          transfer.balance_transaction
                        );
                      //get the date the funds will be available on
                      const availableDate = new Date(
                        balanceTransaction.available_on * 1000
                      ).toLocaleDateString();
                      //get the customers(bees) payment info associated with the charge
                      const card_brand =
                        charge.payment_method_details.card.brand;
                      const card_exp_yr =
                        charge.payment_method_details.card.exp_year;
                      const card_last_4 =
                        charge.payment_method_details.card.last4;
                      //add bee payment data to payment model
                      const paymentData = await PaymentsModel.create({
                        sentToName: booking.nectarName,
                        sentByName: booking.beeName,
                        beePayment: {
                          card_brand,
                          card_last_4,
                          card_exp_yr,
                        },
                        amount: charge.amount / 100,
                        bookingId: booking._id,
                        bookingRef,
                        nectarFundsAvailableOn: availableDate,
                        isInRoute: true,
                        transferId: charge.transfer,
                        chargeId: charge.id,
                      });
                      return NextResponse.json(
                        {
                          message: "Successful booking and payment creation.",
                        },
                        { status: 201 }
                      );
                    }
                  }
                }
              } else {
                return NextResponse.json(
                  {
                    message: "No charges found.",
                  },
                  { status: 400 }
                );
              }
            } else {
              return NextResponse.json(
                {
                  message: "No payment intent id found.",
                },
                { status: 400 }
              );
            }
          } else {
            return NextResponse.json(
              {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                message: "Payment intent created.",
              },
              { status: 201 }
            );
          }
        } else {
          return NextResponse.json(
            {
              message: "Not a valid Bee.",
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            message: "Not a valid Nectar.",
          },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    //all other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
