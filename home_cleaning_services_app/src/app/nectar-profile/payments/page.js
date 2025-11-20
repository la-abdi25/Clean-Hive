"use client";
import NectarPaymentsDashBoard from "@/components/NectarPaymentsDashBoard";
import NavBarNectarProfile from "@/components/NavBarNectarProfile";

//nectar payments page
const NectarPayments = () => {
  return (
    <>
      <NavBarNectarProfile />
      <NectarPaymentsDashBoard />
    </>
  );
};
export default NectarPayments;
