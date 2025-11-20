"use client";
import NavBarLogo from "@/components/NavBar-Logo";
import BeeCheckoutForm from "@/components/BeeCheckoutForm";

//bee booking/checkout page
const MyBooking = () => {
  return (
    <>
      <NavBarLogo />
      <div className="BeeCheckOut">
        <BeeCheckoutForm />
      </div>
    </>
  );
};
export default MyBooking;
