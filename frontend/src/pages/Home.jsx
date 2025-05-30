import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanelMain from "../components/VehiclePanel.jsx";
import ConfirmRide from "../components/ConfirmRide.jsx";
import LookingForDriver from "../components/LookingForDriver.jsx";
import WaitForDriver from "../components/WaitForDriver.jsx";

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
  const vehicleFoundref=useRef(null);
  const waitfordriverref=useRef(null);
  const [WaitForDriverPanel, setWaitForDriverPanel] = useState(false);

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
        });
      } else {
        gsap.to(confirmridepanelref.current, {
          transform: "translateY(100%)",
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
        });
      } else {
        gsap.to(vehicleFoundref.current, {
          transform: "translateY(100%)",
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

  return (
    <div className="relative h-screen overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <div className="h-screen w-screen">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
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
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pickup location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>

        <div ref={panelref} className=" h-0 bg-white">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div
        ref={vehiclepanelref}
        className="fixed w-full z-10 bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <VehiclePanelMain setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div
        ref={confirmridepanelref}
        className="fixed w-full z-10 bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setvehicleFound={setvehicleFound}/>
      </div>

      <div ref={vehicleFoundref}
        className="fixed w-full z-10 bg-white bottom-0 translate-y-full px-3 py-6 pt-12"
      >
        <LookingForDriver setvehicleFound={setvehicleFound}/>
      </div>

      <div ref={waitfordriverref}
        className="fixed w-full z-10 bg-white bottom-0 px-3 py-6 pt-12"
      >
        <WaitForDriver setWaitForDriverPanel={setWaitForDriverPanel}/>
      </div>

    </div>
  );
};

export default Home;