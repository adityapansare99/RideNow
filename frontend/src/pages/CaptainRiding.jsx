import React, { use, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import { useRef } from "react";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
    const[FinishRidePanel,setFinishRidePanel]=useState(false);
    const FinishRidePanelref=useRef(null);
    const location=useLocation();
    const rideData=location.state?.ride;
    useGSAP(
    function () {
      if (FinishRidePanel) {
        gsap.to(FinishRidePanelref.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(FinishRidePanelref.current, {
          transform: "translateY(100%)",
        });
      }
    },              
    [FinishRidePanel]                
  );
  return (
    <div className="h-screen relative">

      <div className="fixed p-6 t-0 flex items-center justify-between w-screen">
        <img
          className="w-16 "
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to={"/captain-login"}
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <LiveTracking/>
      </div>
      <div className="h-1/5 flex items-center justify-between relative p-6 bg-yellow-400"
      onClick={() => {setFinishRidePanel(true)}}>
       <h5
        onClick={() => {}}
        className="p-1 text-center w-[90%] absolute top-0 "
      >
        <i className="text-3xl text-black ri-arrow-up-wide-line"></i>
      </h5>
      <div className="mr-4 -ml-2">
        <h4 className="text-xl font-semibold ">Ride ID:</h4>
        <p className="text-sm"> {rideData?._id}</p>
      </div>
        
        <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      <div ref={FinishRidePanelref} className="fixed w-full z-10 bg-white bottom-0 translate-y-full   px-3 py-6 pt-12">
        <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel}/>
      </div>
    </div>
  );
};

export default CaptainRiding;
