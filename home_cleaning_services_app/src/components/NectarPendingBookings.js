"use client";
import "../styles/NectarPendingBookings.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
//all pending bookings for nectars, features to accept or cancel the booking
const NectarPendingBookings = ({ pendingBookings, setPendingBookings }) => {
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

  //nectar accepts booking
  const handleAccept = async (bookingId) => {
    const res = await axios.put(`/api/users/bookings/upcoming/${bookingId}`);
    setPendingBookings((booking) => {
      pendingBookings.filter((booking) => booking.id !== bookingId);
    });
  };
  //nectar cancels booking, must cancel booking only 24 hours ahead of scheduled date
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
        <div>
          {pendingBookings && pendingBookings.length > 0 ? (
            <div className="NectarPendingBookingsContainer">
              {pendingBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="NectarPendingBookingsBox">
                    <h3>Cleaning Session with Bee {booking.beeName}</h3>
                    <div className="Nec-Pendingbooking-Data">
                      <p>
                        <b>Booking#: </b>
                        {booking.bookingRef}
                      </p>
                      <p className="Nectar-BeeNotes">
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
                    <div className="Nectar-Pending-Buttons">
                      <div className="Nectar-Accept">
                        {" "}
                        <FontAwesomeIcon
                          icon={faSquareCheck}
                          style={{ color: "#63E6BE" }}
                          className="Nectar-Accept-Button"
                          onClick={() => {
                            handleAccept(booking._id);
                          }}
                        />
                      </div>
                      <div className="Nectar-Cancel">
                        {" "}
                        <FontAwesomeIcon
                          icon={faSquareXmark}
                          style={{ color: "#fb0909" }}
                          className="Nectar-Cancel-Button"
                          onClick={() => {
                            handleCancel(booking._id, booking.timeSlot);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {pendingBookings && pagination > pendingBookings.length ? (
                <button className="NectarPendingBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarPendingBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-NecPending-Bookings"> No Pending Bookings yet.</p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarPendingBookings;
