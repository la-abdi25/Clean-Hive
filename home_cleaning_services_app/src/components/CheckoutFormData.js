"use client";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { currencyConverter } from "../../lib/currencyConverter";
import "../styles/BeeCheckoutForm.css";
import toast, { Toaster } from "react-hot-toast";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import LoadingNectar from "./LoadingNectar";

//bee/customer checkout form to handle payment and bee cleaning requests
const CheckoutFormData = ({ nectarSelect, amount }) => {
  const [formErrs, setFormErrs] = useState({});
  const [paymentIntentErrs, setPaymentIntentErrs] = useState({});
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const elements = useElements();
  const stripe = useStripe();
  const initialCheckout = {
    timeSlot: "",
    beeNotes: "",
  };
  const [checkout, setCheckout] = useState(initialCheckout);
  const [paymentId, setPaymentId] = useState("");
  const [newTimes, setNewTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //Loading Component fetching data from API
  useEffect(() => {
    let timer = "";
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    //cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);
  //handle amount changes
  useEffect(() => {
    const handleCheckout = async () => {
      try {
        //api call
        const res = await axios.post(`/api/users/bee-profile/mycheckout`, {
          amount: currencyConverter(amount),
          nectarId: nectarSelect.id,
        });
        setClientSecret(res.data.clientSecret);
        setPaymentId(res.data.paymentIntentId);
        //get nectar availability times to display to bee/customer
        var newTimesArr = nectarSelect.availability.filter(
          (time) => time.isAvailable === true
        );
        const newArr = [];
        for (let i = 0; i < newTimesArr.length; i++) {
          if (newTimesArr[i].availability_time1) {
            newArr.push(newTimesArr[i].availability_time1);
          } else if (newTimesArr[i].availability_time2) {
            newArr.push(newTimesArr[i].availability_time2);
          } else if (newTimesArr[i].availability_time3) {
            newArr.push(newTimesArr[i].availability_time3);
          } else if (newTimesArr[i].availability_time4) {
            newArr.push(newTimesArr[i].availability_time4);
          } else if (newTimesArr[i].availability_time5) {
            newArr.push(newTimesArr[i].availability_time5);
          }
        }
        setNewTimes(newArr);
      } catch (err) {
        console.log(err);
      }
    };
    handleCheckout();
  }, [amount]);

  //check that no errors exist within the checkout form
  const isValid = () => {
    if (newTimes.length === 0) {
      toast.error(
        "This cleaning agent is not available. Please select a different Nectar.",
        {
          position: "top-right",
        }
      );
    } else {
      const errs = {};
      if (!checkout.beeNotes) {
        errs.beeNotes = "Please enter your bee notes.";
      }
      if (!checkout.timeSlot) {
        errs.timeSlot = "Please select a time slot.";
      }
      setFormErrs(errs);
      return Object.keys(errs).length === 0;
    }
  };
  //handle checkout via paymentintent and user input
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isValid()) {
        const paymentErrs = {};
        const cardElement = elements.getElement(CardNumberElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );
        //extract any errors associated with payment intent initialization
        if (error) {
          paymentErrs.err = error.message;
        }
        setPaymentIntentErrs(paymentErrs);

        //when no errors, send bee checkout data to backend api
        if (Object.keys(paymentErrs).length === 0) {
          const data = {
            beeNotes: checkout.beeNotes,
            timeSlot: checkout.timeSlot,
            nectarId: nectarSelect.id,
            amount: currencyConverter(amount),
            paymentId: paymentId,
          };
          const res = await axios.post(
            `/api/users/bee-profile/mycheckout`,
            data
          );
          //if user receives a successful message display success message in frontend
          if (
            res.data.message &&
            res.data.message.indexOf(
              "Successful booking and payment creation."
            ) !== -1
          ) {
            toast.success("Thank you, your payment has been received.", {
              position: "top-right",
            });
            //reroute user to bookings page
            await setTimeout(() => {
              router.push("/bee-profile/bookings");
            }, 3000);
          }
        }
      }
      // other errors found here
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {" "}
      {isLoading ? (
        <LoadingNectar />
      ) : (
        <form className="Checkout-Form" onSubmit={handleCheckoutSubmit}>
          <div>
            <Toaster />
          </div>
          <div className="Checkout-BeeNotes">
            <label htmlFor="notes">Bee Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={checkout.beeNotes}
              placeholder="Please enter your needed home services here..."
              onChange={(e) => {
                setCheckout({ ...checkout, beeNotes: e.target.value });
              }}
            />
            <div className="Checkout-Errors">{formErrs.beeNotes}</div>
          </div>

          {newTimes.length > 0 && (
            <div className="Checkout-Times">
              <h4>Availability Times</h4>
              {newTimes[0] && (
                <div>
                  <input
                    type="radio"
                    value={newTimes[0]}
                    name="timeSlot"
                    id="time1"
                    onChange={(e) => {
                      setCheckout({ ...checkout, timeSlot: e.target.value });
                    }}
                  />
                  <label htmlFor="time1">{newTimes[0]}</label>
                </div>
              )}
              {newTimes[1] && (
                <div>
                  <input
                    type="radio"
                    value={newTimes[1]}
                    name="timeSlot"
                    id="time2"
                    onChange={(e) => {
                      setCheckout({ ...checkout, timeSlot: e.target.value });
                    }}
                  />
                  <label htmlFor="time2">{newTimes[1]}</label>
                </div>
              )}
              {newTimes[2] && (
                <div>
                  <input
                    type="radio"
                    value={newTimes[2]}
                    name="timeSlot"
                    id="time3"
                    onChange={(e) => {
                      setCheckout({ ...checkout, timeSlot: e.target.value });
                    }}
                  />
                  <label htmlFor="time3">{newTimes[2]}</label>
                </div>
              )}
              {newTimes[3] && (
                <div>
                  <input
                    type="radio"
                    value={newTimes[3]}
                    name="timeSlot"
                    id="time4"
                    onChange={(e) => {
                      setCheckout({ ...checkout, timeSlot: e.target.value });
                    }}
                  />
                  <label htmlFor="time4">{newTimes[3]}</label>
                </div>
              )}
              {newTimes[4] && (
                <div>
                  <input
                    type="radio"
                    value={newTimes[4]}
                    name="timeSlot"
                    id="time5"
                    onChange={(e) => {
                      setCheckout({ ...checkout, timeSlot: e.target.value });
                    }}
                  />
                  <label htmlFor="time5">{newTimes[4]}</label>
                </div>
              )}
              <div className="Checkout-Errors">{formErrs.timeSlot}</div>
            </div>
          )}
          <br />
          <div className="BeeCheckout-Card">
            <h4>Card Information</h4>
            <div>
              <CardNumberElement />
              <CardExpiryElement />
              <CardCvcElement />
            </div>
            <div className="Checkout-Errors">{paymentIntentErrs.err}</div>
          </div>

          <div className="Checkout-Controls">
            <button>Checkout</button>
            <Link href="/bee-profile">Cancel</Link>
          </div>
        </form>
      )}
    </>
  );
};
export default CheckoutFormData;
