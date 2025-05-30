import React from "react";
import "remixicon/fonts/remixicon.css";

const LocationSearchPanel = (props) => {

  const location = [
    "24B, Near Kapoor's Cafe, Sheryians Coding School, Bhopal",
    "22B,Near BOM Bank, Disha Coding School,Baramati",
    "1690A Near VP College Rui Goverment Hospital, Baramati",
    "24B, Near pansare's Cafe, Sheryians Coding School, Bhopal",
  ]
  return (
    //this is the sample data
    <div>
      {location.map(function (lem,inx) {
        return <div key={inx} onClick={()=>{
            props.setVehiclePanel(true);
            props.setPanelOpen(false);
        }} 
        className="gap-4 flex items-center border-2 p-3 rounded-xl border-gray-50 active:border-black justify-start my-2">
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">
            {lem}
          </h4>
        </div>;
      })}
    </div>
  );
};

export default LocationSearchPanel;
