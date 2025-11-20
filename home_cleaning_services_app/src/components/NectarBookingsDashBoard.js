"use client";
import "../styles/NectarBookingsDashBoard.css";
import { useState, useEffect } from "react";
import NectarPendingBookings from "./NectarPendingBookings";
import NectarUpcomingBookings from "./NectarUpcomingBookings";
import NectarCancelledBookings from "./NectarCancelledBookings";
import NectarCompletedBookings from "./NectarCompletedBookings";
import axios from "axios";
//nectar bookings view (pending, upcoming, completed, and cancelled)
const NectarBookingsDashBoard = () => {
  //change state of booking type
  const [bookingsType, setBookingsType] = useState("pending");
  const [pendingBookings, setPendingBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);

  //fetches pending bookings
  useEffect(() => {
    const handlePendingBookings = async () => {
      //api call
      const res1 = await axios.get("/api/users/login");
      const res2 = await axios.get(
        `/api/users/bookings/pending/${res1.data.userId}`
      );
      setPendingBookings(res2.data.bookings);
    };
    handlePendingBookings();
  }, [pendingBookings]);

  //fetches upcoming bookings
  useEffect(() => {
    const handleUpcomingBookings = async () => {
      //api call
      const res1 = await axios.get("/api/users/login");
      const res2 = await axios.get(
        `/api/users/bookings/upcoming/${res1.data.userId}`
      );
      setUpcomingBookings(res2.data.bookings);
    };
    handleUpcomingBookings();
  }, [upcomingBookings]);

  //fetches cancelled bookings
  useEffect(() => {
    const handleCancelledBookings = async () => {
      const res1 = await axios.get("/api/users/login");
      //api call
      const res2 = await axios.get(
        `/api/users/bookings/cancelled/${res1.data.userId}`
      );
      setCancelledBookings(res2.data.bookings);
    };
    handleCancelledBookings();
  }, [cancelledBookings]);

  //fetches completed bookings
  useEffect(() => {
    const handleCompletedBookings = async () => {
      const res1 = await axios.get("/api/users/login");
      //api call
      const res2 = await axios.get(
        `/api/users/bookings/completed/${res1.data.userId}`
      );
      setCompletedBookings(res2.data.bookings);
    };
    handleCompletedBookings();
  }, [completedBookings]);

  return (
    <section className="NectarBookingsDashBoard">
      <h2>My Bookings</h2>
      <div className="NectarBookings">
        <div className="NectarBookings-Container">
          <div className="NectarBookings-Button">
            <button
              className="NectarBookings-Button-Text"
              onClick={() => {
                setBookingsType("pending");
              }}
            >
              Pending
            </button>
            <button
              className="NectarBookings-Button-Text"
              onClick={() => {
                setBookingsType("upcoming");
              }}
            >
              Upcoming
            </button>
            <button
              className="NectarBookings-Button-Text"
              onClick={() => {
                setBookingsType("completed");
              }}
            >
              Completed
            </button>
            <button
              className="NectarBookings-Button-Text"
              onClick={() => {
                setBookingsType("cancelled");
              }}
            >
              Cancelled
            </button>
          </div>
          <div className="NectarBookings-Details">
            {bookingsType === "pending" ? (
              <NectarPendingBookings
                pendingBookings={pendingBookings}
                setPendingBookings={setPendingBookings}
              />
            ) : (
              ""
            )}
            {bookingsType === "upcoming" ? (
              <NectarUpcomingBookings
                upcomingBookings={upcomingBookings}
                setUpcomingBookings={setUpcomingBookings}
              />
            ) : (
              ""
            )}
            {bookingsType === "cancelled" ? (
              <NectarCancelledBookings cancelledBookings={cancelledBookings} />
            ) : (
              ""
            )}
            {bookingsType === "completed" ? (
              <NectarCompletedBookings completedBookings={completedBookings} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default NectarBookingsDashBoard;
