"use client";
import "../styles/Testimonials.css";

//mock bee/customer testimonials for landing page
const Testimonials = () => {
  return (
    <div className="Testimonials">
      <div className="Testimonials-FeedBack">
        <img src="/user.png" className="Testimonials-Image" />
        <h3>
          Sally M. <img src="/check.png" className="Testimonials-Verified" />
        </h3>
        <p>Minneapolis, MN, US</p>
        <div className="Testimonials-Info">
          <p>
            Wow, this cleaning service is spectacular very professional and
            organized! 100% recommend!
          </p>
        </div>
        <img src="/star5.png" className="Testimonials-Ratings" />
      </div>
      <div className="Testimonials-FeedBack">
        <img src="/user.png" className="Testimonials-Image" />
        <h3>
          John R. <img src="/check.png" className="Testimonials-Verified" />
        </h3>
        <p>Minneapolis, MN, US</p>
        <div className="Testimonials-Info">
          <p>
            I was very busy due to going on a vacation, my house was a mess,
            CleanHive took my house from dust to shine in matter of hours. Thank
            you!
          </p>
        </div>
        <img src="/star5.png" className="Testimonials-Ratings" />
      </div>
      <div className="Testimonials-FeedBack">
        <img src="/user.png" className="Testimonials-Image" />
        <h3>
          Amina S. <img src="/check.png" className="Testimonials-Verified" />
        </h3>
        <p>Minneapolis, MN, US</p>
        <div className="Testimonials-Info">
          <p>
            My home was disorganized, expecially my kitchen, with piled up
            dishes, I was met with professionalism and hard work, the Nectars
            did great leaving my home spotless!
          </p>
        </div>
        <img src="/star4.png" className="Testimonials-Ratings" />
      </div>
      <div className="Testimonials-FeedBack">
        <img src="/user.png" className="Testimonials-Image" />
        <h3>
          Jenny T. <img src="/check.png" className="Testimonials-Verified" />
        </h3>
        <p>Minneapolis, MN, US</p>
        <div className="Testimonials-Info">
          <p>
            I chose the Deep clean package for my residents and they did a good
            job on the main lobby, they cleaned the floors and made sure to
            leave a great scent! My residents are amazed!
          </p>
        </div>
        <img src="/star4.png" className="Testimonials-Ratings" />
      </div>
    </div>
  );
};
export default Testimonials;
