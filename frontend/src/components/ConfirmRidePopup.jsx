import React, { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmRidePopup = (props) => {
  const [otp,setopt]=useState('');
  const submitHandler = (e) => {
    e.preventDefault();
  }
  return (
    <div>
      <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0 "
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-semibold text-2xl">Confirm this ride to Start</h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
          />
          <h2 className="text-lg font-medium">Harshi Patel</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-500">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600">
                Kankariya Talab, Baramati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-500">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600">
                Kankariya Talab, Baramati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-small -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form onSubmit={(e)=>{
            submitHandler(e);
          }}>

            <input value={otp} onChange={(e)=>{
              setopt(e.target.value);
            }} type="text" className="bg-[#eee] px-6 py-4 text-lg font-mono rounded-lg w-full mt-5" placeholder="Enter OTP" />
            <Link
            to={"/captain-riding"}
            className="w-full text-lg mt-2 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
          >
            Confirm
          </Link>

          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(false);
            }}
            className="w-full mt-1 bg-red-600 text-white font-semibold p-3 rounded-lg"
          >
            Cancel
          </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;
