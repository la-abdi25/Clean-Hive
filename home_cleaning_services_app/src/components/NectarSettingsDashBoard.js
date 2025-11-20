"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NectarAccountSettings from "./NectarAccountSettings";
import "../styles/SettingsDashBoard.css";
import axios from "axios";

//settings page for nectar
const NectarSettingsDashBoard = () => {
  const router = useRouter();
  //handles logout from application
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success("User logged out successfully.");
      router.push("/login");
    } catch (err) {
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
          <NectarAccountSettings />
        </div>
      </div>
    </section>
  );
};
export default NectarSettingsDashBoard;
