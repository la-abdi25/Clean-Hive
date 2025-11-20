import Link from "next/link";
import NavBarLogo from "@/components/NavBar-Logo";
import "../styles/Not-Found.css";

//not found page for users navigating to non-existent pages
export default function NotFound() {
  return (
    <>
      <NavBarLogo />
      <div className="Not-Found">
        <h2>Page Not Found</h2>
        <img src="/error-404.png" alt="Not Found" />
        <p>OOPS, this resource could not be found. </p>
        <p>Please click the link below to return to your Hub.</p>

        <Link href="/" className="Return-404">
          Return Home
        </Link>
      </div>
    </>
  );
}
