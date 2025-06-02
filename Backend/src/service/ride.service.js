import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Ride } from "../model/ride.model.js";
import { get_distance_time } from "../service/map.service.js";
import crypto from "crypto";

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

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fare = {
    auto:
      Math.round(
        (baseFare.auto +
          (distance / 1000) * perKmRate.auto +
          (time / 60) * perMinuteRate.auto) *
          100
      ) / 100,
    car:
      Math.round(
        (baseFare.car +
          (distance / 1000) * perKmRate.car +
          (time / 60) * perMinuteRate.car) *
          100
      ) / 100,
    moto:
      Math.round(
        (baseFare.moto +
          (distance / 1000) * perKmRate.moto +
          (time / 60) * perMinuteRate.moto) *
          100
      ) / 100,
  };

  return fare;
};

const createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new ApiError(
      400,
      "user,pickup,destination and vehicleType are required"
    );
  }

  const fare = await getFare(pickup, destination);

  if (!fare) {
    throw new ApiError(400, "Unable to fetch fare");
  }

  const ride = Ride.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  if (!ride) {
    throw new ApiError(400, "Unable to create ride");
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
    throw new Error("Ride id is required");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

const startride = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

const endride = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  return ride;
};
export { createRide, getFare, confirmride, startride, endride };
