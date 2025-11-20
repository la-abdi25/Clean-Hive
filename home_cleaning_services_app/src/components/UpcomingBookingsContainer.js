"use client";
import "../styles/UpcomingBookingsContainer.css";
import Loading from "./Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { myPromise } from "../../firebase";
//displays all upcoming bookings for bee/customer
const UpcomingBookingsContainer = ({ upcomingBookings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(3);
  const router = useRouter();
  //handle anonymous sign in Firebase
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const user = await myPromise;
      } catch (err) {
        console.log("Auth error:", err);
      }
    };
    handleAuth();
  }, []);
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

  //allows bee/customer to send a message to a nectar/cleaning agent
  const handleMessage = async (
    receiverId,
    senderId,
    receiverName,
    senderName
  ) => {
    try {
      //api call to initiate a chat
      const res = await axios.post("/api/users/messages/startChat", {
        receiverId,
        senderId,
        receiverName,
        senderName,
      });
      if (res.data.chatId) {
        router.push(`/bee-profile/messages/${senderId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //handle pagination upcoming bookings
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="BookingsContainer">
              {upcomingBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="BookingsBox">
                    <h3>Cleaning Session with Nectar {booking.nectarName}</h3>
                    <div className="Upcoming-Booking-Data">
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
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#74C0FC" }}
                      className="Bee-Message-Button"
                      onClick={() => {
                        handleMessage(
                          booking.nectarId,
                          booking.beeId,
                          booking.nectarName,
                          booking.beeName
                        );
                      }}
                    />
                  </div>
                );
              })}
              {upcomingBookings && pagination > upcomingBookings.length ? (
                <button className="BeeUpcomingBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeeUpcomingBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-UpcomingBookings">No Upcoming Bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
export default UpcomingBookingsContainer;
