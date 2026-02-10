import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  createRide,
  getFare,
  confirmride,
  startride,
  endride,
  data_for_history,
} from "../service/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptaininTheRadius,
} from "../service/map.service.js";
import { sendMessageToSocketId } from "../socket.js";
import { Ride } from "../model/ride.model.js";
import razorpay from "razorpay";
import Histroy from "../model/captainHistroy.model.js";

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
      100,
      vehicleType,
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

  const ride_data = await Ride.findById(rideId);

  if (!ride_data) {
    return res.status(400).json(new ApiResponse(400, err, "Ride not found"));
  }

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
  const ride_data = await Ride.findById(rideId);

  const hist = await Histroy.updateOne(
    { captain_id: ride_data.captain },
    {
      $push: {
        dist: ride_data.distance / 1000,
        time: ride_data.duration / 3600,
        earning: ride_data.fare,
      },
    },
    { upsert: true },
  );

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

const razorpayinstance = new razorpay({
  key_id: process.env.RazorPayKey,
  key_secret: process.env.RazorPaySecretKey,
});

const makepayment = asynchandler(async (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    throw new ApiError(400, "Ride id is required");
  }

  try {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw new ApiError(400, "Ride not found");
    }

    const options = {
      amount: Math.round(ride.fare * 100),
      currency: process.env.Currency,
      receipt: rideId,
    };

    const paymentresponse = await razorpayinstance.orders.create(options);

    return res
      .status(200)
      .json(new ApiResponse(200, paymentresponse, "Payment successful"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Payment failed! Please try again"));
  }
});

const verifypayment = asynchandler(async (req, res) => {
  try {
    const { order_id } = req.body;

    const data = await razorpayinstance.orders.fetch(order_id);

    if (!data) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Payment failed! Please try again"));
    }

    if (data.status === "paid") {
      await Ride.findByIdAndUpdate(data.receipt, {
        paymentID: data.receipt,
        paymentStatus: true,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, data, "Payment successful"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Payment failed! Please try again"));
  }
});

const cancelRide = asynchandler(async (req, res) => {
  try {
    const { rideId } = req.body;
    if (!rideId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Ride id is required"));
    }

    const ride = await Ride.findById(rideId).populate("user");
    if (!ride) {
      return res.status(400).json(new ApiResponse(400, null, "Ride not found"));
    }

    const response = await Ride.findByIdAndUpdate(rideId, {
      status: "cancelled",
    });

    if (!response) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Unable to cancel ride"));
    }

    console.log("ride cancelled");
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-cancelled",
      data: ride,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Ride cancelled successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, "Unable to cancel ride"));
  }
});

export {
  createride,
  farevalue,
  confirmRide,
  startRide,
  endRide,
  makepayment,
  verifypayment,
  cancelRide,
};
