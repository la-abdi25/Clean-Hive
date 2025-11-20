"use client";
import "../styles/PricingPlans.css";
//pricing plans displayed on home page
const PricingPlans = () => {
  return (
    <div className="PricingPlans">
      <div className="PricingPlans-Container">
        <div className="PricingPlans-Info">
          <h1>Standard Clean</h1>
          <p>Select 1 main area:</p>
          <div>
            <ul>
              <li>Kitchen</li>
              <li>Living Room</li>
              <li>Dining Room</li>
              <li>Bedroom</li>
              <li>Bathroom</li>
              <li>Main Space: Office, Lobby</li>
            </ul>
          </div>
          <p className="Price">$150.00</p>
        </div>
      </div>
      <div className="PricingPlans-Container">
        <div className="PricingPlans-Info">
          <h1>Deep Clean</h1>
          <p>Select 2 main areas:</p>
          <ul>
            <li>Kitchen</li>
            <li>Living Room</li>
            <li>Dining Room</li>
            <li>Bedroom</li>
            <li>Bathroom</li>
            <li>Main Space: Office, Lobby</li>
          </ul>
          <p className="Price">$250.00</p>
        </div>
      </div>
      <div className="PricingPlans-Container">
        <div className="PricingPlans-Info">
          <h1>Extra Clean</h1>
          <p>Select 3 main areas:</p>
          <ul>
            <li>Kitchen</li>
            <li>Living Room</li>
            <li>Dining Room</li>
            <li>Bedroom</li>
            <li>Bathroom</li>
            <li>Main Space: Office, Lobby</li>
          </ul>
          <p className="Price">$350.00</p>
        </div>
      </div>
    </div>
  );
};
export default PricingPlans;
