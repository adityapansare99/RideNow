import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const logoutcaptain = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          localStorage.removeItem("token");
          navigate("/captain-login");
        }
      } catch (err) {
        console.error("Logout failed", err);
        navigate("/captain-login");
      }
    };

    logoutcaptain();
  }, [navigate, token]);

  return (
    <div>
      <h1>Logging you out...</h1>
    </div>
  );
};

export default CaptainLogout;
