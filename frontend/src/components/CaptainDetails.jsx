import React, { useContext, useEffect } from "react";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainDetails = ({ hist }) => {
  const { captain } = useContext(CaptainDataContext);
  useEffect(()=>{

  },[captain])
  return (
    <div>
      <div>
        <div className="mb-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-700">Online</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
            src={captain?.profilepic||"data:image/webp;base64,UklGRlADAABXRUJQVlA4IEQDAABwJACdASrnAOoAPp1OoEylpKMiJlKYaLATiWlu/HyYMudUxf6jvIWLbQfsvlbRIuRkqWHpu/Z/Mb5wP66oiyt0a6oiyt0a6oiyt0Va15xCADHl5wdyRj2VvIwYvUv+HqK8iS7ZlVV6GL082NdT+YUrsu9SKi7aXW6g49gmemcIuESnenVzYJ5orBx0HEwHpTv2kc8n+TwHXXFzN8bzjhNBG41IcbxkdHpX+ywGJw1JTtMAUNKW0cX2LLOhgIWc4ybEDnOwpnSBnUYMfAyiPWBqMtz6jHt3n+czWQpV6uJcGB8tbgkhpxC9bH3gPUS4CISEH/qTXKRq7QixUy90/bhVq3RqgUArdNlye/Gdi1z8G9sgPZx0a6oiyt0a6oiyt0a6oiyt0a6oiyt0VAAA/v1hgAAE9v1Nxc3zrPv1P3rD6vZBpx7lM/kdslOh8nAw1HjU/eXLM7EJ6lnXM5kFfpY72+fXRsgt1Fk50VSiWtjj4X7Cp5nLMIjn87+R6jby2r0oJeHD/HbHowTjqGxjTwUyTZzRBtTF4GMGGBV9opaUWnq681ION0bZYjggJ7twiRgSJ/+dE6FKoJqleXODh6yPhpOQGVE7+m7POSTdSROKFBorP9sZE5Aqz7R/tGdIujdh1f0sPaZGyLY3yIrAxZbU0ZOrUerupjN/zELfg4P+HR2AP38qeOIijaT15n0LnVXAnJZ4h3IP6S7pKOyeNWQ2OUb/wkDhrfTOGgRRMhpsFIFWaz45KmArd7Lr7hRuy5qhTlJ57mBn5c7BHCR/GME4I+fvIzYUZHTFQGyziRxX/v5M9ZuJtfHnaCPSvyQvbBzgViDrR16KstwYlNQoGyNDMlnAXqy6mDq3Id/vuBwKPwFGDSwmvjH6Tuu3E5hRTLLDc2YiPyalhH8ZEMS8/sS/3n4YwRCYKgibY7P5ksfqNXq7Eh7qjDUauIivNReoT0JaYHJikO4kKwMcacWCgLocgpFglFIMD/bzoH5cU47yO9Pt2hs1IRofG1cOQQvED8RYXBFel3xQrlkzi0g3MgzhwWYGWXSXnbBXyUk49AbR7Qmgjor0m78IE6i4N8txyQEseQM3EMa5DZGKASLiTLAAAAAAAA=="} 
            alt=""
          />
          <h4 className="text-lg font-semibold text-gray-900 capitalize">
            {captain?.fullname.firstname + " " + captain?.fullname.lastname}
          </h4>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-bold text-gray-900">
            ₹{hist?.totalEarning || 0.0}
          </h4>
          <p className="text-xs text-gray-500 font-light">Earned</p>
        </div>
      </div>
      <div className="flex p-4 bg-gray-50 rounded-xl justify-around gap-4 border border-gray-100">
        <div className="text-center flex-1">
          <i className="text-3xl mb-2 font-extralight ri-speed-up-line text-gray-700"></i>
          <h5 className="text-base font-semibold text-gray-900">
            {hist?.totalTime || 0.0} Hr
          </h5>
          <p className="text-xs text-gray-500 font-light mt-1">Hours Online</p>
        </div>
        <div className="text-center flex-1">
          <i className="text-3xl mb-2 ri-booklet-line text-gray-700"></i>
          <h5 className="text-base font-semibold text-gray-900">
            {hist?.totalDist || 0.0} KM
          </h5>
          <p className="text-xs text-gray-500 font-light mt-1">
            Total Distance
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
