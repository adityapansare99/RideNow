import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import { toast } from "react-toastify";

const CaptainHome = () => {
  const [RidePopupPanel, setRidePopupPanel] = useState(false);
  const RidePopupPanelref = useRef(null);
  const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ConfirmRidePopupPanelref = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  const [hist, sethist] = useState();

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
    histroy();

    const handleNewRide = (data) => {
    setRide(data);
    setRidePopupPanel(true);
  };

  const handleRideAlreadyConfirmed = (data) => {
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(false);
    alert("This ride was just accepted by another captain");
  };

  socket.on("new-ride", handleNewRide);
  socket.on("ride-already-confirmed", handleRideAlreadyConfirmed);

    // return () => clearInterval(locationInterval)
    return () => {
    clearInterval(locationInterval);
    socket.off("new-ride", handleNewRide);
    socket.off("ride-already-confirmed", handleRideAlreadyConfirmed);
  };
  }, [socket, captain._id]);

const confirmRide = async () => {
  try {
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
  } catch (error) {
    toast.error(error.response?.data?.message || "This ride has already been accepted by another captain");
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(false);
  }
};

  const histroy = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        sethist(response.data.data);
        return;
      }
    } catch (error) {
      toast.error("Failed to fetch ride history. Please try again.");
    }
  };

  const cancelRide = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,
        { rideId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (!response.data.success) {
        toast.error("Failed to cancel ride. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to cancel ride. Please try again.");
    }
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
    [RidePopupPanel],
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
    [ConfirmRidePopupPanel],
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="relative z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-light">
              Captain Dashboard
            </p>
          </div>

          <div className="absolute sm:hidden right-17">
            <Link
              to="/captain/edit-profile"
              className="flex items-center justify-center h-10 w-10 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="ri-user-settings-line text-lg text-gray-700"></i>
            </Link>
          </div>

          <div className="absolute hidden sm:block right-24">
            <Link
              to="/captain/edit-profile"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="ri-user-settings-line text-base text-gray-700"></i>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </Link>
          </div>

          <div className="absolute sm:hidden right-30">
            <Link
              to="/captain/ride-history"
              className="flex items-center px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="ri-history-line text-base text-gray-700"></i>
            </Link>
          </div>

          <div className="absolute hidden sm:block right-53">
            <Link
              to="/captain/ride-history"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="ri-history-line text-base text-gray-700"></i>
              <span className="text-sm font-medium text-gray-700">
                Ride History
              </span>
            </Link>
          </div>

          <Link
            to="/captain/logout"
            className="flex items-center justify-center h-10 w-10 sm:h-10 sm:w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
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
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row lg:gap-6 lg:p-6">
        <div className="relative flex-1 w-full lg:rounded-2xl lg:overflow-hidden lg:shadow-lg">
          <div className="absolute inset-0">
            <LiveTracking />
          </div>
        </div>

        <div className="lg:hidden relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 -mt-6">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3"></div>
          <div className="px-4 sm:px-6 pb-6">
            <CaptainDetails hist={hist} />
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-[400px] bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200">
            <CaptainDetails hist={hist} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {RidePopupPanel && (
              <div className="px-6 py-6">
                <RidePopup
                  ride={ride}
                  setRidePopupPanel={setRidePopupPanel}
                  setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                  confirmRide={confirmRide}
                />
              </div>
            )}

            {ConfirmRidePopupPanel && (
              <div className="px-6 py-6">
                <ConfirmRidePopup
                  ride={ride}
                  setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                  setRidePopupPanel={setRidePopupPanel}
                  cancelRide={cancelRide}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={RidePopupPanelref}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 translate-y-full"
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
          </div>
          <div className="px-4 sm:px-6 pb-8">
            <RidePopup
              ride={ride}
              setRidePopupPanel={setRidePopupPanel}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              confirmRide={confirmRide}
            />
          </div>
        </div>
      </div>

      <div
        ref={ConfirmRidePopupPanelref}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 translate-y-full"
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
          </div>
          <div className="px-4 sm:px-6 pb-8">
            <ConfirmRidePopup
              ride={ride}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              setRidePopupPanel={setRidePopupPanel}
              cancelRide={cancelRide}
            />
          </div>
        </div>
      </div>

      {(RidePopupPanel || ConfirmRidePopupPanel) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={() => {
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default CaptainHome;
