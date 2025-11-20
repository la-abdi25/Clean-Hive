"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AccountSettings from "./AccountSettings";
import "../styles/SettingsDashBoard.css";

// bee/customer settings page
const SettingsDashBoard = () => {
  const router = useRouter();

  //logout user from settings tab
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success("User logged out successfully.");
      router.push("/login");
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  return (
    <section className="Settings">
      <h2>My Settings</h2>
      <div className="Settings-Dial">
        <div className="SettingsControl">
          <button className="Settings-Button">Account</button>
          <button className="Logout-Button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="SettingsData">
          <AccountSettings />
        </div>
      </div>
    </section>
  );
};
export default SettingsDashBoard;
