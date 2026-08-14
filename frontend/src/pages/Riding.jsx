import React, { use, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import LiveRideTracking from "../components/LiveRideTracking.jsx";
import { toast } from "react-toastify";
import RideRating from "../components/RideRating.jsx";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = useContext(SocketContext);
  const [paymentstatus, setPaymentStatus] = useState(ride?.paymentStatus);
  const [rideInfoPanel, setRideInfoPanel] = useState(false);
  const rideInfoPanelRef = useRef(null);
  const [done, setDone] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [rideStatus, setRideStatus] = useState(ride?.status);

  const rideStatusFunc = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/ride-status`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) setRideStatus(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    rideStatusFunc();
  }, []);

  useEffect(() => {
    if (rideStatus === "completed") {
      setDone(true);
    }
  },[rideStatus]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const userId = ride?.user?._id || ride?.user;
    if (userId) {
      socket.emit("join", {
        userId: userId,
        userType: "user",
      });
    } else {
      console.error("User ID not found in the ride data.");
    }

    const handleRideEnded = (data) => {
      setDone(true);
      toast.info("Your ride has ended. Please give the rating");
    };

    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate, ride]);

  useGSAP(
    function () {
      if (rideInfoPanel) {
        gsap.to(rideInfoPanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(rideInfoPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [rideInfoPanel],
  );

  if (!ride) {
    return <Navigate to="/home" replace />;
  }

  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RazorPayKey,
      amount: order.amount,
      currency: order.currency,
      name: "RideNow",
      description: "RideNow Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/verifypayment`,
            { order_id: response.razorpay_order_id },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (data.success) {
            setPaymentStatus(true);
          }
        } catch (error) {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const makepayment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/makepayment`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        await initpay(response.data.data);
      }

      if (!response) {
        toast.error("Payment failed, please try again.");
        return;
      }
    } catch (error) {
      toast.error("Payment failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-50 to-white flex flex-col">
      <div className="relative z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-light">
              Your Ride in Progress
            </p>
          </div>
          <Link
            to="/home"
            className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <i className="text-lg font-medium ri-home-5-line"></i>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row lg:gap-6 lg:p-6">
        <div className="relative w-full h-[70vh] md:h-[84vh] lg:flex-1 lg:min-h-0 lg:rounded-2xl lg:overflow-hidden lg:shadow-lg">
          <LiveRideTracking ride={ride} userType="user" />
        </div>

        <div className="lg:hidden relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 -mt-6 py-6">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="px-4 sm:px-6 pb-6">
            <button
              onClick={() => setRideInfoPanel(true)}
              className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                View Ride Details
              </span>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:h-[84vh] lg:w-100 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <img
                  className="h-16"
                  src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                  alt=""
                />

                <div className="text-right">
                  <h2 className="text-base font-semibold text-gray-900">
                    {ride?.captain.fullname.firstname +
                      " " +
                      ride?.captain.fullname.lastname}
                  </h2>
                  <h4 className="text-lg font-bold text-gray-900 mt-1">
                    {ride?.captain.vehicle.plate}
                  </h4>
                  <p className="text-xs text-gray-500 font-light mt-1">
                    {ride?.captain.vehicle.vehicletype +
                      " - " +
                      ride?.captain.vehicle.color}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full">
                  <div className="flex items-center gap-5 p-4 border-b border-gray-200">
                    <i className="text-xl ri-map-pin-2-fill text-gray-700"></i>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Destination
                      </h3>
                      <p className="text-sm text-gray-500 font-light mt-1">
                        {ride?.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-4">
                    <i className="text-xl ri-currency-line text-gray-700"></i>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        ₹{ride?.fare}
                      </h3>
                      <p className="text-sm text-gray-500 font-light mt-1">
                        Total amount
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => makepayment()}
                className={`w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  paymentstatus && "hidden"
                }`}
              >
                Make Payment
              </button>

              <button
                className={`w-full mt-6 bg-emerald-50 text-emerald-700 font-semibold py-3.5 rounded-lg border border-emerald-200 ${
                  !paymentstatus && "hidden"
                }`}
              >
                Payment Successful
              </button>
            </div>

            <div className="mx-5 flex flex-col gap-10 mb-10">
              {done && (
                <RideRating
                  ride={ride}
                  onRatingSubmitted={() => {
                    navigate("/home");
                  }}
                />
              )}

              {done && (
                <Link className="text-center text-sm text-blue-600" to="/home">
                  Remind me later
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={rideInfoPanelRef}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 translate-y-full"
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white pt-3 pb-2 z-10 flex items-center justify-between px-6">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto flex-1"></div>
            <button
              onClick={() => setRideInfoPanel(false)}
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
          <div className="px-4 sm:px-6 flex flex-col gap-10 pb-8">
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <img
                className="h-16"
                src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                alt=""
              />

              <div className="text-right">
                <h2 className="text-base font-semibold text-gray-900">
                  {ride?.captain.fullname.firstname +
                    " " +
                    ride?.captain.fullname.lastname}
                </h2>
                <h4 className="text-lg font-bold text-gray-900 mt-1">
                  {ride?.captain.vehicle.plate}
                </h4>
                <p className="text-xs text-gray-500 font-light mt-1">
                  {ride?.captain.vehicle.vehicletype +
                    " - " +
                    ride?.captain.vehicle.color}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center">
              <div className="w-full">
                <div className="flex items-center gap-5 p-4 border-b border-gray-200">
                  <i className="text-xl ri-map-pin-2-fill text-gray-700"></i>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Destination
                    </h3>
                    <p className="text-sm text-gray-500 font-light mt-1">
                      {ride?.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-4">
                  <i className="text-xl ri-currency-line text-gray-700"></i>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      ₹{ride?.fare}
                    </h3>
                    <p className="text-sm text-gray-500 font-light mt-1">
                      Total amount
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => makepayment()}
              className={`w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                paymentstatus && "hidden"
              }`}
            >
              Make Payment
            </button>

            <button
              className={`w-full mt-6 bg-emerald-50 text-emerald-700 font-semibold py-3.5 rounded-lg border border-emerald-200 ${
                !paymentstatus && "hidden"
              }`}
            >
              Payment Successful
            </button>

            <div className="md:mx-5 flex flex-col gap-10 mb-10">
              {done && (
                <RideRating
                  ride={ride}
                  onRatingSubmitted={() => {
                    navigate("/home");
                  }}
                />
              )}

              {done && (
                <Link className="text-center text-sm text-blue-600" to="/home">
                  Remind me later
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {rideInfoPanel && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={() => setRideInfoPanel(false)}
        />
      )}
    </div>
  );
};

export default Riding;
