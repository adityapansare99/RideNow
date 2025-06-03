import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  createRide,
  getFare,
  confirmride,
  startride,
  endride,
} from "../service/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptaininTheRadius,
} from "../service/map.service.js";
import { sendMessageToSocketId } from "../socket.js";
import { Ride } from "../model/ride.model.js";

const createride = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const user = req.user;

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await createRide({
      user: user._id,
      pickup,
      destination,
      vehicleType,
    });
    res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride created successfully"));

    const pickupCoordinate = await getAddressCoordinate(pickup);
    const captainsInRadius = await getCaptaininTheRadius(
      pickupCoordinate.ltd,
      pickupCoordinate.lng,
      5
    );

    ride.otp = "";

    const rideWithUser = await Ride.findOne({ _id: ride._id }).populate("user");

    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (err) {
    res.status(400).json(new ApiResponse(400, err, "Unable to create ride"));
  }
});

const farevalue = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await getFare(pickup, destination);

    res
      .status(200)
      .json(new ApiResponse(200, fare, "Fare fetched successfully"));
  } catch (err) {
    res.status(400).json(new ApiResponse(400, err, "Unable to fetch fare"));
  }
});

const confirmRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { rideId } = req.body;

  try {
    const ride = await confirmride({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride confirmed successfully"));
  } catch (err) {
    res.status(400).json(new ApiResponse(400, err, "Unable to confirm ride"));
  }
});

const startRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await startride({ rideId, otp, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride started successfully"));
  } catch (err) {
    res.status(400).json(new ApiResponse(400, err, "Unable to start ride"));
  }
});

const endRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { rideId } = req.body;

  try {
    const ride = await endride({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride ended successfully"));
  } catch (err) {
    return res
      .status(400)
      .json(new ApiResponse(400, err, "Unable to end ride"));
  }
});

export { createride, farevalue, confirmRide, startRide, endRide };
