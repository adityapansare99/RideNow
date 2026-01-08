import React from "react";

const VehiclePanelMain = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setVehiclePanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-bold text-2xl mb-6 text-gray-900">
        Choose a Vehicle
      </h3>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehicleType("car");
        }}
        className="flex p-4 w-full border border-gray-200 hover:bg-gray-50 active:border-black rounded-lg mb-3 items-center justify-between cursor-pointer transition-all"
      >
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Car"
        />
        <div className="ml-3 w-1/2">
          <h4 className="font-semibold text-base text-gray-900">
            Car{" "}
            <span className="text-gray-600">
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm text-gray-700">2 mins away</h5>
          <p className="font-light text-xs text-gray-500 mt-1">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-900">₹{props.fare.car}</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehicleType("moto");
        }}
        className="flex p-4 w-full border border-gray-200 hover:bg-gray-50 active:border-black rounded-lg mb-3 items-center justify-between cursor-pointer transition-all"
      >
        <img
          className="h-14"
          src="https://static.vecteezy.com/system/resources/previews/024/819/250/large_2x/electric-motorbike-electric-bike-e-bike-e-motorbike-electric-vehicle-e-vehicle-transparent-background-ai-generated-png.png"
          alt="Bike"
        />
        <div className="ml-3 w-1/2">
          <h4 className="font-semibold text-base text-gray-900">
            Moto{" "}
            <span className="text-gray-600">
              <i className="ri-user-3-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-sm text-gray-700">3 mins away</h5>
          <p className="font-light text-xs text-gray-500 mt-1">
            Affordable, motorcycle rides
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-900">₹{props.fare.moto}</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehicleType("auto");
        }}
        className="flex p-4 w-full border border-gray-200 hover:bg-gray-50 active:border-black rounded-lg mb-3 items-center justify-between cursor-pointer transition-all"
      >
        <img
          className="h-12"
          src="https://th.bing.com/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?w=243&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3"
          alt="Auto"
        />
        <div className="ml-3 w-1/2">
          <h4 className="font-semibold text-base text-gray-900">
            Auto{" "}
            <span className="text-gray-600">
              <i className="ri-user-3-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-sm text-gray-700">2 mins away</h5>
          <p className="font-light text-xs text-gray-500 mt-1">
            Affordable, auto rides
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-900">₹{props.fare.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanelMain;
