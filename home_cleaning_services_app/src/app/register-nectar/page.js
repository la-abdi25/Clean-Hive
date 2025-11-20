"use client";
import NavBarForms from "../../components/NavBar-Forms";
import "../../styles/RegisterNectar.css";
import Link from "next/link";
import axios from "axios";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LoadingSmall from "../../components/LoadingSmall";

//page to register nectar
const RegisterNectar = () => {
  const router = useRouter();
  const fileRef = useRef();
  //phone number pattern
  const pattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
  //errors from the backend
  const initialBackErrs = {
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
  const [backErrors, setBackErrors] = useState(initialBackErrs);
  const [nectarErrors, setNectarErrors] = useState({});
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");

  const initialNectar = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    plan: "",
    availabilitydate1: "",
    time1: "",
    timeframe1: "",
    availabilitydate2: "",
    time2: "",
    timeframe2: "",
    availabilitydate3: "",
    time3: "",
    timeframe3: "",
    availabilitydate4: "",
    time4: "",
    timeframe4: "",
    availabilitydate5: "",
    time5: "",
    timeframe5: "",
    password: "",
    city_location: "",
  };
  const [nectar, setNectar] = useState(initialNectar);
  const [isLoading, setIsLoading] = useState(false);

  //handles nectar users uploading their profile images
  const handleFileChange = (e) => {
    let imageFile = e.target.files[0];
    setFile(imageFile);
    if (imageFile && imageFile.name) {
      setFileName(imageFile.name);
    } else {
      setFileName("");
    }
  };
  //check users entered a correct date, not a past date
  const handleDate = (date) => {
    const newDate = new Date();
    const userDate = new Date(date);
    if (userDate < newDate) {
      return true;
    } else {
      return false;
    }
  };
  //check if nectar form fields are valid
  const isValid = () => {
    let nectarErr = {};
    if (
      handleDate(nectar.availabilitydate1) ||
      handleDate(nectar.availabilitydate2) ||
      handleDate(nectar.availabilitydate3) ||
      handleDate(nectar.availabilitydate4) ||
      handleDate(nectar.availabilitydate5)
    ) {
      nectarErr.date = "Please enter valid dates.";
    }
    if (!nectar.firstName) {
      nectarErr.firstName = "Please enter your first name.";
    }
    if (!nectar.lastName) {
      nectarErr.lastName = "Please enter your last name.";
    }
    if (!nectar.email) {
      nectarErr.email = "Please enter your email.";
    }
    if (!nectar.phoneNumber.match(pattern)) {
      nectarErr.phoneNumber = "Please enter a valid phone number.";
    }
    if (!nectar.address) {
      nectarErr.address = "Please enter your address.";
    }
    if (!nectar.bio) {
      nectarErr.bio = "Please enter your bio.";
    }
    if (!nectar.plan) {
      nectarErr.plan = "Please enter your preferred cleaning plan.";
    }
    if (!nectar.city_location) {
      nectarErr.city_location = "Please enter your city.";
    }
    if (!fileName) {
      nectarErr.profileImage = "Please enter your profile image.";
    }
    if (!nectar.password) {
      nectarErr.password = "Please enter your password.";
    }
    if (!nectar.availabilitydate1) {
      nectarErr.availabilitydate1 =
        "Please enter your first availability date.";
    }
    if (!nectar.availabilitydate2) {
      nectarErr.availabilitydate2 =
        "Please enter your second availability date.";
    }
    if (!nectar.availabilitydate3) {
      nectarErr.availabilitydate3 =
        "Please enter your third availability date.";
    }
    if (!nectar.availabilitydate4) {
      nectarErr.availabilitydate4 =
        "Please enter your fourth availability date.";
    }
    if (!nectar.availabilitydate5) {
      nectarErr.availabilitydate5 =
        "Please enter your fifth availability date.";
    }
    if (!nectar.time1) {
      nectarErr.time1 = "Please enter your first availability time.";
    }
    if (!nectar.time2) {
      nectarErr.time2 = "Please enter your second availability time.";
    }
    if (!nectar.time3) {
      nectarErr.time3 = "Please enter your third availability time.";
    }
    if (!nectar.time4) {
      nectarErr.time4 = "Please enter your fourth availability time.";
    }
    if (!nectar.time5) {
      nectarErr.time5 = "Please enter your fifth availability time.";
    }
    if (!nectar.timeframe1) {
      nectarErr.timeframe1 = "Please enter your first timeframe.";
    }
    if (!nectar.timeframe2) {
      nectarErr.timeframe2 = "Please enter your second timeframe.";
    }
    if (!nectar.timeframe3) {
      nectarErr.timeframe3 = "Please enter your third timeframe.";
    }
    if (!nectar.timeframe4) {
      nectarErr.timeframe4 = "Please enter your fourth timeframe.";
    }
    if (!nectar.timeframe5) {
      nectarErr.timeframe5 = "Please enter your fifth timeframe.";
    }
    setNectarErrors(nectarErr);
    return Object.keys(nectarErr).length === 0;
  };
  //handles nectar registration via backend api call
  const handleNectarSubmit = async (e) => {
    e.preventDefault();
    try {
      //populate formData
      const formData = new FormData();
      formData.append("profileImage", file);
      Object.keys(nectar).map((key) => {
        formData.append(key, nectar[key]);
      });
      setIsLoading(true);
      if (isValid()) {
        //api call
        const res = await axios.post("/api/users/register-nectar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
        setNectar(initialNectar);
        setNectarErrors({});
        fileRef.current.value = "";
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      console.log(err);
    }
  };

  return (
    <>
      <NavBarForms />
      <section className="RegisterNectar">
        <div>
          <div>
            <Toaster />
          </div>
          <form className="RegisterNectar-Form" onSubmit={handleNectarSubmit}>
            <div>
              <img
                className="Register-NectarImage"
                src="/nectar.png"
                alt="nectar image"
              />
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="firstName">First Name</label>
              <input
                className="RegisterNectar-Input"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter first name here..."
                value={nectar.firstName}
                onChange={(e) => {
                  setNectar({ ...nectar, firstName: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.firstName}
              </div>
              <div className="RegisterNectar-Errors">
                {backErrors.firstName}
              </div>
            </div>

            <div className="RegisterNectar-Label">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter last name here..."
                className="RegisterNectar-Input"
                value={nectar.lastName}
                onChange={(e) => {
                  setNectar({ ...nectar, lastName: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.lastName}
              </div>
              <div className="RegisterNectar-Errors">{backErrors.lastName}</div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email here..."
                className="RegisterNectar-Input"
                value={nectar.email}
                onChange={(e) => {
                  setNectar({ ...nectar, email: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">{nectarErrors.email}</div>
              <div className="RegisterNectar-Errors">{backErrors.email}</div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number here..."
                className="RegisterNectar-Input"
                value={nectar.phoneNumber}
                onChange={(e) => {
                  setNectar({ ...nectar, phoneNumber: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.phoneNumber}
              </div>
              <div className="RegisterNectar-Errors">
                {backErrors.phoneNumber}
              </div>
            </div>
            <fieldset className="RegisterNectar-Contact">
              <legend>Billing</legend>
              <div className="RegisterNectar-Address">
                <label htmlFor="address">Billing Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="RegisterNectar-Input"
                  rows="2"
                  cols="4"
                  placeholder="Please enter street address, city, state, zipcode format..."
                  value={nectar.address}
                  onChange={(e) => {
                    setNectar({ ...nectar, address: e.target.value });
                  }}
                />
                <div className="RegisterNectar-Errors">
                  {nectarErrors.address}
                </div>
                <div className="RegisterNectar-Errors">
                  {backErrors.address}
                </div>
              </div>
            </fieldset>
            <div className="RegisterNectar-Label">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="RegisterNectar-Input"
                placeholder="Enter cleaning background here..."
                rows="4"
                cols="4"
                value={nectar.bio}
                onChange={(e) => {
                  setNectar({ ...nectar, bio: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">{nectarErrors.bio}</div>
              <div className="RegisterNectar-Errors">{backErrors.bio}</div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="plan">Cleaning plan</label>
              <select
                name="plan"
                id="plan"
                className="RegisterNectar-Select"
                value={nectar.plan}
                onChange={(e) => {
                  setNectar({ ...nectar, plan: e.target.value });
                }}
              >
                <option value="">-- Please choose a plan --</option>
                <option value="standard clean">Standard Clean</option>
                <option value="deep clean">Deep Clean</option>
                <option value="extra clean">Extra Clean</option>
              </select>
              <div className="RegisterNectar-Errors">{nectarErrors.plan}</div>
              <div className="RegisterNectar-Errors">{backErrors.plan}</div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="profileImage">Upload Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="RegisterNectar-Input"
                onChange={handleFileChange}
                ref={fileRef}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.profileImage}
              </div>
              <div className="RegisterNectar-Errors">
                {backErrors.profileImage}
              </div>
            </div>
            <div className="RegisterNectar-Availability">
              <b className="Times">Please Enter Five Availability Times:</b>
              <br />
              <fieldset className="FieldsetTime">
                <legend>Time 1 </legend>
                <div>
                  <label htmlFor="availabilitydate1">Date</label>
                  <input
                    type="date"
                    name="availabilitydate1"
                    id="availabilitydate1"
                    value={nectar.availabilitydate1}
                    onChange={(e) => {
                      setNectar({
                        ...nectar,
                        availabilitydate1: e.target.value,
                      });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.availabilitydate1}
                  </div>
                </div>
                <div>
                  <label htmlFor="time1">Time</label>
                  <input
                    type="number"
                    name="time1"
                    id="time1"
                    placeholder="Please enter your first date..."
                    value={nectar.time1}
                    onChange={(e) => {
                      setNectar({ ...nectar, time1: e.target.value });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.time1}
                  </div>
                </div>
                <div>
                  <label htmlFor="timeframe1">Time Frame</label>
                  <select
                    name="timeframe1"
                    id="timeframe1"
                    value={nectar.timeframe1}
                    onChange={(e) => {
                      setNectar({ ...nectar, timeframe1: e.target.value });
                    }}
                  >
                    <option value="">--Choose AM/PM--</option>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.timeframe1}
                  </div>
                </div>
              </fieldset>
              <fieldset className="FieldsetTime">
                <legend>Time 2 </legend>
                <div>
                  <label htmlFor="availabilitydate2">Date</label>
                  <input
                    type="date"
                    name="availabilitydate2"
                    id="availabilitydate2"
                    value={nectar.availabilitydate2}
                    onChange={(e) => {
                      setNectar({
                        ...nectar,
                        availabilitydate2: e.target.value,
                      });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.availabilitydate2}
                  </div>
                </div>
                <div>
                  <label htmlFor="time2">Time</label>
                  <input
                    type="number"
                    name="time2"
                    id="time2"
                    placeholder="Please enter your second date..."
                    value={nectar.time2}
                    onChange={(e) => {
                      setNectar({ ...nectar, time2: e.target.value });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.time2}
                  </div>
                </div>
                <div>
                  <label htmlFor="timeframe2">Time Frame</label>
                  <select
                    name="timeframe2"
                    id="timeframe2"
                    value={nectar.timeframe2}
                    onChange={(e) => {
                      setNectar({ ...nectar, timeframe2: e.target.value });
                    }}
                  >
                    <option value="">--Choose AM/PM--</option>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.timeframe2}
                  </div>
                </div>
              </fieldset>
              <fieldset className="FieldsetTime">
                <legend>Time 3 </legend>
                <div>
                  <label htmlFor="availabilitydate3">Date</label>
                  <input
                    type="date"
                    name="availabilitydate3"
                    id="availabilitydate3"
                    value={nectar.availabilitydate3}
                    onChange={(e) => {
                      setNectar({
                        ...nectar,
                        availabilitydate3: e.target.value,
                      });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.availabilitydate3}
                  </div>
                </div>
                <div>
                  <label htmlFor="time3">Time</label>
                  <input
                    type="number"
                    name="time3"
                    id="time3"
                    placeholder="Please enter your third date..."
                    value={nectar.time3}
                    onChange={(e) => {
                      setNectar({ ...nectar, time3: e.target.value });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.time3}
                  </div>
                </div>
                <div>
                  <label htmlFor="timeframe3">Time Frame</label>
                  <select
                    name="timeframe3"
                    id="timeframe3"
                    value={nectar.timeframe3}
                    onChange={(e) => {
                      setNectar({ ...nectar, timeframe3: e.target.value });
                    }}
                  >
                    <option value="">--Choose AM/PM--</option>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.timeframe3}
                  </div>
                </div>
              </fieldset>
              <fieldset className="FieldsetTime">
                <legend>Time 4 </legend>
                <div>
                  <label htmlFor="availabilitydate4">Date</label>
                  <input
                    type="date"
                    name="availabilitydate4"
                    id="availabilitydate4"
                    value={nectar.availabilitydate4}
                    onChange={(e) => {
                      setNectar({
                        ...nectar,
                        availabilitydate4: e.target.value,
                      });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.availabilitydate4}
                  </div>
                </div>
                <div>
                  <label htmlFor="time4">Time</label>
                  <input
                    type="number"
                    name="time4"
                    id="time4"
                    placeholder="Please enter your fourth date..."
                    value={nectar.time4}
                    onChange={(e) => {
                      setNectar({ ...nectar, time4: e.target.value });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.time4}
                  </div>
                </div>
                <div>
                  <label htmlFor="timeframe4">Time Frame</label>
                  <select
                    name="timeframe4"
                    id="timeframe4"
                    value={nectar.timeframe4}
                    onChange={(e) => {
                      setNectar({ ...nectar, timeframe4: e.target.value });
                    }}
                  >
                    <option value="">--Choose AM/PM--</option>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.timeframe4}
                  </div>
                </div>
              </fieldset>
              <fieldset className="FieldsetTime">
                <legend>Time 5 </legend>
                <div>
                  <label htmlFor="availabilitydate5">Date</label>
                  <input
                    type="date"
                    name="availabilitydate5"
                    id="availabilitydate5"
                    value={nectar.availabilitydate5}
                    onChange={(e) => {
                      setNectar({
                        ...nectar,
                        availabilitydate5: e.target.value,
                      });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.availabilitydate5}
                  </div>
                </div>
                <div>
                  <label htmlFor="time5">Time</label>
                  <input
                    type="number"
                    name="time5"
                    id="time5"
                    placeholder="Please enter your fifth date..."
                    value={nectar.time5}
                    onChange={(e) => {
                      setNectar({ ...nectar, time5: e.target.value });
                    }}
                  />
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.time5}
                  </div>
                </div>
                <div>
                  <label htmlFor="timeframe5">Time Frame</label>
                  <select
                    name="timeframe5"
                    id="timeframe5"
                    value={nectar.timeframe5}
                    onChange={(e) => {
                      setNectar({ ...nectar, timeframe5: e.target.value });
                    }}
                  >
                    <option value="">--Choose AM/PM--</option>
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                  <div className="RegisterNectar-Errors">
                    {nectarErrors.timeframe5}
                  </div>
                </div>
              </fieldset>
              <div className="RegisterNectar-Errors">{nectarErrors.date}</div>
              <div className="RegisterNectar-Errors">
                {backErrors.availability}
              </div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="city_location">City</label>
              <input
                type="text"
                id="city_location"
                name="city_location"
                className="RegisterNectar-Input"
                placeholder="Enter city here..."
                value={nectar.city_location}
                onChange={(e) => {
                  setNectar({ ...nectar, city_location: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.city_location}
              </div>
              <div className="RegisterNectar-Errors">
                {backErrors.city_location}
              </div>
            </div>
            <div className="RegisterNectar-Label">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="RegisterNectar-Input"
                placeholder="Enter password here..."
                value={nectar.password}
                onChange={(e) => {
                  setNectar({ ...nectar, password: e.target.value });
                }}
              />
              <div className="RegisterNectar-Errors">
                {nectarErrors.password}
              </div>
              <div className="RegisterNectar-Errors">{backErrors.password}</div>
            </div>
            {isLoading ? (
              <LoadingSmall />
            ) : (
              <button className="RegisterNectar-Button">Register</button>
            )}
            <div className="RegisterNectar-LoginRef">
              <p>Already have an account? </p>
              <Link href="/login">Login</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default RegisterNectar;
