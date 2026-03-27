import { ApiError } from "../utils/apiError.js";
import { Ride } from "../model/ride.model.js";
import { get_distance_time, CloseRide } from "../service/map.service.js";
import crypto from "crypto";
import { sendMessageToSocketId } from "../socket.js";
import axios from "axios";

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new ApiError(400, "pickup and destination are required");
  }

  const distancetime = await get_distance_time(pickup, destination);

  if (!distancetime) {
    throw new ApiError(400, "Unable to fetch distance and time");
  }

  const distance = distancetime.distance;
  const time = distancetime.time;

  try {
    const response = await axios.post(`${process.env.Model_link}/predict`, {
      distance: distance,
      time: time,
    });

    if (!response.data || !response.data.success || !response.data.fares) {
      throw new ApiError(500, "Invalid response from ML model");
    }

    const fare = response.data.fares;

    console.log("ML Predicted Fares:", fare);

    return fare;
  } catch (error) {
    console.error("ML API Error:", error.message);

    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    const fare = {
      auto:
        Math.round(
          (baseFare.auto +
            (distance / 1000) * perKmRate.auto +
            (time / 60) * perMinuteRate.auto) *
            100,
        ) / 100,
      car:
        Math.round(
          (baseFare.car +
            (distance / 1000) * perKmRate.car +
            (time / 60) * perMinuteRate.car) *
            100,
        ) / 100,
      moto:
        Math.round(
          (baseFare.moto +
            (distance / 1000) * perKmRate.moto +
            (time / 60) * perMinuteRate.moto) *
            100,
        ) / 100,
    };

    console.log("Using Fallback Formula:", fare);
    return fare;
  }
};

const data_for_history = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new ApiError(400, "pickup and destination are required");
  }

  const distancetime = await get_distance_time(pickup, destination);

  if (!distancetime) {
    throw new ApiError(400, "Unable to fetch distance and time");
  }

  const distance = distancetime.distance;
  const time = distancetime.time;

  return { distance, time };
};

const createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new ApiError(
      400,
      "user,pickup,destination and vehicleType are required",
    );
  }

  const fare = await getFare(pickup, destination);
  const { distance, time } = await get_distance_time(pickup, destination);

  if (!fare) {
    throw new ApiError(502, "Unable to fetch fare from ML model");
  }

  const ride = await Ride.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
    duration: time,
    distance: distance,
  });

  if (!ride) {
    throw new ApiError(500, "Unable to create ride. Please try again");
  }

  return ride;
};

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

const confirmride = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new ApiError(400, "Ride ID is required");
  }

  const ride = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      status: "pending",
    },
    {
      status: "accepted",
      captain: captain._id,
    },
    {
      new: true,
    },
  )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  const captains = await CloseRide(rideId);

  if (captains && captains.length > 0) {
    for (const otherCaptain of captains) {
      if (captain._id.toString() !== otherCaptain._id.toString()) {
        if (otherCaptain.socketId) {
          sendMessageToSocketId(otherCaptain.socketId, {
            event: "ride-already-confirmed",
            data: ride,
          });
        }
      }
    }
  }

  return ride;
};

const startride = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new ApiError(400, "Ride ID and OTP are required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new ApiError(400, "Ride has not been accepted yet");
  }

  if (ride.otp !== otp) {
    throw new ApiError(400, "Invalid OTP. Please try again");
  }

  const updatedRide = await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    },
    { new: true },
  )
    .populate("user")
    .populate("captain");

  return updatedRide;
};

const endride = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new ApiError(400, "Ride ID is required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new ApiError(400, "Ride is not ongoing");
  }

  const updatedRide = await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    },
    { new: true },
  )
    .populate("user")
    .populate("captain");

  return updatedRide;
};

export {
  createRide,
  getFare,
  confirmride,
  startride,
  endride,
  data_for_history,
};
