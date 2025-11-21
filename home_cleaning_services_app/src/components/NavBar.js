"use client";
import Link from "next/link";
import "../styles/NavBar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
//home page navbar, place to login and register
//customer logs in as bee
//cleaning agent logs in as nectar
const NavBar = () => {
  const [smallSize, setSmallSize] = useState(false);
  const [divShow, setDivShow] = useState(true);
  const handleScreenSize = () => {
    setSmallSize(true);
    setDivShow(false);
  };
  return (
    <header className="Nav-Header">
      <nav className="NavBar">
        <img className="NavBar-Logo" src="/logo.png" />
        <div className="NavBar-Links">
          <div className="NavBar-Register">
            <div className="NavBar-MainLinks-Register">
              <div>
                <p>Register?</p>
              </div>
              <div className="NavBar-Register2">
                <div>
                  <Link href="/register-bee">Bees</Link>
                </div>
                <div>
                  <Link href="/register-nectar">Nectars</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="NavBar-Login">
            <div className="NavBar-MainLinks-Login">
              <div>
                <p>Returning user?</p>
              </div>
              <div className="NavBar-Register2">
                <Link href="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="SmallSize-MenuBar">
          {divShow && (
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "#ffffff" }}
              alt="menu bar icon"
              onClick={handleScreenSize}
              className="Menu-Bar"
            />
          )}
          {smallSize && (
            <div className="SmallLinks">
              <div>
                <Link href="/register-bee">Bees</Link>
              </div>
              <div>
                <Link href="/register-nectar">Nectars</Link>
              </div>
              <div>
                <Link href="/login">Login</Link>
              </div>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
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
export default NavBar;
