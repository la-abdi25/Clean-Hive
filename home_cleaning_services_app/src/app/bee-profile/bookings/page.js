"use client";
import BookingsDashBoard from "@/components/BookingsDashboard";
import NavBarBeeProfile from "@/components/NavBarBeeProfile";

//bee bookings page entrance
const Bookings = () => {
  return (
    <>
      <NavBarBeeProfile />
      <BookingsDashBoard />
    </>
  );
};
export default Bookings;
