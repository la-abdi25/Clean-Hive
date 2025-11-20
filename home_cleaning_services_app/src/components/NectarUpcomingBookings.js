"use client";
import "../styles/NectarUpcomingBookings.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faMessage } from "@fortawesome/free-solid-svg-icons";
import { myPromise } from "../../firebase";
//displays upcoming bookings for nectar
const NectarUpcomingBookings = ({ upcomingBookings, setUpcomingBookings }) => {
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

  //handles marking a booking as completed
  const handleComplete = async (bookingId, timeSlot) => {
    //get date from timeSlot string
    const dateArr = timeSlot.split(",").splice(1, 2);
    //get year from time slot string
    const yearArr = dateArr[1].replace("/,/g", "").slice(0, 5);
    //full date
    const date = `${dateArr[0]} ${yearArr}`;
    //convert to date Object
    const timeSlotDate = new Date(date);
    //current date
    const dateNow = new Date();
    //check if timeSlot date has passed
    if (timeSlotDate < dateNow) {
      const res = await axios.put(`/api/users/bookings/completed/${bookingId}`);
      setUpcomingBookings((booking) => {
        upcomingBookings.filter((booking) => booking.id !== bookingId);
      });
      toast.success(
        `Booking date of ${timeSlot} has been marked as completed.`,
        {
          position: "top-right",
        }
      );
    } else {
      //if not cannot mark service as completed
      toast.error(
        `Booking date of ${timeSlot} has not yet arrived. Please mark complete when booking has been completed.`,
        {
          position: "top-right",
        }
      );
    }
  };
  //sending a message to a bee/customer before booking arrival time
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
        router.push(`/nectar-profile/messages/${senderId}`);
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
    <>
      <div>
        <Toaster />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="NectarUpcomingBookingsContainer">
              {upcomingBookings.slice(0, pagination).map((booking) => {
                return (
                  <div key={booking._id} className="NectarUpcomingBookingsBox">
                    <h3>Cleaning Session with Bee {booking.beeName}</h3>
                    <div className="Nec-UpcomingBookings-Data">
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

                    <div className="Nectar-Complete">
                      <div className="Complete-Button">
                        <FontAwesomeIcon
                          icon={faSquareCheck}
                          style={{ color: "#74C0FC" }}
                          className="Nectar-Complete-Button"
                          onClick={() => {
                            handleComplete(booking._id, booking.timeSlot);
                          }}
                        />
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faMessage}
                          style={{ color: "#74C0FC" }}
                          className="Nectar-Message-Button"
                          onClick={() => {
                            handleMessage(
                              booking.beeId,
                              booking.nectarId,
                              booking.beeName,
                              booking.nectarName
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}{" "}
              {upcomingBookings && pagination > upcomingBookings.length ? (
                <button className="NectarUpcomingBooking-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarUpcomingBooking-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-NecUpcomingBookings">No Upcoming Bookings yet.</p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarUpcomingBookings;
