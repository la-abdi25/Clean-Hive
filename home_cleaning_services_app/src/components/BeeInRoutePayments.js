"use client";
import "../styles/BeeInRoutePayments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

//displays bee/customer in route payments
const BeeInRoutePayments = () => {
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

  //handles fetching bee/customer in route payments from backend api call
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
            <div className="BeeInRoutePayments">
              {payments.slice(0, pagination).map((payment) => {
                return (
                  <div key={payment._id} className="BeeInRoutePayments-Info">
                    <div className="BeeInRoutePayments-Customer-Info">
                      <p className="InRouteBookingRef">
                        <b>{payment.bookingRef}</b>
                      </p>
                      <div className="BeeInRoutePayments-Details">
                        Payment of ${payment.amount}.00 has been withdrawn from
                        your Stripe account and is scheduled to be available on{" "}
                        {payment.nectarFundsAvailableOn} in your Nectars
                        account.
                        <br />
                        <div className="BeePayment">
                          <b>
                            Brand: <i>{payment.beePayment.card_brand}</i>
                          </b>
                          <b>
                            Last 4: <i>{payment.beePayment.card_last_4}</i>
                          </b>
                          <b>
                            Expiration Year:{" "}
                            <i>{payment.beePayment.card_exp_yr}</i>
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {payments && pagination > payments.length ? (
                <button className="BeeInRoutePay-More" disabled>
                  No More Data
                </button>
              ) : (
                <button
                  className="BeeInRoutePay-More"
                  onClick={handlePagination}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-InRoute-Payments"> No payments in route.</p>
          )}
        </div>
      )}
    </>
  );
};
export default BeeInRoutePayments;
