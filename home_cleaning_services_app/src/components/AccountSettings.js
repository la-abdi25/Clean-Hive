"use client";
import "../styles/AccountSettings.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LoadingSmall from "./LoadingSmall";

//bee/customer account settings tab to update info like address/phone number
const AccountSettings = () => {
  //phone number pattern
  const pattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
  const initialFormData = {
    phoneNumber: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [updatedBee, setUpdatedBee] = useState({});
  const [beeErrors, setBeeErrors] = useState({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  //Loading Component fetching data from API
  useEffect(() => {
    let timer = "";
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    //cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  //handles fetching bee data to display in current account information
  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get("/api/users/login");
      const res2 = await axios.get(
        `/api/users/bee-profile/bee-data/${res.data.userId}`
      );
      setUpdatedBee(res2.data.beeData);
    };
    getUserData();
  }, [formData]);

  //checks for any form errors
  const isValid = () => {
    let beeErr = {};
    if (formData.address.length > 50) {
      beeErr.address = "Max character length of 50.";
    }
    if (formData.phoneNumber && !formData.phoneNumber.match(pattern)) {
      beeErr.phoneNumber = "Please enter a valid phone number.";
    }
    setBeeErrors(beeErr);
    return Object.keys(beeErr).length === 0;
  };

  //handles saving bee data in Bee Model
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isValid()) {
        //put request api call here
        const res = await axios.get("/api/users/login");
        const res2 = await axios.put(
          `/api/users/bee-profile/settings/${res.data.userId}`,
          formData
        );
        if (
          res2.data.message &&
          res2.data.message.indexOf("updated successfully.") !== -1
        ) {
          toast.success(`${res2.data.message}`, {
            position: "top-right",
          });
          await setTimeout(() => {
            router.push("/bee-profile");
          }, 3000);
        }
        setBeeErrors({});
        setFormData(initialFormData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="AccountSettings">
      <Toaster />
      <h3>Account Information</h3>
      <form className="AccountSettings-Form" onSubmit={handleSave}>
        <label htmlFor="phoneNumber">
          <b>Phone Number</b> <br />
          <small>Format: 123-456-7890</small>
        </label>
        <input
          value={formData.phoneNumber}
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Please enter your number..."
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value });
          }}
        />
        <div className="Update-Bee-Errors">{beeErrors.phoneNumber}</div>
        <fieldset className="AccountSettings-FieldSet">
          <legend>
            <b>Location</b>{" "}
          </legend>
          <label htmlFor="address">
            <b>Address</b>
          </label>
          <textarea
            value={formData.address}
            name="address"
            id="address"
            placeholder="Please enter your updated address..."
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
            }}
          />
        </fieldset>
        <div className="Update-Bee-Errors">{beeErrors.address}</div>
        <button className="Save-Button">Save</button>
        {isLoading ? (
          <LoadingSmall />
        ) : (
          <div className="Account">
            <h3>Current Account Information</h3>
            <div className="Account-Now">
              <p>
                <b>Phone Number:</b> {updatedBee.phoneNumber}
              </p>
              <p>
                <b>Address:</b> {updatedBee.address}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default AccountSettings;
