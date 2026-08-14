import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LookingForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setvehicleFound(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-bold text-2xl mb-6 text-gray-900">
        Looking For a Driver
      </h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-24"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="w-full mt-6">
          <div className="flex items-center gap-5 p-4 border-b border-gray-200">
            <i className="text-xl ri-map-pin-user-fill text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pickup</h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                {props.pickup}
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
                {props.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4">
            <i className="text-xl ri-currency-line text-gray-700"></i>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                ₹{props.fare[props.vehicleType]}
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                Total amount
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,
                { rideId: props.rideId },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );
              if (response.data.success) {
                toast.info("Ride cancelled");
                props.onCancel?.();
              } else {
                toast.error("Failed to cancel ride");
              }
            } catch (error) {
              toast.error("Failed to cancel ride");
            }
          }}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm active:scale-95"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;
