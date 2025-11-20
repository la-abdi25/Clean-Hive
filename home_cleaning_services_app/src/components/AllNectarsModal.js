"use client";
import "../styles/AllNectarsModal.css";
import Link from "next/link";
import { useEffect, useState } from "react";

//modal to display nectar information before proceeding to either booking or reviews page
const AllNectarsModal = ({ setmodalOpen, nectar }) => {
  const [currTimes, setCurrTimes] = useState([]);
  const [available, setAvailable] = useState(true);

  //fetches and displays availability times
  useEffect(() => {
    const handleNectarData = () => {
      //api call
      var newTimesArr = nectar.availability.filter(
        (time) => time.isAvailable === true
      );
      const newArr = [];
      for (let i = 0; i < newTimesArr.length; i++) {
        if (newTimesArr[i].availability_time1) {
          newArr.push(newTimesArr[i].availability_time1);
        } else if (newTimesArr[i].availability_time2) {
          newArr.push(newTimesArr[i].availability_time2);
        } else if (newTimesArr[i].availability_time3) {
          newArr.push(newTimesArr[i].availability_time3);
        } else if (newTimesArr[i].availability_time4) {
          newArr.push(newTimesArr[i].availability_time4);
        } else if (newTimesArr[i].availability_time5) {
          newArr.push(newTimesArr[i].availability_time5);
        }
      }
      setCurrTimes(newArr);
      if (newTimesArr.length === 0) {
        setAvailable(false);
      }
    };
    handleNectarData();
  }, []);

  return (
    <div className="AllNectarsModal">
      <div>
        <div>
          <img
            src={nectar.profileImage}
            alt="Nectar Profile Image"
            className="Nectar-Avatar"
            onLoad={(e) => {
              e.currentTarget.classList.add("loaded");
            }}
          />
          <h3>{nectar.name}</h3>
          <p className="Nectar-Bio">
            <b>Bio:</b> {nectar.bio}
          </p>
          <p>
            <b>Rating:</b> {nectar.rating}/5
          </p>
          <p>
            <b>Plan:</b> {nectar.plan}
          </p>
          <p>
            <b>Price:</b> ${nectar.price}.00
          </p>
          <p>
            <b>Availability Times:</b>{" "}
          </p>
          {currTimes.length !== 0 ? (
            <div>
              {currTimes[0] && (
                <div>
                  <p>{currTimes[0]}</p>
                </div>
              )}
              {currTimes[1] && (
                <div>
                  <p>{currTimes[1]}</p>
                </div>
              )}
              {currTimes[2] && (
                <div>
                  <p>{currTimes[2]}</p>
                </div>
              )}
              {currTimes[3] && (
                <div>
                  <p>{currTimes[3]}</p>
                </div>
              )}
              {currTimes[4] && (
                <div>
                  <p>{currTimes[4]}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="Time-Not-Available">Not Available</p>
          )}
        </div>
      </div>
      <div className="Modal-Controls">
        {available ? (
          <Link
            href={`/bee-profile/mybooking/${nectar.id}`}
            className="NectarModalBook-Button"
          >
            Book
          </Link>
        ) : (
          <button disabled className="Disabled-Button">
            Book{" "}
          </button>
        )}
        <Link
          href={`/bee-profile/nectar-reviews/${nectar.id}`}
          className="NectarModalReviews-Button"
        >
          Reviews
        </Link>
        <button
          className="NectarModalClose-Button"
          onClick={() => {
            setmodalOpen(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default AllNectarsModal;
