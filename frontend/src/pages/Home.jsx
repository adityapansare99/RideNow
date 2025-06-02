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
import { useNavigate } from "react-router-dom";
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
          // opacity: 1,
        });
        gsap.to(panelcloseref.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelref.current, {
          height: "0%",
          padding: 0,
          // opacity: 0,
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
    <div className="relative h-screen overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <div className="h-[70%] w-screen">
        <LiveTracking />
      </div>

      <div className=" flex flex-col justify-end absolute h-screen top-0 w-full">
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

        <div ref={panelref} className=" h-0 bg-white">
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
        className="fixed w-full z-10 bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
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
        className="fixed w-full bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
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
        className="fixed w-full bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
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
        className="fixed w-full z-10 bg-white bottom-0 px-3 py-6 pt-12"
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
