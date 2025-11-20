import { NextResponse } from "next/server";
import NectarModel from "@/models/nectarModel";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//route to generate a Stripe account link for nectar user
export async function GET(request, { params }) {
  try {
    //get nectar id from params
    const data = await params;
    //locate nectar user in Nectar Model
    const nectarUser = await NectarModel.findById({ _id: data.id });
    if (nectarUser) {
      //create a Stripe payment account link, payment button in Nectar Settings tab
      const accountLink = await stripe.accountLinks.create({
        account: nectarUser.accountId,
        refresh_url: "http://localhost:3000/nectar-profile/settings",
        return_url: "http://localhost:3000/nectar-profile",
        type: "account_onboarding",
      });
      return NextResponse.json(
        {
          message: "Nectar Stripe account link generated.",
          url: accountLink.url,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Nectar user could not be found." },
        { status: 400 }
      );
    }
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}

//route to update nectar information in Nectar Model
export async function PUT(request, { params }) {
  try {
    //get data from params, id
    const data = await params;
    const id = data.id;
    const reqBody = await request.json();
    const nectarUser = await NectarModel.findById({ _id: id });
    if (id) {
      if (reqBody.phoneNumber) {
        const nectarUser = await NectarModel.findById({ _id: id });
        if (nectarUser) {
          const updateNectarUser = await NectarModel.updateOne(
            { _id: id },
            {
              $set: { phoneNumber: reqBody.phoneNumber },
            }
          );
        }
      }
      if (reqBody.bio) {
        const nectarUser = await NectarModel.findById({ _id: id });
        if (nectarUser) {
          const updateNectarUser = await NectarModel.updateOne(
            { _id: id },
            {
              $set: { bio: reqBody.bio },
            }
          );
        }
      }
      if (reqBody.plan) {
        const nectarUser = await NectarModel.findById({ _id: id });
        if (nectarUser) {
          const updateNectarUser = await NectarModel.updateOne(
            { _id: id },
            {
              $set: { plan: reqBody.plan },
            }
          );
        }
      }
      //convert dates to UTC
      const dateUTC1 = new Date(reqBody.availabilitydate1 + "T00:00:00Z");

      const dateUTC2 = new Date(reqBody.availabilitydate2 + "T00:00:00Z");

      const dateUTC3 = new Date(reqBody.availabilitydate3 + "T00:00:00Z");

      const dateUTC4 = new Date(reqBody.availabilitydate4 + "T00:00:00Z");

      const dateUTC5 = new Date(reqBody.availabilitydate5 + "T00:00:00Z");

      //create availability times array
      var availabilityTimes = [];
      //view dates in user local time
      if (reqBody.availabilitydate1) {
        var date1 = new Date(reqBody.availabilitydate1 + "T00:00:00");
      }
      if (reqBody.availabilitydate2) {
        var date2 = new Date(reqBody.availabilitydate2 + "T00:00:00");
      }
      if (reqBody.availabilitydate3) {
        var date3 = new Date(reqBody.availabilitydate3 + "T00:00:00");
      }
      if (reqBody.availabilitydate4) {
        var date4 = new Date(reqBody.availabilitydate4 + "T00:00:00");
      }
      if (reqBody.availabilitydate5) {
        var date5 = new Date(reqBody.availabilitydate5 + "T00:00:00");
      }

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      //format date in day of the week, date, and time format
      const formatDate = new Intl.DateTimeFormat("en-US", options);
      if (date1) {
        var myDate1 = formatDate.format(date1);
        const availabilitytime1 = `${myDate1} ${reqBody.time1}${reqBody.timeframe1}`;
        availabilityTimes.push({
          availability_time1: availabilitytime1,
          availability_date1: dateUTC1,
          isAvailable: true,
        });
      }
      if (date2) {
        var myDate2 = formatDate.format(date2);
        const availabilitytime2 = `${myDate2} ${reqBody.time2}${reqBody.timeframe2}`;
        availabilityTimes.push({
          availability_time2: availabilitytime2,
          availability_date2: dateUTC2,
          isAvailable: true,
        });
      }
      if (date3) {
        var myDate3 = formatDate.format(date3);
        const availabilitytime3 = `${myDate3} ${reqBody.time3}${reqBody.timeframe3}`;
        availabilityTimes.push({
          availability_time3: availabilitytime3,
          availability_date3: dateUTC3,
          isAvailable: true,
        });
      }
      if (date4) {
        var myDate4 = formatDate.format(date4);
        const availabilitytime4 = `${myDate4} ${reqBody.time4}${reqBody.timeframe4}`;
        availabilityTimes.push({
          availability_time4: availabilitytime4,
          availability_date4: dateUTC4,
          isAvailable: true,
        });
      }
      if (date5) {
        var myDate5 = formatDate.format(date5);
        const availabilitytime5 = `${myDate5} ${reqBody.time5}${reqBody.timeframe5}`;
        availabilityTimes.push({
          availability_time5: availabilitytime5,
          availability_date5: dateUTC5,
          isAvailable: true,
        });
      }
      const newArr = [];
      for (let i = 0; i < availabilityTimes.length; i++) {
        const nectarUser = await NectarModel.findById({ _id: id });
        if (availabilityTimes[i].availability_time1) {
          if (nectarUser) {
            const updateNectarUser = await NectarModel.updateOne(
              { _id: id },
              {
                $set: {
                  "availability.0.availability_time1":
                    availabilityTimes[i].availability_time1,
                  "availability.0.isAvailable":
                    availabilityTimes[i].isAvailable,
                  "availability.0.availability_date1":
                    availabilityTimes[i].availability_date1,
                },
              }
            );
          }
        } else if (availabilityTimes[i].availability_time2) {
          if (nectarUser) {
            const updateNectarUser = await NectarModel.updateOne(
              { _id: id },
              {
                $set: {
                  "availability.1.availability_time2":
                    availabilityTimes[i].availability_time2,
                  "availability.1.isAvailable":
                    availabilityTimes[i].isAvailable,
                  "availability.1.availability_date2":
                    availabilityTimes[i].availability_date2,
                },
              }
            );
          }
        } else if (availabilityTimes[i].availability_time3) {
          if (nectarUser) {
            const updateNectarUser = await NectarModel.updateOne(
              { _id: id },
              {
                $set: {
                  "availability.2.availability_time3":
                    availabilityTimes[i].availability_time3,
                  "availability.2.isAvailable":
                    availabilityTimes[i].isAvailable,
                  "availability.2.availability_date3":
                    availabilityTimes[i].availability_date3,
                },
              }
            );
          }
        } else if (availabilityTimes[i].availability_time4) {
          if (nectarUser) {
            const updateNectarUser = await NectarModel.updateOne(
              { _id: id },
              {
                $set: {
                  "availability.3.availability_time4":
                    availabilityTimes[i].availability_time4,
                  "availability.3.isAvailable":
                    availabilityTimes[i].isAvailable,
                  "availability.3.availability_date4":
                    availabilityTimes[i].availability_date4,
                },
              }
            );
          }
        } else if (availabilityTimes[i].availability_time5) {
          if (nectarUser) {
            const updateNectarUser = await NectarModel.updateOne(
              { _id: id },
              {
                $set: {
                  "availability.4.availability_time5":
                    availabilityTimes[i].availability_time5,
                  "availability.4.isAvailable":
                    availabilityTimes[i].isAvailable,
                  "availability.4.availability_date5":
                    availabilityTimes[i].availability_date5,
                },
              }
            );
          }
        }
      }
      return NextResponse.json({
        message: `${nectarUser.firstName} your data has been updated successfully.`,
        status: 200,
      });
    }
    return NextResponse.json({
      message: "Not a valid nectar id.",
      status: 400,
    });
  } catch (err) {
    //All other errors
    return NextResponse.json({
      message: "Server Error.",
      status: 500,
    });
  }
}
