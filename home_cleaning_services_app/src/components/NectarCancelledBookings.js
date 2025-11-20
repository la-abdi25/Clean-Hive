"use client";
import "../styles/NectarCancelledBookings.css";
import { useEffect, useState } from "react";
import Loading from "./Loading";

//displays all cancelled bookings for a nectar/cleaning agent
const NectarCancelledBookings = ({ cancelledBookings }) => {
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
            <div className="NectarCancelledBookings">
              {cancelledBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="NectarCancelledBookingsBox">
                    <h3>Cleaning Session with Bee {booking.beeName}</h3>
                    <div className="Nec-CancelledBookings-Data">
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
                <button className="NectarCancelledBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarCancelledBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-NecCancelledBookings">
              No Cancelled Bookings yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarCancelledBookings;
