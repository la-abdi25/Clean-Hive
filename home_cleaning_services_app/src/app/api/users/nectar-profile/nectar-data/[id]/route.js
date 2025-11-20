import { NextResponse } from "next/server";
import NectarModel from "@/models/nectarModel";
import axios from "axios";
import ReviewsModel from "@/models/reviewsModel";
import mongoose from "mongoose";
//route to retrieve nectar information
export const GET = async (request, { params }) => {
  try {
    //construct nactar data
    var nectarData = {};
    //get data from params, id
    const data = await params;
    var id = data.id;
    if (id) {
      const nectar = await NectarModel.findById({ _id: id });
      //if nectar exists in db
      if (nectar) {
        nectarData.firstName = nectar.firstName;
        nectarData.availability = nectar.availability;
        //locate nectar profile image from S3 Bucket/CloudFront
        const res = await axios.get(
          `${request.nextUrl.origin}/api/users/nectar-profile/${id}`
        );
        nectarData.profileImage = res.data.url;
        if (nectar.plan === "standard clean") {
          nectarData.price = 150.0;
        } else if (nectar.plan === "deep clean") {
          nectarData.price = 250.0;
        } else {
          nectarData.price = 350.0;
        }
        nectarData.id = id;
        nectarData.phoneNumber = nectar.phoneNumber;
        nectarData.bio = nectar.bio;
        nectarData.city_location = nectar.city_location;
        nectarData.plan = nectar.plan;
        nectarData.accountId = nectar.accountId;
        //locate nectar reviews
        var nectarReviews = await ReviewsModel.find({
          nectarId: nectarData.id,
        });
        var numberofReviews = await ReviewsModel.countDocuments({
          nectarId: nectarData.id,
        });
        if (numberofReviews === 0) {
          await NectarModel.updateOne(
            { _id: id },
            {
              $set: { rating: 5 },
            }
          );
          const nectarNewData = await NectarModel.findById({ _id: id });
          nectarData.rating = nectarNewData.rating;
          return NextResponse.json(
            {
              message: "Nectar found successfully.",
              nectarData,
              myReviews: nectarReviews,
              idExists: true,
            },
            { status: 200 }
          );
        } else {
          //nectar reviews are more than 1
          const userId = mongoose.Types.ObjectId.createFromHexString(
            nectarData.id
          );
          //calculate average rating for nectar
          const rating = await ReviewsModel.aggregate([
            { $match: { nectarId: userId } },
            {
              $group: {
                _id: "$nectarId",
                averageRating: { $avg: "$rating" },
              },
            },
          ]);
          if (rating[0]?.averageRating) {
            nectarData.rating = rating[0].averageRating.toFixed(1);
            const nectarUser = await NectarModel.updateOne(
              { _id: nectarData.id },
              {
                $set: { rating: nectarData.rating },
              }
            );
          }
          //locate top reviews for nectar
          var topReviews = await ReviewsModel.find({ nectarId: nectarData.id })
            .sort({
              rating: -1,
            })
            .limit(4);

          //construct top reviews
          let myReviews = topReviews.map((myReview) => {
            let date = new Date(myReview.createdAt);
            let newTime = date
              .toLocaleString("en-US", {
                timeZone: "America/Chicago",
                timeStyle: "short",
                dateStyle: "short",
              })
              .replace(",", " at");
            myReview.createdAt = newTime;
            //return review data
            return {
              beeName: myReview.beeName,
              date: newTime,
              review: myReview.review,
              rating: myReview.rating,
              plan: myReview.plan,
              beeLocation: myReview.beeLocation,
            };
          });
          return NextResponse.json(
            {
              message: "Nectar data found successfully.",
              nectarData,
              myReviews,
              idExists: true,
            },
            { status: 200 }
          );
        }
      } else {
        //user enters something that is not an Object Id, and id does not exist in Nectar Model
        return NextResponse.json(
          { message: "Nectar does not exist.", idExists: false },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "Not a valid Nectar id." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
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
