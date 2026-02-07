import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";
import LiveRideTracking from "../components/LiveRideTracking.jsx";

const CaptainRiding = () => {
  const [FinishRidePanel, setFinishRidePanel] = useState(false);
  const FinishRidePanelref = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="relative z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-light">
              Ongoing Ride
            </p>
          </div>
          <Link
            to="/captain-login"
            className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
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
        <div className="relative w-full h-[70vh] lg:h-[84vh] flex-1 lg:rounded-2xl lg:overflow-hidden lg:shadow-lg">
         <LiveRideTracking ride={rideData} userType="captain" />

          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto z-10">
            <div className="inline-flex mb-4 items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-100">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Ride ID:
                </h4>
                <p className="text-xs text-gray-600">{rideData?._id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 -mt-6 py-6">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="px-4 sm:px-6 pb-6 space-y-3">
            <button
              onClick={() => setFinishRidePanel(true)}
              className="group w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Complete Ride
              </span>
            </button>
            <button
              onClick={() => setFinishRidePanel(true)}
              className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                View User Information
              </span>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:h-[84vh] lg:w-[400px] bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6">
              <FinishRide
                rideData={rideData}
                setFinishRidePanel={setFinishRidePanel}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={FinishRidePanelref}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 translate-y-full"
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white pt-3 pb-2 z-10 flex items-center justify-between px-6">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto flex-1"></div>
            <button
              onClick={() => setFinishRidePanel(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="px-4 sm:px-6 pb-8">
            <FinishRide
              rideData={rideData}
              setFinishRidePanel={setFinishRidePanel}
            />
          </div>
        </div>
      </div>

      {FinishRidePanel && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={() => setFinishRidePanel(false)}
        />
      )}
    </div>
  );
};

export default CaptainRiding;
