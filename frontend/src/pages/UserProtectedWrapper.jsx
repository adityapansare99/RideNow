import React, { useEffect, useState, useContext } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.data.user) {
          setUser(res.data.data.user);
          setIsLoading(false);
        } else {
          throw new Error("User not found");
        }
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">RideNow</h2>
            <p className="text-gray-500 text-sm font-light">
              Loading your dashboard...
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
