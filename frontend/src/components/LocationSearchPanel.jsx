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
    <div className="lg:h-[40vh] lg:overflow-y-auto scrollbar-hide">
      {props.suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem.description)}
          className="flex gap-4 border border-gray-200 p-4 active:border-black hover:bg-gray-50 rounded-lg items-center my-3 justify-start cursor-pointer transition-all"
        >
          <h2 className="bg-gray-100 h-10 flex items-center justify-center min-w-10 rounded-full">
            <i className="ri-map-pin-fill text-gray-700"></i>
          </h2>
          <h4 className="font-medium text-gray-900 text-base">
            {elem.description}
          </h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
