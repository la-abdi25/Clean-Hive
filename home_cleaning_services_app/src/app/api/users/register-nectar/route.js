import { connectToDB } from "../../../../db/dbConfig";
import NectarModel from "../../../../models/nectarModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
//set up S3 credentials
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
//stripe connection
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//connect to db
connectToDB();
//create nectar stripe connected account
async function createNectarAccount(email) {
  try {
    //create stripe accountId from stripe
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });
    return account.id;
  } catch (err) {
    console.log(err);
  }
}
//uploading a profile image to S3 bucket
async function uploadFileToS3(file, fileName) {
  //resize image using sharp
  let resizedBuffer = await sharp(file)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 80 })
    .toBuffer();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: resizedBuffer,
    ContentType: "image/webp",
    CompositionType: "inline",
    //cache images to create faster image load times
    CacheControl: "public, max-age=31536000, immutable",
  };
  //put image in S3 bucket
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  //return the object key
  return params.Key;
}
//handle errors
export const handleErrors = (err) => {
  //initialize an errors object to hold all errors
  let errors = {
    email: "",
    password: "",
    bio: "",
    plan: "",
    address: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    city_location: "",
    availabilityTimes: "",
    profileImage: "",
  };
  //duplicate email exists
  if (err.code === 11000) {
    errors.email = "This email is in use, please enter a different email.";
    return errors;
  }
  //validation errors, all other fields
  if (err.message.includes("nectars validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }
  return errors;
};

//route to register nectar in Nectar Model
export async function POST(request) {
  try {
    //get form data from user
    const formData = await request.formData();
    const file = formData.get("profileImage");
    //if file is empty, send a json response
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required." },
        { status: 400 }
      );
    }
    //convert file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    //fileName holds the object key
    const fileName = await uploadFileToS3(buffer, file.name);

    //transfer formData elements into data object
    let data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    const {
      email,
      password,
      bio,
      plan,
      address,
      phoneNumber,
      firstName,
      lastName,
      city_location,
    } = data;
    var updatedFirstName = firstName.trim();
    //create availability times array
    let availabilityTimes = [];
    //convert to local time to display correct day for user
    const date1 = new Date(data.availabilitydate1 + "T00:00:00");
    const date2 = new Date(data.availabilitydate2 + "T00:00:00");
    const date3 = new Date(data.availabilitydate3 + "T00:00:00");
    const date4 = new Date(data.availabilitydate4 + "T00:00:00");
    const date5 = new Date(data.availabilitydate5 + "T00:00:00");

    //convert times to UTC to compare availability times during user searches
    const utcDate1 = new Date(data.availabilitydate1 + "T00:00:00Z");
    const utcDate2 = new Date(data.availabilitydate2 + "T00:00:00Z");
    const utcDate3 = new Date(data.availabilitydate3 + "T00:00:00Z");
    const utcDate4 = new Date(data.availabilitydate4 + "T00:00:00Z");
    const utcDate5 = new Date(data.availabilitydate5 + "T00:00:00Z");

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    //stored in users local time to display to users
    const formatDate = new Intl.DateTimeFormat("en-US", options);
    const myDate1 = formatDate.format(date1);
    const myDate2 = formatDate.format(date2);
    const myDate3 = formatDate.format(date3);
    const myDate4 = formatDate.format(date4);
    const myDate5 = formatDate.format(date5);
    const availabilitytime1 = `${myDate1} ${data.time1}${data.timeframe1}`;
    const availabilitytime2 = `${myDate2} ${data.time2}${data.timeframe2}`;
    const availabilitytime3 = `${myDate3} ${data.time3}${data.timeframe3}`;
    const availabilitytime4 = `${myDate4} ${data.time4}${data.timeframe4}`;
    const availabilitytime5 = `${myDate5} ${data.time5}${data.timeframe5}`;
    availabilityTimes.push({
      availability_time1: availabilitytime1,
      availability_date1: utcDate1,
      isAvailable: true,
    });
    availabilityTimes.push({
      availability_time2: availabilitytime2,
      availability_date2: utcDate2,
      isAvailable: true,
    });
    availabilityTimes.push({
      availability_time3: availabilitytime3,
      availability_date3: utcDate3,
      isAvailable: true,
    });
    availabilityTimes.push({
      availability_time4: availabilitytime4,
      availability_date4: utcDate4,
      isAvailable: true,
    });
    availabilityTimes.push({
      availability_time5: availabilitytime5,
      availability_date5: utcDate5,
      isAvailable: true,
    });
    //create Stripe accountId
    const accountId = await createNectarAccount(email);
    //try to locate nectar in database
    const nectarUser = await NectarModel.findOne({ email });
    try {
      //check valid fields
      let Nectar = new NectarModel({
        firstName: updatedFirstName,
        lastName,
        email,
        phoneNumber,
        address,
        bio,
        plan,
        profileImage: fileName,
        availability: availabilityTimes,
        city_location,
        password,
        accountId,
      });

      //validate Nectar model
      let error = Nectar.validateSync();
      //if an error occurs throw this error
      if (error) {
        throw error;
      }
      //hash user password before storing in Nectar Model
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const createNectarUser = await NectarModel.create({
        firstName: updatedFirstName,
        lastName,
        email,
        phoneNumber,
        address,
        bio,
        plan,
        profileImage: fileName,
        availability: availabilityTimes,
        city_location,
        password: hashedPassword,
        accountId,
      });
      return NextResponse.json({
        message: `${updatedFirstName} registered successfully.`,
        status: 201,
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    if (err) {
      //catch errors in handleErrors method
      let errors = handleErrors(err);
      //send user error messages to frontend
      return NextResponse.json({
        errors,
        status: 400,
      });
    } else {
      //all other errors handled here
      return NextResponse.json({
        message: "Server Error.",
        error: err.message,
        status: 500,
      });
    }
  }
}
