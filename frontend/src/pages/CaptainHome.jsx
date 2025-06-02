import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import { useEffect } from "react";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [RidePopupPanel, setRidePopupPanel] = useState(false);
  const RidePopupPanelref = useRef(null);
  const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ConfirmRidePopupPanelref = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "captain", userId: captain._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    // return () => clearInterval(locationInterval)
  }, []);

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopupPanel(true);
  });

  const confirmRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  };

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
        <LiveTracking />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={RidePopupPanelref}
        className="fixed w-full z-10 bg-white bottom-0 translate-y-full   px-3 py-6 pt-12"
      >
        <RidePopup
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={ConfirmRidePopupPanelref}
        className="fixed h-screen w-full z-10 bg-white bottom-0 translate-y-full overflow-y-scroll  px-3 py-6 pt-12"
      >
        <ConfirmRidePopup
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
