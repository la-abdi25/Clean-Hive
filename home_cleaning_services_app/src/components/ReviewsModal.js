"use client";
import "../styles/ReviewsModal.css";
import axios from "axios";
import { useState, useEffect } from "react";

//modal for bee user to leave a review
const ReviewsModal = ({ setOpenModal, nectarId }) => {
  const initialFormData = {
    nectarId,
    rating: 1,
    review: "",
    plan: "",
    beeId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrs, setFormErrs] = useState({});

  //fetches logged in user data, bee userId
  useEffect(() => {
    const handleBeeUser = async () => {
      const res = await axios.get("/api/users/login");
      const id = res.data.userId;
      setFormData({ ...formData, beeId: id });
    };
    handleBeeUser();
  }, []);

  //checks if form data is valid
  const isValid = () => {
    const errs = {};
    if (!formData.rating) {
      errs.rating = "Please enter your rating.";
    }
    if (formData.rating > 5 || formData.rating < 1) {
      errs.ratingsLength = "Please enter a rating of 1-5.";
    }
    if (!formData.review) {
      errs.review = "Please enter your review.";
    }
    if (!formData.plan) {
      errs.plan = "Please enter your plan.";
    }
    setFormErrs(errs);
    return Object.keys(errs).length === 0;
  };
  //allows bee user to submit a review
  const handleReview = async (e) => {
    //api call here
    e.preventDefault();
    try {
      if (isValid()) {
        const res2 = await axios.post(
          `/api/users/bee-profile/nectar-reviews/${nectarId}`,
          formData
        );
        setFormErrs({});
        setFormData(initialFormData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="ReviewsModal">
      {setOpenModal ? (
        <form className="ReviewsModal-Form" onSubmit={handleReview}>
          <div className="Display-Review">
            <label htmlFor="rating">
              <b>Rating </b>
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating || 1}
              onChange={(e) => {
                setFormData({ ...formData, rating: e.target.value });
              }}
            />
            <div className="Review-Errors">{formErrs.rating}</div>
            <div className="Review-Errors">{formErrs.ratingsLength}</div>
          </div>
          <div className="Display-Review">
            <label htmlFor="plan">
              <b>Cleaning plan</b>
            </label>
            <select
              name="plan"
              id="plan"
              className="ReviewModalSelect"
              value={formData.plan}
              onChange={(e) => {
                setFormData({ ...formData, plan: e.target.value });
              }}
            >
              <option value="">-- Select your cleaning plan--</option>
              <option value="standard clean">Standard Clean</option>
              <option value="deep clean">Deep Clean</option>
              <option value="extra clean">Extra Clean</option>
            </select>
            <div className="Review-Errors">{formErrs.plan}</div>
          </div>
          <div className="Display-Review">
            <label htmlFor="review">
              <b>Review</b>
            </label>
            <textarea
              id="review"
              name="review"
              placeholder="Please enter your review..."
              value={formData.review}
              onChange={(e) => {
                setFormData({ ...formData, review: e.target.value });
              }}
            ></textarea>
            <div className="Review-Errors">{formErrs.review}</div>
          </div>
          <button className="Submit">Submit</button>
        </form>
      ) : (
        ""
      )}
      <button
        onClick={() => {
          setOpenModal(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
};
export default ReviewsModal;
