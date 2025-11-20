"use client";
import Link from "next/link";
import "../styles/AllNectars.css";
import { useState, useEffect } from "react";
import AllNectarsModal from "./AllNectarsModal";
import axios from "axios";
import Loading from "./Loading";

//Displays all nectars found in Nectar Model
const AllNectars = ({
  searchNectars,
  clicked,
  setClicked,
  searchPagination,
  setSearchPagination,
}) => {
  const [modalOpen, setmodalOpen] = useState(false);
  const [allNectars, setAllNectars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(3);
  const [onMount, setOnMount] = useState("unmounted");

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
  const [nectar, setNectar] = useState(null);

  //fetches data for nectars
  useEffect(() => {
    const handleNectars = async () => {
      try {
        const res = await axios.get(`/api/users/bee-profile/nectars`);
        setAllNectars(res.data.nectars);
      } catch (err) {
        console.log(err);
      }
    };
    handleNectars();
    setClicked(false);
    setOnMount("mounted");
  }, []);

  //handles pagination for all nectars when first mounted
  const handlePagination = () => {
    setPagination((pag) => pag + 3);
  };
  //handles pagination for all nectars when a search is applied
  const handleSearchPagination = () => {
    setSearchPagination((pag) => pag + 3);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {onMount === "mounted" && clicked === false ? (
            <div className="NectarsContainer">
              <>
                {allNectars.slice(0, pagination).map((nectar) => {
                  return (
                    <div key={nectar.id} className="NectarsBox">
                      <img
                        onLoad={(e) => {
                          e.currentTarget.classList.add("loaded");
                        }}
                        src={nectar.profileImage}
                        alt="nectar profile image"
                        className="Nectars-Profile-Image"
                      />
                      <div className="Nectars-Info">
                        <p>
                          {nectar.firstName} {nectar.lastName}
                          <img src="/check.png" className="Nectars-Verified" />
                        </p>
                        <p>{nectar.city_location}, MN</p>
                        <Link
                          onClick={() => {
                            setmodalOpen(!modalOpen);
                            setNectar(nectar);
                          }}
                          className="Nectars-View-Button"
                          href="/bee-profile"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
                {modalOpen ? (
                  <AllNectarsModal
                    setmodalOpen={setmodalOpen}
                    nectar={nectar}
                  />
                ) : (
                  ""
                )}
              </>
              {allNectars && pagination > allNectars.length ? (
                <button className="LoadMore" disabled>
                  No More Data
                </button>
              ) : (
                <button className="LoadMore" onClick={handlePagination}>
                  Load More
                </button>
              )}
            </div>
          ) : (
            <div>
              {clicked === true && searchNectars.length > 0 ? (
                <div className="NectarsContainer">
                  <>
                    {searchNectars.slice(0, searchPagination).map((nectar) => {
                      return (
                        <div key={nectar.id} className="NectarsBox">
                          <img
                            onLoad={(e) => {
                              e.currentTarget.classList.add("loaded");
                            }}
                            src={nectar.profileImage}
                            alt="nectar profile image"
                            className="Nectars-Profile-Image"
                          />
                          <div className="Nectars-Info">
                            <p>
                              {nectar.firstName} {nectar.lastName}
                              <img
                                src="/check.png"
                                className="Nectars-Verified"
                              />
                            </p>
                            <p>{nectar.city_location}, MN</p>
                            <Link
                              onClick={() => {
                                setmodalOpen(!modalOpen);
                                setNectar(nectar);
                              }}
                              className="Nectars-View-Button"
                              href="/bee-profile"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {modalOpen ? (
                      <AllNectarsModal
                        setmodalOpen={setmodalOpen}
                        nectar={nectar}
                      />
                    ) : (
                      ""
                    )}
                  </>
                  {searchPagination > searchNectars.length ? (
                    <button className="LoadMore" disabled>
                      No More Data
                    </button>
                  ) : (
                    <button
                      className="LoadMore"
                      onClick={handleSearchPagination}
                    >
                      Load More
                    </button>
                  )}
                </div>
              ) : (
                <p className="NoData"> No Data found under your search.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AllNectars;
