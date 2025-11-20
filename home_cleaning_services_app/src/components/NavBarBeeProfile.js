"use client";
import Link from "next/link";
import "../styles/NavBarBeeProfile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
//bee navbar component, navigates to bee hub, bookings page, messages page, payments page, and settings page
const NavBarBeeProfile = () => {
  const [id, setId] = useState("");
  const [smallSize, setSmallSize] = useState(false);
  const [divShow, setDivShow] = useState(true);
  const router = useRouter();
  //adjust navbar to be responsive
  const handleScreenSize = () => {
    setSmallSize(true);
    setDivShow(false);
  };
  //logout user from sidebar tab
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success("User logged out successfully.");
      router.push("/login");
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  //get user id from login data
  useEffect(() => {
    const handleUser = async () => {
      const res = await axios.get("/api/users/login");
      setId(res.data.userId);
    };
    handleUser();
  }, []);

  return (
    <header className="Bee-Nav-Header">
      <nav className="Bee-NavBar">
        <Toaster />
        <Link href="/">
          <img className="NavBarBeeProfile-Logo" src="/profile-logo.png" />
        </Link>
        <div className="NavBarBeeProfile-Nav">
          <div className="NavBarBeeProfile-MainLinks">
            <div className="NavBarBeeProfile-Link">
              <img src="/dashboard.svg" />
              <Link href="/bee-profile">Bee Hub</Link>
            </div>
            <div className="NavBarBeeProfile-Link">
              <img src="/bookings.png" />
              <Link href="/bee-profile/bookings">Bookings</Link>
            </div>
            <div className="NavBarBeeProfile-Link">
              <img src="/messages.png" />
              <Link href={`/bee-profile/messages/${id}`}>Messages</Link>
            </div>
            <div className="NavBarBeeProfile-Link">
              <img src="/payment.png" />
              <Link href="/bee-profile/payments">Payments</Link>
            </div>
            <div className="NavBarBeeProfile-Link">
              <img src="/settings.svg" />
              <Link href="/bee-profile/settings">Settings</Link>
            </div>
          </div>
        </div>

        <div className="SmallSizeBeeProfile-MenuBar">
          {divShow && (
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "#000000" }}
              alt="menu bar icon"
              onClick={handleScreenSize}
              className="Menu-Bar"
            />
          )}
          {smallSize && (
            <div className="NavBarBeeProfile-Links">
              <div>
                <Link href="/bee-profile">Bee Hub</Link>
              </div>
              <div>
                <Link href="/bee-profile/bookings">Bookings</Link>
              </div>
              <div>
                <Link href={`/bee-profile/messages/${id}`}>Messages</Link>
              </div>
              <div>
                <Link href="/bee-profile/payments">Payments</Link>
              </div>
              <div>
                <Link href="/bee-profile/settings">Settings</Link>
              </div>
              <button className="Logout" onClick={handleLogout}>
                Logout
              </button>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                alt="close menu bar"
                className="Close-NavBarMenu"
                onClick={() => {
                  setDivShow(true);
                  setSmallSize(false);
                }}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
export default NavBarBeeProfile;
