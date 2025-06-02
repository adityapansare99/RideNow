import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div>
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
          <h4 className="text-xl font-semibold">₹295.20</h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center ">
          <i className="text-3xl mb-2 font-extralight  ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center ">
          <i className="text-3xl mb-2 font-extralight ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center ">
          <i className="text-3xl mb-2 ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
