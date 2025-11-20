"use client";
import "../styles/NectarInRoutePayments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

//displays all in route payments for Nectar
const NectarInRoutePayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(3);

  //Loading Component fetching data from API
  useEffect(() => {
    let timer = "";
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    //cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  //fetches in route payments from backend api call
  useEffect(() => {
    const handlePayments = async () => {
      //api call
      const res_id = await axios.get("/api/users/login");
      const res = await axios.get(
        `/api/users/payments/inRoute/${res_id.data.userId}`
      );
      setPayments(res.data.payments);
    };
    handlePayments();
  }, [payments]);
  //handle pagination in route payments
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {payments && payments.length > 0 ? (
            <div className="NectarInRoutePayments">
              {" "}
              {payments.slice(0, pagination).map((payment) => {
                return (
                  <div key={payment._id} className="NectarInRoutePayments-Info">
                    <div className="NectarInRoutePayments-Customer-Info">
                      <p className="NecInRouteBookingRef">
                        <b>{payment.bookingRef}</b>
                      </p>
                      <p>
                        Payment of ${payment.amount}.00 has been transferred to
                        your Stripe account and is scheduled to be available on{" "}
                        {payment.nectarFundsAvailableOn}.
                      </p>
                    </div>
                  </div>
                );
              })}
              {payments && pagination > payments.length ? (
                <button className="NectarInRoutePay-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarInRoutePay-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-InRoutePayments"> No Payments in Route.</p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarInRoutePayments;
