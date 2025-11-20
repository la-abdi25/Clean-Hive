"use client";
import "../styles/BeeCancelledPayments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

//displays bee/customer cancelled payments
const BeeCancelledPayments = () => {
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

  //handles fetching bee/customer cancelled payments from backend api call
  useEffect(() => {
    const handlePayments = async () => {
      //api call
      const res_id = await axios.get("/api/users/login");
      const res = await axios.get(
        `/api/users/payments/cancelled/${res_id.data.userId}`
      );
      setPayments(res.data.payments);
    };
    handlePayments();
  }, [payments]);
  //handle pagination cancelled payments
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
            <div className="BeeCancelledPayments">
              {payments.slice(0, pagination).map((payment) => {
                return (
                  <div key={payment._id} className="BeeCancelledPayments-Info">
                    <div className="BeeCancelledPayments-Customer-Info">
                      <p className="CancelledBookingRef">
                        <b>{payment.bookingRef}</b>
                      </p>
                      {payment.refundDate ? (
                        <p className="Bee-Cancelled-Pay-Info">
                          A refund of ${payment.amount}.00 has been issued to
                          your Stripe account on {payment.refundDate} due to
                          cancellation, your account is scheduled to reflect
                          these changes within 5-10 business days.
                        </p>
                      ) : (
                        <p className="Bee-Cancelled-Pay-Info">
                          Payment of ${payment.amount}.00 has been cancelled,
                          funds have not been withdrawn from your account.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {payments && pagination > payments.length ? (
                <button className="BeeCancelledPay-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeeCancelledPay-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="Cancelled-Payments"> No cancelled payments.</p>
          )}
        </div>
      )}
    </>
  );
};
export default BeeCancelledPayments;
