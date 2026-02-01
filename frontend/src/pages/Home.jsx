import React, { useContext, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanelMain from "../components/VehiclePanel.jsx";
import ConfirmRide from "../components/ConfirmRide.jsx";
import LookingForDriver from "../components/LookingForDriver.jsx";
import WaitForDriver from "../components/WaitForDriver.jsx";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/userContext";
import { SocketContext } from "../context/SocketContext.jsx";
import { useEffect } from "react";
import LiveTracking from "../components/LiveTracking.jsx";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelref = useRef(null);
  const panelcloseref = useRef(null);
  const [VehiclePanel, setVehiclePanel] = useState(false);
  const vehiclepanelref = useRef(null);
  const [ConfirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmridepanelref = useRef(null);
  const [vehicleFound, setvehicleFound] = useState(false);
  const vehicleFoundref = useRef(null);
  const waitfordriverref = useRef(null);
  const [WaitForDriverPanel, setWaitForDriverPanel] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState();
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    setvehicleFound(false);
    setVehiclePanel(false);
    setWaitForDriverPanel(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitForDriverPanel(false);
    navigate(`/riding`, { state: { ride: ride } });
  });

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelref.current, {
          height: "70%",
          padding: 24,
        });
        gsap.to(panelcloseref.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelref.current, {
          height: "0%",
          padding: 0,
        });

        gsap.to(panelcloseref.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (VehiclePanel) {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [VehiclePanel]
  );

  useGSAP(
    function () {
      if (ConfirmRidePanel) {
        gsap.to(confirmridepanelref.current, {
          transform: "translateY(0%)",
          zIndex: 10,
        });
      } else {
        gsap.to(confirmridepanelref.current, {
          transform: "translateY(100%)",
          zIndex: -9,
        });
      }
    },
    [ConfirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundref.current, {
          transform: "translateY(0%)",
          zIndex: 10,
        });
      } else {
        gsap.to(vehicleFoundref.current, {
          transform: "translateY(100%)",
          zIndex: -10,
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (WaitForDriverPanel) {
        gsap.to(waitfordriverref.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(waitfordriverref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [WaitForDriverPanel]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);
    setvehicleFound(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setFare(response.data.data);
  }

  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <div className="relative h-screen overflow-hidden lg:min-h-screen lg:w-full lg:bg-gradient-to-b lg:from-gray-50 lg:to-white lg:flex lg:flex-col">
      <div className="hidden lg:block relative z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-sm font-light">User Dashboard</p>
          </div>
          <a
            href="/user/logout"
            className="flex items-center justify-center h-12 w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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
          </a>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-sm font-light">User Dashboard</p>
          </div>
          <Link to="/user/logout" className="flex items-center justify-center h-12 w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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

      <div className="hidden lg:flex lg:flex-1 lg:gap-6 lg:p-6">
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0">
            <LiveTracking />
          </div>
        </div>

        <div className="flex flex-col w-[400px] bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div
            className={`flex-shrink-0 px-6 py-6 border-b border-gray-200 ${
              VehiclePanel ||
              ConfirmRidePanel ||
              vehicleFound ||
              WaitForDriverPanel
                ? "hidden"
                : ""
            }`}
          >
            <h4 className="text-2xl font-semibold mb-4">Find a trip</h4>
            <form onSubmit={submitHandler}>
              <div className="relative">
                <div className="absolute left-4 top-[58px] lg:top-[40px] h-16 w-1 bg-gray-900 rounded-full"></div>
                <input
                  onClick={() => {
                    setPanelOpen(true);
                    setvehicleFound(false);
                    setActiveField("pickup");
                  }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
                  type="text"
                  placeholder="Add a pickup location"
                />
                <input
                  onClick={() => {
                    setPanelOpen(true);
                    setvehicleFound(false);
                    setActiveField("destination");
                  }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </form>
            <button
              onClick={findTrip}
              className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
            >
              Find Trip
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {panelOpen && (
              <div className="px-6 py-6">
                <LocationSearchPanel
                  suggestions={
                    activeField === "pickup"
                      ? pickupSuggestions
                      : destinationSuggestions
                  }
                  setPanelOpen={setPanelOpen}
                  setVehiclePanel={setVehiclePanel}
                  setPickup={setPickup}
                  setDestination={setDestination}
                  activeField={activeField}
                  setvehicleFound={setvehicleFound}
                />
              </div>
            )}

            {VehiclePanel &&
              !ConfirmRidePanel &&
              !vehicleFound &&
              !WaitForDriverPanel && (
                <div className="px-6 py-6">
                  <VehiclePanelMain
                    fare={fare}
                    setVehicleType={setVehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                  />
                </div>
              )}

            {ConfirmRidePanel && !vehicleFound && !WaitForDriverPanel && (
              <div className="px-6 py-6">
                <ConfirmRide
                  createRide={createRide}
                  pickup={pickup}
                  destination={destination}
                  fare={fare}
                  vehicleType={vehicleType}
                  setConfirmRidePanel={setConfirmRidePanel}
                  setvehicleFound={setvehicleFound}
                />
              </div>
            )}

            {vehicleFound && !WaitForDriverPanel && (
              <div className="px-6 py-6">
                <LookingForDriver
                  createRide={createRide}
                  pickup={pickup}
                  destination={destination}
                  fare={fare}
                  vehicleType={vehicleType}
                  setvehicleFound={setvehicleFound}
                />
              </div>
            )}

            {WaitForDriverPanel && (
              <div className="px-6 py-6">
                <WaitForDriver
                  ride={ride}
                  setvehicleFound={setvehicleFound}
                  WaitForDriverPanel={WaitForDriverPanel}
                  setWaitForDriverPanel={setWaitForDriverPanel}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[70%] w-screen lg:hidden">
        <LiveTracking />
      </div>

      <div className="lg:hidden flex flex-col justify-end absolute h-screen top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelcloseref}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="opacity-0 absolute top-6 right-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setvehicleFound(false);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pickup location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setvehicleFound(false);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>

        <div ref={panelref} className="h-0 bg-white">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            setvehicleFound={setvehicleFound}
          />
        </div>
      </div>

      <div
        ref={vehiclepanelref}
        className="lg:hidden fixed w-full z-10 bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <VehiclePanelMain
          fare={fare}
          setVehicleType={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={confirmridepanelref}
        className="lg:hidden fixed w-full bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setvehicleFound={setvehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundref}
        className="lg:hidden fixed w-full bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setvehicleFound={setvehicleFound}
        />
      </div>

      <div
        ref={waitfordriverref}
        className="lg:hidden fixed w-full z-10 bg-white bottom-0 px-3 py-6 pt-12"
      >
        <WaitForDriver
          ride={ride}
          setvehicleFound={setvehicleFound}
          WaitForDriverPanel={WaitForDriverPanel}
          setWaitForDriverPanel={setWaitForDriverPanel}
        />
      </div>
    </div>
  );
};

export default Home;
