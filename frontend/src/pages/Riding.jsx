import React, { use } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking.jsx";
import axios from "axios";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = useContext(SocketContext);
  const [paymentstatus, setPaymentStatus] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RazorPayKey,
      amount: order.amount,
      currency: order.currency,
      name: "RideNow",
      description: "RideNow Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/verifypayment`,
            { order_id: response.razorpay_order_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            setPaymentStatus(true);
          }
        } catch (error) {
          console.error("error in payment", error);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const makepayment = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/makepayment`,
      {
        rideId: ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if(response.data.success){
      await initpay(response.data.data);
    }

    if (!response) {
      alert("Payment failed");
      return;
    }
  };

  return (
    <div className="h-screen">
      <Link
        to={"/home"}
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className="h-1/2">
        <LiveTracking />
      </div>

      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
          />

          <div className="text-right">
            <h2 className="text-lg font-medium">
              {ride?.captain.fullname.firstname +
                " " +
                ride?.captain.fullname.lastname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">
              {ride?.captain.vehicle.vehicletype +
                "-" +
                ride?.captain.vehicle.color}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-1 border-gray-500">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-small -mt-1 text-gray-600">
                  {ride?.destination}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-3 -mb-2">
              <i className="text-lg ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                <p className="text-small -mt-1 text-gray-600">Total amount</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={()=>makepayment()}
          className={`w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg ${
            paymentstatus && "hidden"
          }`}
        >
          Make Payment
        </button>

        <button
          className={`w-full mt-5 bg-indigo-100 text-stone-500 font-semibold p-2 rounded-lg ${
            !paymentstatus && "hidden"
          }`}
        >
          Payment Successful
        </button>
      </div>
    </div>
  );
};

export default Riding;
