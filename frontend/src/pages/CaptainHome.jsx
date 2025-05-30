import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";

const CaptainHome = () => {
    const [RidePopupPanel, setRidePopupPanel] =useState(true);
    const RidePopupPanelref=useRef(null);
    const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] =useState(false);
    const ConfirmRidePopupPanelref=useRef(null);

    useGSAP(
    function () {
      if (RidePopupPanel) {
        gsap.to(RidePopupPanelref.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(RidePopupPanelref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [RidePopupPanel]
  );

  useGSAP(
    function () {
      if (ConfirmRidePopupPanel) {
        gsap.to(ConfirmRidePopupPanelref.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(ConfirmRidePopupPanelref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ConfirmRidePopupPanel]
  );

  return (
    <div className="h-screen">
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
      <div className="h-3/5">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div ref={RidePopupPanelref} className="fixed w-full z-10 bg-white bottom-0 translate-y-full   px-3 py-6 pt-12">
        <RidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>
      
      <div ref={ConfirmRidePopupPanelref} className="fixed h-screen w-full z-10 bg-white bottom-0 translate-y-full   px-3 py-6 pt-12">
        <ConfirmRidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>
    </div>
  );
};

export default CaptainHome;
