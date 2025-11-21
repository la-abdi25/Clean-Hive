import { connectToDB } from "@/db/dbConfig";
import NectarModel from "@/models/nectarModel";
import { NextResponse } from "next/server";
//connect to db
connectToDB();

//route to get nectar profile image from S3 bucket/CloudFront
export async function GET(request, { params }) {
  try {
    //get params data, id
    let data = await params;
    const id = data.id;
    if (id) {
      const nectar = await NectarModel.findById({ _id: id });
      if (nectar) {
        const url = `https://${process.env.AWS_CLOUDFRONT_URL}/${nectar.profileImage}`
        return NextResponse.json(
          { message: "Nectar profile image found successfully", url },
          { status: 200 }
        );
      }
    }
    return NextResponse.json(
      { message: "Nectar profile image could not be found." },
      { status: 400 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
