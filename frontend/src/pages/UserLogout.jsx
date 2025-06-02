import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
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
          navigate("/login");
        }
      } catch (err) {
        console.error("Logout failed", err);
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate, token]);

  return (
    <div>
      <h1>Logging you out...</h1>
    </div>
  );
};

export default UserLogout;
