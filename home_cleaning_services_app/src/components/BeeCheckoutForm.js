"use client";
import CheckoutFormData from "./CheckoutFormData";
import { currencyConverter } from "../../lib/currencyConverter";
import axios from "axios";
import "../styles/BeeCheckoutForm.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import LoadingNectar from "./LoadingNectar";
import { useRouter } from "next/navigation";
//make sure stripe public key exists
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}
//initialize stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// bee/customer booking form integrated with Stripe payment
const BeeCheckoutForm = () => {
  var params = useParams();
  const [nectarSelect, setNectarSelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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

  //handles fetching nectar data to display on booking page
  useEffect(() => {
    const handleNectar = async () => {
      try {
        const id = params.id;
        const res = await axios.get(
          `/api/users/nectar-profile/nectar-data/${id}`
        );
        setNectarSelect(res.data.nectarData);
      } catch (err) {
        if (err.response.data.idExists === false) {
          router.push("/not-found");
        } else {
          console.log(err);
        }
      }
    };
    handleNectar();
  }, []);
  return (
    <section className="BeeCheckoutForm">
      {isLoading ? (
        <LoadingNectar />
      ) : (
        <div className="Checkout-Info">
          <div className="Checkout-Details">
            <img
              src={nectarSelect?.profileImage}
              alt="Nectar image"
              onLoad={(e) => {
                e.currentTarget.classList.add("loaded");
              }}
            />

            <h3>Cleaning Session with {nectarSelect?.firstName}</h3>
            <p>
              <b>Plan</b> {nectarSelect?.plan}
            </p>
          </div>
          <div className="Checkout-Total">
            <p>
              <b>Total </b> ${nectarSelect?.price}.00
            </p>
          </div>
        </div>
      )}
      {/* //handle checkout process here */}
      {nectarSelect?.price && (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            currency: "usd",
            amount: currencyConverter(nectarSelect?.price),
          }}
        >
          <CheckoutFormData
            amount={nectarSelect?.price}
            nectarSelect={nectarSelect}
          />
        </Elements>
      )}
    </section>
  );
};
export default BeeCheckoutForm;
