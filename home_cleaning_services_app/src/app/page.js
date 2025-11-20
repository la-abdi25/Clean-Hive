"use client";
import Testimonials from "@/components/Testimonials";
import Button from "../components/Button";
import "../styles/Button-PricingPlans.css";
import "../styles/Home.css";
import PricingPlans from "../components/PricingPlans";
import NavBar from "../components/NavBar";

// Home page/landing page, includes pricing plans, testimonials, and home cleaning images
export default function Home() {
  return (
    <div className="Home-Background">
      <NavBar />
      <div className="Home">
        <section id="Home-Section-1">
          <div className="Home-Description">
            <div className="Home-Focus">
              <p className="Home-p3">
                Because every busy <i>Bee </i>needs <br /> our hard-working{" "}
                <i>Nectars </i>
                to keep their home clean and alive
              </p>
            </div>
            <div className="Home-Button">
              <Button />
            </div>
          </div>
        </section>
        <section id="Home-Section-2">
          <div className="Home-Info">
            <h1 className="Home-Info-H1">Check out our Nectars at work!</h1>
            <div className="Home-Images">
              <img src="/cleaninglivingroom.png" />
              <img src="/folding.png" />
              <img src="/cleaningshelf.png" />
              <img src="/cleanbathroom.png" />
              <img src="/cleaning.png" />
              <img src="/cleaningdishes.png" />
              <img src="/cleaningbed.png" />
            </div>
          </div>
        </section>
        <section id="Home-Section-3">
          <div>
            <h1 className="Home-Testimonials-H1">
              What do our busy Bees have to say!
            </h1>
            <Testimonials />
          </div>
        </section>
        <section id="Home-Section-4">
          <div>
            <h1 className="Home-Testimonials-H1">Pricing Plans</h1>
            <PricingPlans />
          </div>
        </section>
      </div>
    </div>
  );
}
