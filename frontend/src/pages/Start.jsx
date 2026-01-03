import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="relative flex-1 bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 pt-6 px-4 sm:pt-8 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            RideNow
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 font-light">
            Your ride, your way
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Get Started with RideNow
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-light">
              Sign in to book your next ride
            </p>
          </div>

          <Link
            to="/login"
            className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              Continue
            </span>
          </Link>

          <div className="flex items-center space-x-3 pt-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-center text-gray-500 text-xs sm:text-sm font-light">
            New to RideNow?{" "}
            <Link
              to="/login"
              className="text-black font-semibold hover:underline transition-all"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Start;
