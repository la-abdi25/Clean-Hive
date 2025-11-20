"use client";
import "../styles/ReviewsDashBoard.css";
import Reviews from "./Reviews";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
//reviews page for bee/customer
const ReviewsDashBoard = () => {
  const [learnMore, setLearnMore] = useState(false);
  const [textType, setTextType] = useState(true);
  var params = useParams();
  const [nectarSelect, setNectarSelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [nectarReviews, setNectarReviews] = useState([]);
  const router = useRouter();
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

  //fetches reviews for each nectar based on user id
  useEffect(() => {
    const handleNectar = async () => {
      try {
        const id = params.id;
        const res = await axios.get(
          `/api/users/nectar-profile/nectar-data/${id}`
        );
        setNectarSelect(res.data.nectarData);
        setNectarReviews(res.data.myReviews);
      } catch (err) {
        if (err.response.data.idExists === false) {
          router.push("/not-found");
        } else {
          console.log(err);
        }
      }
    };
    handleNectar();
  }, [nectarReviews]);

  //bee/customer clicks on > arrow to view individual data for bee/customer
  const handleClick = () => {
    setTextType(!textType);
    setLearnMore(!learnMore);
  };

  return (
    <div className="Reviews-Board">
      {isLoading ? (
        <Loading />
      ) : (
        <section className="ReviewsDashBoard">
          <h1>Check out the Beeviews on {nectarSelect.firstName}</h1>
          <div className="Nectar-Review-Box">
            <div className="Nectar-Review-Profile">
              <div className="Reviews-Check">
                <img src="/check.png" alt="Verified Nectar" />
              </div>
              <div className="Reviews-ProfileImage">
                <img
                  src={nectarSelect.profileImage}
                  alt="Nectar Profile Image"
                  onLoad={(e) => {
                    e.currentTarget.classList.add("loaded");
                  }}
                  className="NectarReviewImage"
                />
              </div>
              <div className="Review-Nec-Data">
                <p>
                  <b>{nectarSelect.firstName}</b>
                </p>
                <p>Bee Rating </p>
                <h4>{nectarSelect.rating}/5</h4>
              </div>
            </div>
            <div className="Nectar-Find-Data">
              <button
                className="LearnButton"
                onClick={() => {
                  handleClick();
                }}
              >
                {textType ? (
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      alt="Next"
                      className="Controls"
                    />
                  </div>
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    alt="Close"
                    className="Controls"
                  />
                )}
              </button>

              <div>
                {learnMore && (
                  <div className="Nectar-Review-Bio">
                    <div>
                      <b>Bio</b>
                      <p>{nectarSelect.bio}</p>
                    </div>
                    <div>
                      <b>Location </b>
                      <p>{nectarSelect.city_location}, MN</p>
                    </div>
                    <div>
                      <b>Plan </b>
                      <p>{nectarSelect.plan}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="Review">
            <h2>Reviews</h2>
            <Reviews nectarId={nectarSelect.id} />
          </div>
        </section>
      )}
    </div>
  );
};
export default ReviewsDashBoard;
