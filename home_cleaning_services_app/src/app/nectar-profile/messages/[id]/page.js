"use client";
import NectarMessagingDashBoard from "@/components/NectarMessagingDashBoard";
import NavBarNectarProfile from "@/components/NavBarNectarProfile";

//nectar messages view
const NectarMessages = () => {
  return (
    <>
      <NavBarNectarProfile />
      <NectarMessagingDashBoard />
    </>
  );
};
export default NectarMessages;
