import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainDetails = ({ hist }) => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div>
      <div>
        <div className="mb-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-700">Online</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center  justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
          />
          <h4 className="text-lg font-medium capitalize">
            {captain.fullname.firstname + " " + captain.fullname.lastname}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">
            ₹{hist?.totalEarning || 0.0}
          </h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-around">
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">{hist?.totalTime || 0.0} Hr</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center ">
          <i className="text-3xl mb-2 ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{hist?.totalDist || 0.0} KM</h5>
          <p className="text-sm text-gray-600">Total Distance</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
