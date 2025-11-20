"use client";
import NavBarForms from "../../components/NavBar-Forms";
import Link from "next/link";
import { useState } from "react";
import "../../styles/RegisterBee.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LoadingSmall from "../../components/LoadingSmall";

// bee/customer registration page
const RegisterBee = () => {
  //errors from the backend
  const initialBackErrs = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [backErrors, setBackErrors] = useState(initialBackErrs);
  const router = useRouter();
  //phone number pattern validation
  const pattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
  //create a bee object with data from form
  const initialBee = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  };
  const [bee, setBee] = useState(initialBee);
  //errors from frontend
  const [beeErrors, setBeeErrors] = useState({});

  //check if bee/customer form fields are valid
  const isValid = () => {
    let beeErr = {};
    if (!bee.firstName) {
      beeErr.firstName = "Please enter your first name.";
    }
    if (!bee.lastName) {
      beeErr.lastName = "Please enter your last name.";
    }
    if (!bee.email) {
      beeErr.email = "Please enter your email.";
    }
    if (!bee.phoneNumber.match(pattern)) {
      beeErr.phoneNumber = "Please enter a valid phone number.";
    }
    if (!bee.address) {
      beeErr.address = "Please enter your address.";
    }
    if (!bee.password) {
      beeErr.password = "Please enter your password.";
    }
    setBeeErrors(beeErr);
    //if true, data entered is valid
    return Object.keys(beeErr).length === 0;
  };

  //registers bee/customer via backend api call
  const handleBeeSubmit = async (e) => {
    e.preventDefault();
    try {
      //user data is valid
      setIsLoading(true);
      if (isValid()) {
        //api call
        const res = await axios.post("/api/users/register-bee", bee);
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
        //user has been successfully registered in the backend, send success message
        if (
          res.data.message &&
          res.data.message.indexOf("registered successfully") !== -1
        ) {
          toast.success(`${res.data.message}`, {
            position: "top-right",
          });
          await setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          let backErr = {};
          Object.keys(res.data.errors).map((err) => {
            backErr[err] = res.data.errors[err];
          });
          //if errors, show backend validation errors in frontend
          setBackErrors(backErr);
        }
        //initialize values to empty objects for fresh new data to come in
        setBee(initialBee);
        setBeeErrors({});
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      //error occurred in the backend
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      console.log(err);
    }
  };

  return (
    <>
      <NavBarForms />
      <section className="RegisterBee">
        <div>
          <div>
            <Toaster />
          </div>
          <form className="RegisterBee-Form" onSubmit={handleBeeSubmit}>
            <div>
              <img
                className="Register-BeeImage"
                src="/bee.png"
                alt="bee image"
              />
            </div>
            <div className="RegisterBee-Label">
              <label htmlFor="firstName">First Name</label>
              <input
                className="RegisterBee-Input"
                type="text"
                id="firstName"
                name="firstName"
                value={bee.firstName}
                onChange={(e) => {
                  setBee({ ...bee, firstName: e.target.value });
                }}
                placeholder="Enter first name here..."
              />
              <div className="RegisterBee-Errors">{beeErrors.firstName}</div>
              <div className="RegisterBee-Errors">{backErrors.firstName}</div>
            </div>

            <div className="RegisterBee-Label">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={bee.lastName}
                onChange={(e) => {
                  setBee({ ...bee, lastName: e.target.value });
                }}
                placeholder="Enter last name here..."
                className="RegisterBee-Input"
              />
              <div className="RegisterBee-Errors">{beeErrors.lastName}</div>
              <div className="RegisterBee-Errors">{backErrors.lastName}</div>
            </div>
            <div className="RegisterBee-Label">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={bee.email}
                onChange={(e) => {
                  setBee({ ...bee, email: e.target.value });
                }}
                placeholder="Enter email here..."
                className="RegisterBee-Input"
              />
              <div className="RegisterBee-Errors">{beeErrors.email}</div>
              <div className="RegisterBee-Errors">{backErrors.email}</div>
            </div>
            <div className="RegisterBee-Label">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={bee.phoneNumber}
                onChange={(e) => {
                  setBee({ ...bee, phoneNumber: e.target.value });
                }}
                placeholder="Enter phone number here..."
                className="RegisterBee-Input"
              />
              <div className="RegisterBee-Errors">{beeErrors.phoneNumber}</div>
              <div className="RegisterBee-Errors">{backErrors.phoneNumber}</div>
            </div>
            <fieldset className="RegisterBee-Contact">
              <legend>Location</legend>
              <label htmlFor="address">Home Address</label>
              <textarea
                id="address"
                name="address"
                className="RegisterBee-Input"
                rows="4"
                cols="4"
                value={bee.address}
                onChange={(e) => {
                  setBee({ ...bee, address: e.target.value });
                }}
                placeholder="Please enter street address, city, state, zipcode format..."
              />
              <div className="RegisterBee-Errors">{beeErrors.address}</div>
              <div className="RegisterBee-Errors">{backErrors.address}</div>
            </fieldset>
            <div className="RegisterBee-Label">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={bee.password}
                onChange={(e) => {
                  setBee({ ...bee, password: e.target.value });
                }}
                className="RegisterBee-Input"
                placeholder="Enter password here..."
              />
              <div className="RegisterBee-Errors">{beeErrors.password}</div>
              <div className="RegisterBee-Errors">{backErrors.password}</div>
            </div>
            {isLoading ? (
              <LoadingSmall />
            ) : (
              <button className="RegisterBee-Button">Register</button>
            )}
            <div className="RegisterBee-LoginRef">
              <p>Already have an account? </p>
              <Link href="/login">Login</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default RegisterBee;
