"use client";
import "../styles/CompletedBookingsContainer.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "./Loading";

//displays all completed bookings for a bee/customer
const CompletedBookingsContainer = ({ completedBookings }) => {
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
            <div className="CompletedBookingsContainer">
              {completedBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="CompletedBookingsBox">
                    <h3>Cleaning Session with Nectar {booking.nectarName}</h3>
                    <div className="Completed-Booking-Data">
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
                      className="Review-Button"
                      href={`/bee-profile/nectar-reviews/${booking.nectarId}`}
                    >
                      Leave a Review
                    </Link>
                  </div>
                );
              })}
              {completedBookings && pagination > completedBookings.length ? (
                <button className="BeeCompletedBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeeCompletedBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-BeeCompletedBookings">
              No Completed Bookings yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};
export default CompletedBookingsContainer;
