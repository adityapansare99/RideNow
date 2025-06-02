import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full">
        <h2 className="w-16 ml-8 font-medium text-4xl text-white">Uber</h2>
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get Started with Uber</h2>
          <Link
            to="/login"
            className="w-full flex items-center justify-center bg-black text-white py-3 rounded mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
