"use client";
import "../styles/CancelledBookingsContainer.css";
import Loading from "./Loading";
import { useState, useEffect } from "react";

//displays all cancelled bookings for a bee/customer
const CancelledBookingsContainer = ({ cancelledBookings }) => {
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
  //handle pagination cancelled bookings
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {cancelledBookings && cancelledBookings.length > 0 ? (
            <div className="CancelledBookings">
              {cancelledBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="CancelledBookingsBox">
                    <h3>Cleaning Session with Nectar {booking.nectarName}</h3>
                    <div className="Cancelled-Booking-Data">
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
                  </div>
                );
              })}
              {cancelledBookings && pagination > cancelledBookings.length ? (
                <button className="BeeCancelledBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeeCancelledBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-BeeCancelledBookings">
              No Cancelled Bookings yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};
export default CancelledBookingsContainer;
