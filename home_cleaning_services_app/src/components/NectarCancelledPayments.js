"use client";
import "../styles/NectarCancelledPayments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

//displays all cancelled payments for nectar
const NectarCancelledPayments = () => {
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

  //fetches all cancelled payments for nectar
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
            <div className="NectarCancelledPayments">
              {" "}
              {payments.slice(0, pagination).map((payment) => {
                return (
                  <div
                    key={payment._id}
                    className="NectarCancelledPayments-Info"
                  >
                    <div className="NectarCancelledPayments-Customer-Info">
                      <p className="NecCancelledBookingRef">
                        <b>{payment.bookingRef}</b>
                      </p>
                      {payment.transferReversalDate ? (
                        <p>
                          A transfer of ${payment.amount}.00 has been reversed
                          from your Stripe account due to cancellation, your
                          account is scheduled to reflect these changes on{" "}
                          {payment.transferReversalDate}.
                        </p>
                      ) : (
                        <p>
                          Payment of ${payment.amount}.00 has been cancelled due
                          to cancellation of booking# {payment.bookingRef} funds
                          have not been added to your account.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {payments && pagination > payments.length ? (
                <button className="NectarCancelledPay-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="NectarCancelledPay-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-CancelledPayments"> No cancelled payments.</p>
          )}
        </div>
      )}
    </>
  );
};
export default NectarCancelledPayments;
