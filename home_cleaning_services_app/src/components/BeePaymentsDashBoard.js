"use client";
import "../styles/BeePaymentsDashBoard.css";
import BeeInRoutePayments from "./BeeInRoutePayments";
import BeeCancelledPayments from "./BeeCancelledPayments";
import { useState } from "react";

//display payments for bee/customer (in route, and cancelled)
const BeePaymentsDashBoard = () => {
  const [paymentsType, setPaymentsType] = useState("inroute");

  return (
    <section className="BeePaymentsDashBoard">
      <h2>My Payments</h2>
      <div className="BeePayments-Container">
        <div className="BeePayment-Buttons">
          <button
            className="BeePayments-Button-Text"
            onClick={() => {
              setPaymentsType("inroute");
            }}
          >
            In Route
          </button>
          <button
            className="BeePayments-Button-Text"
            onClick={() => {
              setPaymentsType("cancelled");
            }}
          >
            Cancelled
          </button>
        </div>
        <div className="BeePayment-Details">
          {paymentsType === "inroute" ? <BeeInRoutePayments /> : ""}
          {paymentsType === "cancelled" ? <BeeCancelledPayments /> : ""}
        </div>
      </div>
    </section>
  );
};
export default BeePaymentsDashBoard;
