import { NextResponse } from "next/server";
import ReviewsModel from "../../../../../../models/reviewsModel";
import BeeModel from "../../../../../../models/beeModel";
import NectarModel from "../../../../../../models/nectarModel";

//route to allow bee user to add a review to the nectar reviews page
export async function POST(request, { params }) {
  try {
    //get data from params api url
    const data = await params;
    const id = data.id;
    //get data from request body
    const reqBody = await request.json();
    //extract rating, review, plan, and beeId
    const { rating, review, plan, beeId } = reqBody;
    //if there is an id and beeId
    if (id && beeId) {
      const beeUser = await BeeModel.findById({ _id: beeId });
      const nectarUser = await NectarModel.findById({ _id: id });
      //check if both beeUser and nectarUser exist
      if (nectarUser && beeUser) {
        //create a review in the reviews model
        const createReview = await ReviewsModel.create({
          rating,
          review,
          plan,
          beeId,
          nectarId: id,
          beeName: beeUser.firstName,
          beeLocation: "Minneapolis, MN",
        });
        //a review has been added
        return NextResponse.json(
          { message: `Review for ${beeUser.firstName} added successfully.` },
          { status: 201 }
        );
      }
    }
    return NextResponse.json(
      { message: `Review could not be added.` },
      { status: 400 }
    );
  } catch (err) {
    //all other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}

//route to get all the reviews for a specific nectar
export async function GET(request, { params }) {
  try {
    //get data from params api url
    const data = await params;
    const id = data.id;
    //if nectar id exists
    if (id) {
      //check nectar in Nectar Model
      const nectarUser = await NectarModel.findById({ _id: id });
      //if nectar data exists
      if (nectarUser) {
        //find associated reviews
        var reviews = await ReviewsModel.find({
          nectarId: id,
        });
        //create a reviews array
        let myReviews = reviews.map((myReview) => {
          let date = new Date(myReview.createdAt);
          let newTime = date
            .toLocaleString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
              dateStyle: "short",
            })
            .replace(",", " at");
          //show createdAt time for review
          myReview.createdAt = newTime;
          //return an object with review data
          return {
            id: myReview._id,
            beeId: myReview.beeId,
            beeName: myReview.beeName,
            date: newTime,
            review: myReview.review,
            rating: myReview.rating,
            plan: myReview.plan,
            beeLocation: myReview.beeLocation,
          };
        });
        //return success response
        return NextResponse.json(
          {
            message: `Reviews for ${nectarUser.firstName} found successfully.`,
            myReviews,
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      { message: `Reviews could not be found.` },
      { status: 400 }
    );
  } catch (err) {
    // all other errors
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

//route that allows bee user to delete a review
export async function DELETE(request, { params }) {
  try {
    //get data from params api url
    const data = await params;
    //review id to delete
    const id = data.id;
    //if id is valid
    if (id) {
      const review = await ReviewsModel.find({
        _id: id,
      });
      //if review exists, delete the review
      if (review) {
        const deleteReview = await ReviewsModel.deleteOne({ _id: id });
        return NextResponse.json(
          { message: `Review has been deleted.` },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: `Review could not be found.` },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: `Review id is not valid.` },
      { status: 400 }
    );
  } catch (err) {
    //all other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
