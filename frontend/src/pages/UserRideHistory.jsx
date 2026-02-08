import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const RideData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/ride-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if(!response.data.success){
        alert("Unable to fetch your rides");
        navigate("/home");
      }

      setRides(response.data.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    RideData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getFilteredRides = () => {
    if (activeTab === "all") return rides;
    return rides.filter((ride) => ride.status === activeTab);
  };

  const filteredRides = getFilteredRides();
  const activeRide = rides.find((ride) => ride.status === "ongoing");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "accepted":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "ri-checkbox-circle-fill";
      case "ongoing":
        return "ri-loader-4-line";
      case "cancelled":
        return "ri-close-circle-fill";
      case "accepted":
        return "ri-check-line";
      case "pending":
        return "ri-time-line";
      default:
        return "ri-question-line";
    }
  };

  const handleGoToRide = (ride) => {
    navigate("/riding", { state: { ride } });
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-gray-50 to-white flex-col">
      <div className="lg:hidden relative z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-xs font-light">Ride History</p>
          </div>
          <Link
            to="/home"
            className="flex items-center justify-center h-10 w-10 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <i className="text-lg font-medium ri-home-5-line"></i>
          </Link>
        </div>
      </div>

      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-500 text-sm font-light">Ride History</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/user/edit-profile"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="ri-user-settings-line text-base text-gray-700"></i>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </Link>
            <Link
              to="/home"
              className="flex items-center justify-center h-12 w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-5xl mx-auto">
          {activeRide && (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-roadster-line text-2xl"></i>
                    <h3 className="text-lg font-bold">Active Ride</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-1">
                    To: {activeRide.destination}
                  </p>
                  <p className="text-blue-100 text-xs">
                    Started: {formatTime(activeRide.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleGoToRide(activeRide)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md active:scale-95"
                >
                  View Ride
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Your Rides
            </h2>
            <p className="text-gray-500 text-sm">
              {rides.length} total ride{rides.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="mb-6">
            <div className="lg:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
              >
                <option value="all">All ({rides.length})</option>
                <option value="ongoing">
                  Ongoing ({rides.filter((r) => r.status === "ongoing").length})
                </option>
                <option value="completed">
                  Completed (
                  {rides.filter((r) => r.status === "completed").length})
                </option>
                <option value="cancelled">
                  Cancelled (
                  {rides.filter((r) => r.status === "cancelled").length})
                </option>
              </select>
            </div>

            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-1 gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All ({rides.length})
              </button>
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === "ongoing"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Ongoing ({rides.filter((r) => r.status === "ongoing").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === "completed"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Completed (
                {rides.filter((r) => r.status === "completed").length})
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === "cancelled"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Cancelled (
                {rides.filter((r) => r.status === "cancelled").length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin"></i>
                <p className="text-gray-500 mt-4">Loading rides...</p>
              </div>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <i className="ri-taxi-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rides found
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "all"
                    ? "You haven't taken any rides yet"
                    : `No ${activeTab} rides`}
                </p>
                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <i className="ri-add-line"></i>
                  Book a Ride
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            ride.status,
                          )} flex items-center gap-1`}
                        >
                          <i className={getStatusIcon(ride.status)}></i>
                          {ride.status.charAt(0).toUpperCase() +
                            ride.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(ride.createdAt)} at{" "}
                          {formatTime(ride.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{ride.fare}
                      </p>
                      {ride.paymentStatus && (
                        <span className="text-xs text-green-600 font-medium">
                          <i className="ri-checkbox-circle-fill"></i> Paid
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Pickup
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {ride.pickup}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 ml-1.5">
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Destination
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {ride.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {ride.captain && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <i className="ri-user-line text-gray-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {ride.captain.fullname.firstname}{" "}
                          {ride.captain.fullname.lastname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ride.captain.vehicle.plate} •{" "}
                          {ride.captain.vehicle.vehicletype}
                        </p>
                      </div>
                    </div>
                  )}

                  {ride.status === "ongoing" && (
                    <button
                      onClick={() => handleGoToRide(ride)}
                      className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200 shadow-sm active:scale-95"
                    >
                      View Active Ride
                    </button>
                  )}

                  {ride.status === "completed" && (
                    <div className="flex gap-2">
                      {ride.distance && ride.duration && (
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Distance</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {(ride.distance / 1000).toFixed(1)} km
                            </p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {(ride.duration / 60).toFixed(1)} min
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRideHistory;
