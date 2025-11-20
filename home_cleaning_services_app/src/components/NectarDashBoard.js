"use client";
import NectarTopReviews from "@/components/NectarTopReviews";
import "../styles/NectarDashBoard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingNectar from "./LoadingNectar";

//nectar profile page
const NectarDashBoard = () => {
  const [nectarData, setNectarData] = useState({});
  const [topReviews, setTopReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  //fetches top reviews and nectar data from backend api call
  useEffect(() => {
    const handleNectarData = async () => {
      const res = await axios.get("/api/users/login");
      const res2 = await axios.get(
        `api/users/nectar-profile/nectar-data/${res.data.userId}`
      );
      setNectarData(res2.data.nectarData);
      setTopReviews(res2.data.myReviews);
    };
    handleNectarData();
  }, []);

  return (
    <section className="Nectar-View">
      {isLoading ? (
        <LoadingNectar />
      ) : (
        <div className="NectarDashBoard ">
          <h3>
            Welcome back hardworking nectar <i>{nectarData.firstName}</i> !
          </h3>
          <div className="NectarProfile">
            <img
              src={nectarData.profileImage}
              alt="Nectar Profile Image"
              onLoad={(e) => {
                e.currentTarget.classList.add("loaded");
              }}
            />
            <div className="NectarInfo">
              <div>
                <b>Rating </b>
                <p>{nectarData.rating}/5</p>
              </div>
              <div>
                <b>Bio </b>
                <p>{nectarData.bio}</p>
              </div>
              <div>
                <b>Location </b>
                <p>{nectarData.city_location}, MN</p>
              </div>
            </div>
          </div>

          <div className="Nectar-TopReviews">
            <h3>My Top Reviews</h3>
            {topReviews.length > 0 ? (
              <NectarTopReviews topReviews={topReviews} />
            ) : (
              <div>
                <p className="No-TopReviews">No Top Reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default NectarDashBoard;
