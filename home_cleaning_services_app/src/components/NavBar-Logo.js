"use client";
import Link from "next/link";
import "../styles/NavBarBeeProfile.css";

//gold and white cleanhive logo, navigates to bee hub, used for nectar reviews page and booking checkout page
const NavBarLogo = () => {
  return (
    <header className="NavBarBeeProfile">
      <div>
        <Link href="/">
          <img className="NavBarBeeProfile-Logo" src="/profile-logo.png" />
        </Link>
      </div>
    </header>
  );
};
export default NavBarLogo;
