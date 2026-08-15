import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
      );

      if (response.data.success) {
        const data = response.data.data;
        setUser(data.user);
        localStorage.setItem("token", data.accesstoken);
        navigate("/home");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      const errData = error?.response?.data;
      if (errData?.data && errData.data[0]?.msg) {
        toast.error(errData.data[0].msg);
      } else {
        toast.error(
          errData?.message || "Something went wrong. Please try again.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-linear-to-b from-gray-50 to-white flex-col">
      <div className="relative h-15 sm:h-20 md:h-20 mb-4 bg-cover bg-center">
        <div className="relative z-10 pt-6 px-4 sm:pt-8 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            RideNow
          </h1>
          <p className="text-gray-900 text-xs sm:text-sm mt-1 font-light">
            Your ride, your way
          </p>
        </div>
      </div>

      <div className="flex-1 bg-linear-to-b from-gray-50 to-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-light">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 mt-6"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Sign In
              </span>
            </button>
          </form>

          <div className="flex items-center space-x-3 pt-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-center text-gray-500 text-xs sm:text-sm font-light mt-6">
            New here?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold hover:underline transition-all"
            >
              Create new Account
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/captain-login"
              className="group w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Sign in as Captain
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
