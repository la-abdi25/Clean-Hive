"use client";
import Link from "next/link";
import "../styles/NavBarForms.css";

// nav bar for login and registration forms
const NavBarForms = () => {
  return (
    <header className="NavBarForms">
      <Link href="/">
        <img className="NavBarForms-Logo" src="/logo.png" />
      </Link>
    </header>
  );
};
export default NavBarForms;
