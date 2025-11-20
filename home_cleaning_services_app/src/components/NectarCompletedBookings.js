"use client";
import "../styles/NectarCompletedBookings.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loading from "./Loading";

//displays all completed bookings by nectar
const NectarCompletedBookings = ({ completedBookings }) => {
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
  //handle pagination completed bookings
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {completedBookings && completedBookings.length > 0 ? (
            <div className="NectarCompletedBookingsContainer">
              {completedBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="NectarCompletedBookingsBox">
                    <h3>Cleaning Session with Bee {booking.beeName}</h3>
                    <div className="Nec-CompletedBooking-Data">
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
                    <Link
                      className="Payment-Button"
                      href="/nectar-profile/payments"
                    >
                      View Payments
                    </Link>
                  </div>
                );
              })}
              {completedBookings && pagination > completedBookings.length ? (
                <button className="NectarCompletedBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarCompletedBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-NecCompletedBookings">
              No Completed Bookings yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarCompletedBookings;
