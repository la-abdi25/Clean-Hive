"use client";
import "../styles/Reviews.css";
import { nanoid } from "nanoid";

//display top 4 reviews for nectar on nectar profile
const NectarTopReviews = ({ topReviews }) => {
  return (
    <section>
      <div>
        <div className="Reviews-Box1">
          {topReviews.map((myReview) => {
            return (
              <div className="Bee-Review" key={nanoid()}>
                <div className="Review-Data">
                  <img
                    src="/user2.png"
                    alt="Customer Review"
                    className="NectarImg-Review"
                  />
                  <p>{myReview.beeName}</p>
                  <p>{myReview.beeLocation}</p>
                </div>
                <div className="Review-Info">
                  <p>
                    <b>Rating</b> {myReview.rating}
                  </p>
                  <p>
                    <b>Plan</b> {myReview.plan}
                  </p>
                  <p className="Customer-Review">
                    <b>Review</b> {myReview.review}
                  </p>
                </div>
                <i>{myReview.date}</i>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default NectarTopReviews;
