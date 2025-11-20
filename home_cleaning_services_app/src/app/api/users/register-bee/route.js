import { connectToDB } from "../../../../db/dbConfig";
import BeeModel from "../../../../models/beeModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

//connect to stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//connect to db
connectToDB();

// create customer stripe account id
async function createCustomerAccount(name, email) {
  try {
    const customer = await stripe.customers.create({
      name,
      email,
    });
    return customer.id;
  } catch (err) {
    console.log(err);
  }
}
//handle errors
export const handleErrors = (err) => {
  //initialize an errors object to hold all errors
  let errors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  };
  //duplicate email exists
  if (err.code === 11000) {
    errors.email = "This email is in use, please enter a different email.";
    return errors;
  }
  //validation errors, all other fields
  if (err.message.includes("bees validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }
  return errors;
};
//route for handling registration for bees(customers)
export async function POST(request) {
  try {
    //data from form entered by user
    const reqBody = await request.json();
    //retrieve data
    const { firstName, lastName, email, phoneNumber, address, password } =
      reqBody;
    //create stripe account
    const accountId = await createCustomerAccount(firstName, email);
    //Try to see if a bee has already registered with this email in the database
    const beeUser = await BeeModel.findOne({ email });
    try {
      //check valid fields
      let Bee = new BeeModel({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        accountId,
      });
      let error = Bee.validateSync();
      //if an error occurs throw this error
      if (error) {
        throw error;
      }
      //hash password for bee user in Bee Model
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const createBeeUser = await BeeModel.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password: hashedPassword,
        accountId,
      });
      //send bee user a successful response
      return NextResponse.json(
        {
          firstName,
          message: `${firstName} has been registered successfully.`,
        },

        { status: 201 }
      );
    } catch (err) {
      throw err;
    }
  } catch (err) {
    if (err) {
      //catch errors in handleErrors method
      let errors = handleErrors(err);
      //send users error messages to frontend
      return NextResponse.json({
        errors,
        status: 400,
      });
    } else {
      //all other errors handled here
      return NextResponse.json({
        message: "Server Error.",
        status: 500,
      });
    }
  }
}
