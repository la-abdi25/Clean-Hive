"use client";
import axios from "axios";
import "../styles/BeeDashBoard.css";
import AllNectars from "./AllNectars";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
//component to display nectars in bee dashboard, features like search, booking, and reviews
const BeeDashBoard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [searchNectars, setSearchNectars] = useState([]);
  const [searchPagination, setSearchPagination] = useState(3);
  const initialSearchData = {
    plan: "",
    rating: "",
    startDate: "",
    endDate: "",
  };
  const [searchData, setSearchData] = useState(initialSearchData);
  useEffect(() => {
    //make api call
    const handleName = async () => {
      const res = await axios.get("/api/users/login");
      setUserName(res.data.firstName);
    };
    handleName();
  }, []);
  const handleSearch = async () => {
    try {
      //api call to backend to filter the search
      const res = await axios.get(
        `/api/users/bee-profile/nectars/searchFilter?searchValue=${searchValue}&plan=${searchData.plan}&rating=${searchData.rating}&startDate=${searchData.startDate}&endDate=${searchData.endDate}`
      );
      setSearchNectars(res.data.nectars);
      setSearchValue("");
      setSearchData(initialSearchData);
      setSearchPagination(3);
      setClicked(true);
    } catch (err) {
      console.log(err);
    }
  };
  //function to apply user filters entered and check dates
  const handleApply = () => {
    if (searchData.startDate && !searchData.endDate) {
      toast.error("Please enter an end date to search for availability", {
        position: "top-right",
      });
    }
    if (!searchData.startDate && searchData.endDate) {
      toast.error("Please enter an start date to search for availability", {
        position: "top-right",
      });
    }
    setFilter(!filter);
  };

  return (
    <section className="BeeDashBoard">
      <div>
        <Toaster />
      </div>
      {userName && (
        <h3 className="Bee-Intro">
          Welcome back busy bee <i>{userName}</i> !
        </h3>
      )}

      <div className="BeeDashBoard-Nectars">
        <div className="BeeDashBoard-LookUp">
          <input
            type="text"
            name="nectar-search"
            className="BeeDashBoard-Search"
            placeholder="enter nectar name..."
            value={searchValue || ""}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <div className="Filter-Data">
            {!filter && (
              <div className="Filter-Dropdown">
                <FontAwesomeIcon
                  icon={faSliders}
                  className="Filter"
                  alt="Filter Icon"
                  onClick={(e) => {
                    setFilter(!filter);
                  }}
                />
              </div>
            )}
            <div className="FilterSelection">
              {filter && (
                <div className="FilterBack">
                  <div className="FilterSearch">
                    <div className="SearchPlan">
                      <label htmlFor="plan" className="Headers-Search">
                        Cleaning Plan
                      </label>
                      <br />
                      <div>
                        <input
                          type="radio"
                          value="standard clean"
                          name="plan"
                          id="plan1"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              plan: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="plan1">Standard ($150.00)</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="deep clean"
                          name="plan"
                          id="plan2"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              plan: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="plan2">Deep ($250.00)</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="extra clean"
                          name="plan"
                          id="plan3"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              plan: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="plan3">Extra ($350.00)</label>
                      </div>
                    </div>
                    <br />
                    <div className="SearchRating">
                      <label htmlFor="plan" className="Headers-Search">
                        Rating
                      </label>
                      <br />
                      <br />
                      <div>
                        <input
                          type="radio"
                          value="1-2"
                          name="rating"
                          id="rating1"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              rating: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="rating1">1-2</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="2-3"
                          name="rating"
                          id="rating2"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              rating: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="rating2">2-3</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="3-4"
                          name="rating"
                          id="rating3"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              rating: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="rating3">3-4</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="4-5"
                          name="rating"
                          id="rating3"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              rating: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="rating3">4-5</label>
                      </div>
                      <br />
                    </div>
                    <div className="SearchAvailability">
                      <label htmlFor="startDate" className="Headers-Search">
                        Availability
                      </label>
                      <br />
                      <br />
                      <div>
                        <label htmlFor="startDate">Start Date </label>
                        <input
                          type="date"
                          value={searchData.startDate}
                          name="startDate"
                          id="startDate"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              startDate: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <br />
                      <div>
                        <label htmlFor="endDate">End Date </label>
                        <input
                          type="date"
                          value={searchData.endDate}
                          name="endDate"
                          id="endDate"
                          onChange={(e) => {
                            setSearchData({
                              ...searchData,
                              endDate: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="Apply-Button" onClick={handleApply}>
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            alt="Search"
            onClick={handleSearch}
            className="FilSearch"
          />
        </div>
        <AllNectars
          searchNectars={searchNectars}
          clicked={clicked}
          setClicked={setClicked}
          searchPagination={searchPagination}
          setSearchPagination={setSearchPagination}
        />
      </div>
    </section>
  );
};
export default BeeDashBoard;
