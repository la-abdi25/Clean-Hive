"use client";
import "../styles/Loading.css";

//all purpose loading component for all areas of application
const Loading = () => {
  return (
    <div className="Loading">
      <div className="honeycomb">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Loading;
