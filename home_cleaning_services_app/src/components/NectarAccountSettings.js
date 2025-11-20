"use client";
import "../styles/NectarAccountSettings.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LoadingSmall from "./LoadingSmall";

//page for nectar to update account information such as availability times, phone number, plan, and bio.
const NectarAccountSettings = () => {
  const router = useRouter();
  //phone number pattern
  const pattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
  const [nectarId, setNectarId] = useState("");
  const [nectarData, setNectarData] = useState({});
  const [nectarErrors, setNectarErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  //Loading Component fetching data from API
  useEffect(() => {
    let timer = "";
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    //cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);
  const initialFormData = {
    bio: "",
    plan: "",
    phoneNumber: "",
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
  };
  const [formData, setFormData] = useState(initialFormData);
  //Stripe Payment link url
  const [nectarPaymentLink, setNectarPaymentLink] = useState("");

  //fetches nectar user url link for Stripe Payment method
  useEffect(() => {
    const getAccountLink = async () => {
      try {
        const res = await axios.get("/api/users/login");
        setNectarId(res.data.userId);
        const res2 = await axios.get(
          `/api/users/nectar-profile/settings/${res.data.userId}`
        );
        setNectarPaymentLink(res2.data.url);
      } catch (err) {
        console.log(err);
      }
    };
    getAccountLink();
  }, []);
  //fetches nectar user data for current account information
  useEffect(() => {
    const handleNectarInfo = async () => {
      //api call
      const res = await axios.get("/api/users/login");
      const res2 = await axios.get(
        `/api/users/nectar-profile/nectar-data/${res.data.userId}`
      );
      setNectarData(res2.data.nectarData);
    };
    handleNectarInfo();
  }, [formData]);

  //ensures inputted dates do not include past dates
  const handleDate = (date) => {
    const newDate = new Date();
    if (date) {
      var userDate = new Date(date);
    }
    if (userDate < newDate) {
      return true;
    } else {
      return false;
    }
  };

  //checks if nectar form fields are valid
  const isValid = () => {
    let nectarErr = {};
    if (formData.bio.length > 150) {
      nectarErr.bio = "Max character length of 150.";
    }
    if (handleDate(formData.availabilitydate1)) {
      nectarErr.date1 = "Please enter a valid date.";
    }
    if (handleDate(formData.availabilitydate2)) {
      nectarErr.date2 = "Please enter a valid date.";
    }
    if (handleDate(formData.availabilitydate3)) {
      nectarErr.date3 = "Please enter a valid date.";
    }
    if (handleDate(formData.availabilitydate4)) {
      nectarErr.date4 = "Please enter a valid date.";
    }
    if (handleDate(formData.availabilitydate5)) {
      nectarErr.date5 = "Please enter a valid date.";
    }
    if (formData.phoneNumber && !formData.phoneNumber.match(pattern)) {
      nectarErr.phoneNumber = "Please enter a valid phone number.";
    }
    setNectarErrors(nectarErr);
    return Object.keys(nectarErr).length === 0;
  };

  //handles saving nectar data into Nectar Model
  const handleNectarData = async (e) => {
    e.preventDefault();
    //api call
    try {
      if (isValid()) {
        const res = await axios.put(
          `/api/users/nectar-profile/settings/${nectarId}`,
          formData
        );
        if (
          res.data.message &&
          res.data.message.indexOf("updated successfully.") !== -1
        ) {
          toast.success(`${res.data.message}`, {
            position: "top-right",
          });
          await setTimeout(() => {
            router.push("/nectar-profile");
          }, 3000);
        }
      }
      setFormData(initialFormData);
      setNectarErrors({});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="NectarAccountSettings">
      <div>
        <Toaster />
      </div>

      <div className="Payment-Data-Nectar">
        <h3>Payment Information</h3>
        <p>Please enter your payment details by clicking the link below.</p>
        {!nectarPaymentLink ? (
          <LoadingSmall />
        ) : (
          <a href={nectarPaymentLink} className="Nectar-Payment-Info">
            Payment
          </a>
        )}
      </div>

      <h3>Account Information</h3>
      <form className="NectarAccountSettings-Form" onSubmit={handleNectarData}>
        <label htmlFor="phoneNumber" className="Number-Nectar">
          <b>Phone Number</b> <br />
          <small>Format: 123-456-7890</small>
        </label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Please enter your number..."
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value });
          }}
        />
        <div className="Update-Errors">{nectarErrors.phoneNumber}</div>
        <fieldset className="NectarAccountSettings-FieldSet">
          <legend>
            <b>Profile Information</b>{" "}
          </legend>
          <label htmlFor="bio">
            <b>Bio</b>
          </label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Please enter your updated bio here..."
            value={formData.bio}
            onChange={(e) => {
              setFormData({ ...formData, bio: e.target.value });
            }}
          />
          <div className="Update-Errors">{nectarErrors.bio}</div>
          <label htmlFor="plan">
            <b>Cleaning Plan</b>
          </label>
          <select
            name="plan"
            id="plan"
            className="RegisterNectar-Select"
            value={formData.plan}
            onChange={(e) => {
              setFormData({ ...formData, plan: e.target.value });
            }}
          >
            <option value="">-- Choose a plan --</option>
            <option value="standard clean">Standard Clean</option>
            <option value="deep clean">Deep Clean</option>
            <option value="extra clean">Extra Clean</option>
          </select>
          <div className="Nectar-Availability">
            <b>Please Enter Five Availability Times:</b>
            <br />
            <small style={{ color: "white" }}>
              Note: Select 1 or more time slots, for each time slot fill out the
              full date, time, and timeframe.
              <br />
            </small>
            <br />
            <fieldset className="FieldsetTime">
              <legend>Time 1</legend>
              <label htmlFor="availabilitydate1">Date</label>
              <input
                type="date"
                name="availabilitydate1"
                id="availabilitydate1"
                value={formData.availabilitydate1}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    availabilitydate1: e.target.value,
                  });
                }}
              />
              <label htmlFor="availabilitytime1">Time</label>
              <input
                type="number"
                name="availabilitytime1"
                id="availabilitytime1"
                placeholder="Enter your first date/time..."
                value={formData.time1}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    time1: e.target.value,
                  });
                }}
              />
              <label htmlFor="time-select1">Time Frame</label>
              <select
                name="time1"
                id="time-select1"
                value={formData.timeframe1}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    timeframe1: e.target.value,
                  });
                }}
              >
                <option value="">--Choose AM/PM--</option>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <div className="Update-Errors">{nectarErrors.date1}</div>
            </fieldset>
            <fieldset className="FieldsetTime">
              <legend>Time 2</legend>
              <label htmlFor="availabilitydate2">Date</label>
              <input
                type="date"
                name="availabilitydate2"
                id="availabilitydate2"
                value={formData.availabilitydate2}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    availabilitydate2: e.target.value,
                  });
                }}
              />
              <label htmlFor="availabilitytime2">Time</label>
              <input
                type="number"
                name="availabilitytime2"
                id="availabilitytime2"
                placeholder="Enter your second date/time..."
                value={formData.time2}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    time2: e.target.value,
                  });
                }}
              />
              <label htmlFor="time-select2">Time Frame</label>
              <select
                name="time2"
                id="time-select2"
                value={formData.timeframe2}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    timeframe2: e.target.value,
                  });
                }}
              >
                <option value="">--Choose AM/PM--</option>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <div className="Update-Errors">{nectarErrors.date2}</div>
            </fieldset>
            <fieldset className="FieldsetTime">
              <legend>Time 3</legend>
              <label htmlFor="availabilitydate3">Date</label>
              <input
                type="date"
                name="availabilitydate3"
                id="availabilitydate3"
                value={formData.availabilitydate3}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    availabilitydate3: e.target.value,
                  });
                }}
              />
              <label htmlFor="availabilitytime3">Time</label>
              <input
                type="number"
                name="availabilitytime3"
                id="availabilitytime3"
                placeholder="Enter your third date/time..."
                value={formData.time3}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    time3: e.target.value,
                  });
                }}
              />
              <label htmlFor="time-select3">Time Frame</label>
              <select
                name="time3"
                id="time-select3"
                value={formData.timeframe3}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    timeframe3: e.target.value,
                  });
                }}
              >
                <option value="">--Choose AM/PM--</option>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <div className="Update-Errors">{nectarErrors.date3}</div>
            </fieldset>
            <fieldset className="FieldsetTime">
              <legend>Time 4</legend>
              <label htmlFor="availabilitydate4">Date</label>
              <input
                type="date"
                name="availabilitydate4"
                id="availabilitydate4"
                value={formData.availabilitydate4}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    availabilitydate4: e.target.value,
                  });
                }}
              />
              <label htmlFor="availabilitytime4">Time</label>
              <input
                type="number"
                name="availabilitytime4"
                id="availabilitytime4"
                placeholder="Enter your fourth date/time..."
                value={formData.time4}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    time4: e.target.value,
                  });
                }}
              />
              <label htmlFor="time-select4">Time Frame</label>
              <select
                name="time4"
                id="time-select4"
                value={formData.timeframe4}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    timeframe4: e.target.value,
                  });
                }}
              >
                <option value="">--Choose AM/PM--</option>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <div className="Update-Errors">{nectarErrors.date4}</div>
            </fieldset>
            <fieldset className="FieldsetTime">
              <legend>Time 5</legend>
              <label htmlFor="availabilitydate5">Date</label>
              <input
                type="date"
                name="availabilitydate5"
                id="availabilitydate5"
                value={formData.availabilitydate5}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    availabilitydate5: e.target.value,
                  });
                }}
              />
              <label htmlFor="availabilitytime5">Time</label>
              <input
                type="number"
                name="availabilitytime5"
                id="availabilitytime5"
                placeholder="Enter your fifth date/time..."
                value={formData.time5}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    time5: e.target.value,
                  });
                }}
              />
              <label htmlFor="time-select5">Time Frame</label>
              <select
                name="time5"
                id="time-select5"
                value={formData.timeframe5}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    timeframe5: e.target.value,
                  });
                }}
              >
                <option value="">--Choose AM/PM--</option>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <div className="Update-Errors">{nectarErrors.date5}</div>
            </fieldset>
          </div>
        </fieldset>

        <button className="NectarSave-Button">Save</button>
        {isLoading ? (
          <LoadingSmall />
        ) : (
          <div className="NectarAccount">
            <h3>Current Account Information</h3>
            <div className="NectarAccount-Now">
              <p>
                <b>Phone Number:</b> {nectarData.phoneNumber}
              </p>
              <p>
                <b>Bio:</b> {nectarData.bio}
              </p>
              <p>
                <b>Plan:</b> {nectarData.plan}
              </p>
              <div>
                <b>Availability: </b>
                <br />
                <br />
                <div>
                  {nectarData.availability ? (
                    <ul>
                      <li>{nectarData.availability[0].availability_time1}</li>
                      <li>{nectarData.availability[1].availability_time2}</li>
                      <li>{nectarData.availability[2].availability_time3}</li>
                      <li>{nectarData.availability[3].availability_time4}</li>
                      <li>{nectarData.availability[4].availability_time5}</li>
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default NectarAccountSettings;
