"use client";
import "../styles/NectarPaymentsDashBoard.css";
import NectarInRoutePayments from "./NectarInRoutePayments";
import NectarCancelledPayments from "./NectarCancelledPayments";
import { useState } from "react";

//displays payments for nectar user (in route and cancelled)
const NectarPaymentsDashBoard = () => {
  const [paymentsType, setPaymentsType] = useState("inroute");

  return (
    <section className="NectarPaymentsDashBoard">
      <h2>My Deposits</h2>
      <div className="NectarPayments-Container">
        <div className="Payment-Buttons">
          <button
            className="NectarPayments-Button-Text"
            onClick={() => {
              setPaymentsType("inroute");
            }}
          >
            In Route
          </button>
          <button
            className="NectarPayments-Button-Text"
            onClick={() => {
              setPaymentsType("cancelled");
            }}
          >
            Cancelled
          </button>
        </div>
        <div className="Payment-Details">
          {paymentsType === "inroute" ? <NectarInRoutePayments /> : ""}
          {paymentsType === "cancelled" ? <NectarCancelledPayments /> : ""}
        </div>
      </div>
    </section>
  );
};
export default NectarPaymentsDashBoard;
