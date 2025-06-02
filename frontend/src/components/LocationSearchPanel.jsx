import React from "react";

const LocationSearchPanel = (props) => {
  const handleSuggestionClick = (suggestion) => {
    if (props.activeField === "pickup") {
      props.setPickup(suggestion);
    } else if (props.activeField === "destination") {
      props.setDestination(suggestion);
    }
    props.setPanelOpen(true);
    props.setvehicleFound(false);
  };

  return (
    <div>
      {props.suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem.description)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem.description}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
