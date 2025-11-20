"use client";
import "../styles/Reviews.css";
import { useState, useEffect } from "react";
import ReviewsModal from "./ReviewsModal";
import axios from "axios";
import { useParams } from "next/navigation";
import { nanoid } from "nanoid";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//displays each individual review to bee/customer
const Reviews = ({ nectarId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(3);
  var params = useParams();
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

  //fetches review for single nectar based on params id
  useEffect(() => {
    const handleReviews = async () => {
      const res1 = await axios.get("/api/users/login");
      setUser(res1.data.userId);
      const res2 = await axios.get(
        `/api/users/bee-profile/nectar-reviews/${params.id}`
      );
      setReviews(res2.data.myReviews);
    };
    handleReviews();
  }, [reviews]);

  // allows bee/customer to delete a review
  const handleDelete = async (reviewId) => {
    try {
      const res = await axios.delete(
        `/api/users/bee-profile/nectar-reviews/${reviewId}`
      );
      setReviews((review) => {
        reviews.filter((review) => review.id !== reviewId);
      });
    } catch (err) {
      console.log(err);
    }
  };
  //handle reviews pagination
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  return (
    <section className="Reviews">
      <div>
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          className="Add-Review"
        >
          Add a Review
        </button>
        <div className="Reviews-Toggle">
          {openModal ? (
            <ReviewsModal setOpenModal={setOpenModal} nectarId={nectarId} />
          ) : (
            ""
          )}
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {reviews && reviews.length > 0 ? (
            <div className="Reviews-Box">
              {reviews.slice(0, pagination).map((nectarReview) => {
                return (
                  <div className="Bee-Review" key={nanoid()}>
                    <div className="Review-Data">
                      <img
                        src="/user2.png"
                        alt="Customer Review"
                        className="NectarImg-Review"
                      />
                      <p>{nectarReview.beeName}</p>
                      <p>{nectarReview.beeLocation}</p>
                    </div>

                    <div className="Review-Info">
                      <p>
                        <b>Rating</b> {nectarReview.rating}
                      </p>
                      <p>
                        <b>Plan</b> {nectarReview.plan}
                      </p>
                      <p className="Customer-Review">
                        <b>Review</b> {nectarReview.review}
                      </p>
                    </div>
                    <i>{nectarReview.date}</i>
                    {user === nectarReview.beeId && (
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "#e31616" }}
                        className="Delete-Review"
                        onClick={() => {
                          handleDelete(nectarReview.id, nectarReview.beeId);
                        }}
                      />
                    )}
                  </div>
                );
              })}
              {reviews && pagination > reviews.length ? (
                <button className="ReviewsLoadMore" disabled>
                  No More Data
                </button>
              ) : (
                <button className="ReviewsLoadMore" onClick={handlePagination}>
                  Load More
                </button>
              )}
            </div>
          ) : (
            <p className="No-Reviews">No Reviews yet.</p>
          )}
        </>
      )}
    </section>
  );
};
export default Reviews;
