"use client";
import "../styles/PendingBookingsContainer.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loading from "./Loading";
//displays pending bookings for bee/customer
const PendingBookingsContainer = ({ pendingBookings, setPendingBookings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(3);
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

  //handles bee/user cancelling a booking. must cancel within 24 hours before scheduled booking date
  const handleCancel = async (bookingId, timeSlot) => {
    //grab date from timeSlot string
    const dateArr = timeSlot.split(",").splice(1, 2);
    //grab year from from timeSlot string
    const yearArr = dateArr[1].replace("/,/g", "").slice(0, 5);
    //combine date and year
    const date = `${dateArr[0]} ${yearArr}`;
    //grab time ex: 2pm
    const time = timeSlot.split(", ")[2].split(" ")[1];
    //grab time from "2pm" --> 2
    let timeHour = parseInt(time);
    //check time and view pm or am and convert to 24 hour timeframe
    if (time.indexOf("pm") !== -1 && timeHour < 12) {
      timeHour += 12;
    } else if (time.indexOf("am") !== -1 && timeHour === 12) {
      timeHour = 0;
    }
    //create new date from date and time
    const dateNew = new Date(`${date} ${timeHour}:00`);
    //convert to iso string
    const convertTime = dateNew.toISOString();
    //create new Date objs from date now and timeSlot date and compare
    const dateObj = new Date(convertTime);
    const dateNow = new Date();
    //subtract dates to get timeframe in milliseconds
    const bookingTimeFrame = dateObj - dateNow;
    //convert booking time to seconds, then minutes, then hours
    const timeSeconds = bookingTimeFrame / 1000;
    const timeMinutes = timeSeconds / 60;
    const timeHours = timeMinutes / 60;

    //within 24 hours
    if (timeHours >= 24) {
      const res = await axios.put(`/api/users/bookings/cancelled/${bookingId}`);
      setPendingBookings((booking) => {
        pendingBookings.filter((booking) => booking.id !== bookingId);
      });
      toast.success(
        `Booking date of ${timeSlot} has been marked as cancelled.`,
        {
          position: "top-right",
          duration: 5000,
        }
      );
    } else {
      //not within 24 hours
      toast.error(
        `Booking date of ${timeSlot} could not be marked as cancelled. Can only cancel a booking within 24 hours of booking date.`,
        {
          position: "top-right",
          duration: 5000,
        }
      );
    }
  };
  //handle pagination pending bookings
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="PendingContainer1">
          {pendingBookings && pendingBookings.length > 0 ? (
            <div className="PendingBookingsContainer">
              {pendingBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="PendingBookingsBox">
                    <h3>Cleaning Session with Nectar {booking.nectarName}</h3>
                    <div className="Pending-Booking-Data">
                      <p>
                        <b>Booking#: </b>
                        {booking.bookingRef}
                      </p>
                      <p>
                        <b>Bee Notes: </b>
                        {booking.beeNotes}
                      </p>
                      <p>
                        <b>Location: </b>
                        {booking.beeLocation}
                      </p>
                      <p>
                        <b>Plan: </b>
                        {booking.plan}
                      </p>
                      <p>
                        <b>Price: </b>${booking.amount}.00
                      </p>
                      <p>
                        <b>Date: </b>
                        {booking.timeSlot}
                      </p>
                    </div>
                    <br />
                    <div className="Bee-Cancel">
                      <FontAwesomeIcon
                        icon={faSquareXmark}
                        style={{ color: "#ec0909" }}
                        onClick={() => {
                          handleCancel(booking._id, booking.timeSlot);
                        }}
                        alt="Cancel Icon"
                        className="Bee-Cancel-Button"
                      />
                    </div>
                  </div>
                );
              })}
              {pendingBookings && pagination > pendingBookings.length ? (
                <button className="BeePendingBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeePendingBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <div className="No-Bookings">
              <p className="No-PendingBookings">No Pending Bookings yet.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default PendingBookingsContainer;
