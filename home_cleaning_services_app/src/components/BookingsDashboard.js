"use client";
import "../styles/BookingsDashBoard.css";
import CompletedBookingsContainer from "./CompletedBookingsContainer";
import PendingBookingsContainer from "./PendingBookingsContainer";
import UpcomingBookingsContainer from "./UpcomingBookingsContainer";
import CancelledBookingsContainer from "./CancelledBookingsContainer";
import axios from "axios";
import { useState, useEffect } from "react";

//component to view bee/customer bookings (pending, upcoming, completed, and cancelled)
const BookingsDashBoard = () => {
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
    <section className="BookingsDashBoard">
      <h2>My Bookings</h2>
      <div className="Bookings">
        <div className="Bookings-Container">
          <div className="Bookings-Button">
            <button
              className="Bookings-Button-Text"
              onClick={() => {
                setBookingsType("pending");
              }}
            >
              Pending
            </button>
            <button
              className="Bookings-Button-Text"
              onClick={() => {
                setBookingsType("upcoming");
              }}
            >
              Upcoming
            </button>
            <button
              className="Bookings-Button-Text"
              onClick={() => {
                setBookingsType("completed");
              }}
            >
              Completed
            </button>
            <button
              className="Bookings-Button-Text"
              onClick={() => {
                setBookingsType("cancelled");
              }}
            >
              Cancelled
            </button>
          </div>
          <div className="Bookings-Details">
            {bookingsType === "pending" ? (
              <PendingBookingsContainer
                pendingBookings={pendingBookings}
                setPendingBookings={setPendingBookings}
              />
            ) : (
              ""
            )}
            {bookingsType === "upcoming" ? (
              <UpcomingBookingsContainer upcomingBookings={upcomingBookings} />
            ) : (
              ""
            )}
            {bookingsType === "completed" ? (
              <CompletedBookingsContainer
                completedBookings={completedBookings}
              />
            ) : (
              ""
            )}
            {bookingsType === "cancelled" ? (
              <CancelledBookingsContainer
                cancelledBookings={cancelledBookings}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default BookingsDashBoard;
