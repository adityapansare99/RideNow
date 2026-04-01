import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const RideRating = ({ ride, onRatingSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captainRating, setCaptainRating] = useState(null);

  const fetchCaptainRating = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/captain-rating`,
        {
          captainId: ride.captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setCaptainRating(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch captain rating:", error);
    }
  };

  useEffect(() => {
    fetchCaptainRating();
  }, []);

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating) {
      toast.warning("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rate`,
        {
          rideId: ride._id,
          rating: selectedRating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Rating submitted successfully");
        onRatingSubmitted();
      }
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Rate your driver
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Your feedback helps maintain service quality
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleStarClick(rating)}
                  className="text-3xl transition-all duration-200 hover:scale-125"
                  style={{
                    color:
                      selectedRating && rating <= selectedRating
                        ? "#FCD34D"
                        : "#D1D5DB",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600 min-w-20 pr-2 mr-2 text-right">
              {selectedRating ? ratingLabels[selectedRating] : "Not rated"}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmitRating}
          disabled={!selectedRating || loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedRating && !loading
              ? "bg-black text-white hover:bg-gray-900 active:scale-95"
              : "bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </div>

      <div className="h-px bg-gray-200"></div>

      <div className="px-5 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-600">Driver rating</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {ride.captainAverageRating?.avgRating ||
                captainRating?.avgRating ||
                "0.0"}
            </span>
            <span className="text-lg text-yellow-400">★</span>
            <span className="text-xs text-gray-500">
              ({ride.captainAverageRating?.count || captainRating?.count || "0"}{" "}
              rides)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRating;
