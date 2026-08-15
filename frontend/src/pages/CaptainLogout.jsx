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
          },
        );

        if (res.data.success) {
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/captain-login");
          }, 400);
        }
      } catch (err) {
        console.error("Logout failed", err);
        setTimeout(() => {
          navigate("/captain-login");
        }, 400);
      }
    };

    logoutcaptain();
  }, [navigate, token]);

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-700 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Logging you out...
          </h2>
          <p className="text-gray-500 text-sm font-light">Captain Dashboard</p>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogout;
