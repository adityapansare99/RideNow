import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopup = (props) => {
  const [otp, setopt] = useState("");
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const resopnse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      {
        params: { rideId: props.ride._id, otp: otp },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (resopnse.status === 200) {
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };
  return (
    <div>
      <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-bold text-2xl mb-5 text-gray-900">
        Confirm this ride to Start
      </h3>

      <div className="flex items-center justify-between p-4 bg-yellow-400 rounded-lg mt-4 border border-yellow-500">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-yellow-500"
            src="data:image/webp;base64,UklGRlADAABXRUJQVlA4IEQDAABwJACdASrnAOoAPp1OoEylpKMiJlKYaLATiWlu/HyYMudUxf6jvIWLbQfsvlbRIuRkqWHpu/Z/Mb5wP66oiyt0a6oiyt0a6oiyt0Va15xCADHl5wdyRj2VvIwYvUv+HqK8iS7ZlVV6GL082NdT+YUrsu9SKi7aXW6g49gmemcIuESnenVzYJ5orBx0HEwHpTv2kc8n+TwHXXFzN8bzjhNBG41IcbxkdHpX+ywGJw1JTtMAUNKW0cX2LLOhgIWc4ybEDnOwpnSBnUYMfAyiPWBqMtz6jHt3n+czWQpV6uJcGB8tbgkhpxC9bH3gPUS4CISEH/qTXKRq7QixUy90/bhVq3RqgUArdNlye/Gdi1z8G9sgPZx0a6oiyt0a6oiyt0a6oiyt0a6oiyt0VAAA/v1hgAAE9v1Nxc3zrPv1P3rD6vZBpx7lM/kdslOh8nAw1HjU/eXLM7EJ6lnXM5kFfpY72+fXRsgt1Fk50VSiWtjj4X7Cp5nLMIjn87+R6jby2r0oJeHD/HbHowTjqGxjTwUyTZzRBtTF4GMGGBV9opaUWnq681ION0bZYjggJ7twiRgSJ/+dE6FKoJqleXODh6yPhpOQGVE7+m7POSTdSROKFBorP9sZE5Aqz7R/tGdIujdh1f0sPaZGyLY3yIrAxZbU0ZOrUerupjN/zELfg4P+HR2AP38qeOIijaT15n0LnVXAnJZ4h3IP6S7pKOyeNWQ2OUb/wkDhrfTOGgRRMhpsFIFWaz45KmArd7Lr7hRuy5qhTlJ57mBn5c7BHCR/GME4I+fvIzYUZHTFQGyziRxX/v5M9ZuJtfHnaCPSvyQvbBzgViDrR16KstwYlNQoGyNDMlnAXqy6mDq3Id/vuBwKPwFGDSwmvjH6Tuu3E5hRTLLDc2YiPyalhH8ZEMS8/sS/3n4YwRCYKgibY7P5ksfqNXq7Eh7qjDUauIivNReoT0JaYHJikO4kKwMcacWCgLocgpFglFIMD/bzoH5cU47yO9Pt2hs1IRofG1cOQQvED8RYXBFel3xQrlkzi0g3MgzhwWYGWXSXnbBXyUk49AbR7Qmgjor0m78IE6i4N8txyQEseQM3EMa5DZGKASLiTLAAAAAAAA=="
            alt=""
          />
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {props.ride?.user.fullname.firstname +
              " " +
              props.ride?.user.fullname.lastname}
          </h2>
        </div>
        <h5 className="text-base font-bold text-gray-900">
          {(props.ride?.distance / 1000).toFixed(1)} KM
        </h5>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-6">
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
                {props.ride?.user?.mobile || ""}
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                Phone number
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              value={otp}
              onChange={(e) => {
                setopt(e.target.value);
              }}
              type="text"
              className="bg-white border border-gray-200 px-4 py-3 text-base font-mono rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter OTP"
            />
            <button className="w-full text-base mt-5 flex justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
              Confirm
            </button>

            <button
              onClick={() => {
                props.cancelRide(props.ride._id);
                props.setConfirmRidePopupPanel(false);
              }}
              type="button"
              className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;
