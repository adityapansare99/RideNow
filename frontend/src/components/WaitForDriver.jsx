import React from "react";

const WaitForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setWaitForDriverPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <img
          className="h-16"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />

        <div className="text-right">
          <h2 className="text-base font-semibold text-gray-900 capitalize">
            {props.ride?.captain.fullname.firstname +
              " " +
              props.ride?.captain.fullname.lastname}
          </h2>
          <h4 className="text-lg font-bold text-gray-900 mt-1">
            {props.ride?.captain.vehicle.plate}
          </h4>
          <p className="text-xs text-gray-500 font-light mt-1">
            {props.ride?.captain.vehicle.vehicletype +
              " - " +
              props.ride?.captain.vehicle.color}
          </p>
          <div className="mt-2 inline-block bg-yellow-400 px-3 py-1 rounded-full border border-yellow-500">
            <h1 className="text-base font-bold text-gray-900">
              OTP: {props.ride?.otp}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full">
          <div className="flex items-center gap-5 p-4 border-b border-gray-200">
            <i className="text-xl ri-map-pin-user-fill text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pickup</h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 border-b border-gray-200">
            <i className="text-xl ri-map-pin-2-fill text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Destination
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 border-b border-gray-200">
            <i className="text-xl ri-currency-line text-gray-700"></i>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                ₹{props.ride?.fare}
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                Total amount
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4">
            <i className="text-xl ri-phone-line text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {props.ride?.captain?.mobile || ""}
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                Captain number
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitForDriver;
