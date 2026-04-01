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

const createride = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const user = req.user;

  const { pickup, destination, vehicleType } = req.body;

  const ride = await createRide(
    {
      user: user._id,
      pickup,
      destination,
      vehicleType,
    },
    {
      new: true,
    },
  );

  const RideId = await Ride.findById(ride._id);

  const pickupCoordinate = await getAddressCoordinate(pickup);
  if (!pickupCoordinate) {
    throw new ApiError(
      404,
      "Unable to find coordinates for the pickup location",
    );
  }

  const captainsInRadius = await getCaptaininTheRadius(
    pickupCoordinate.ltd,
    pickupCoordinate.lng,
    100,
    vehicleType,
    RideId._id,
  );

  ride.otp = "";

  const rideWithUser = await Ride.findOne({ _id: ride._id }).populate("user");

  captainsInRadius.forEach((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: "new-ride",
      data: rideWithUser,
    });
  });

  res.status(201).json(new ApiResponse(201, ride, "Ride created successfully"));
});

const farevalue = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { pickup, destination } = req.query;

  const fare = await getFare(pickup, destination);

  if (!fare) {
    throw new ApiError(404, "Unable to calculate fare for the given route");
  }

  res.status(200).json(new ApiResponse(200, fare, "Fare fetched successfully"));
});

const confirmRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { rideId } = req.body;

  const ride = await confirmride({ rideId, captain: req.captain });

  if (!ride) {
    throw new ApiError(500, "Unable to confirm ride. Please try again");
  }

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-confirmed",
    data: ride,
  });

  res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride confirmed successfully"));
});

const startRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { rideId, otp } = req.query;

  const ride_data = await Ride.findById(rideId);

  if (!ride_data) {
    throw new ApiError(404, "Ride not found");
  }

  const ride = await startride({ rideId, otp, captain: req.captain });

  if (!ride) {
    throw new ApiError(500, "Unable to start ride. Please try again");
  }

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: ride,
  });

  res.status(200).json(new ApiResponse(200, ride, "Ride started successfully"));
});

const endRide = asynchandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { rideId } = req.body;
  const ride_data = await Ride.findById(rideId);

  if (!ride_data) {
    throw new ApiError(404, "Ride not found");
  }

  const ride = await endride({ rideId, captain: req.captain });

  if (!ride) {
    throw new ApiError(500, "Unable to end ride. Please try again");
  }

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-ended",
    data: ride,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride ended successfully"));
});

const razorpayinstance = new razorpay({
  key_id: process.env.RazorPayKey,
  key_secret: process.env.RazorPaySecretKey,
});

const makepayment = asynchandler(async (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    throw new ApiError(400, "Ride ID is required");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  const options = {
    amount: Math.round(ride.fare * 100),
    currency: process.env.Currency,
    receipt: rideId,
  };

  const paymentresponse = await razorpayinstance.orders.create(options);

  if (!paymentresponse) {
    throw new ApiError(502, "Payment gateway error. Please try again later");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paymentresponse,
        "Payment order created successfully",
      ),
    );
});

const verifypayment = asynchandler(async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    throw new ApiError(400, "Order ID is required");
  }

  const data = await razorpayinstance.orders.fetch(order_id);

  if (!data) {
    throw new ApiError(404, "Payment order not found");
  }

  if (data.status !== "paid") {
    throw new ApiError(402, "Payment not completed. Please try again");
  }

  await Ride.findByIdAndUpdate(data.receipt, {
    paymentID: data.receipt,
    paymentStatus: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Payment verified successfully"));
});

const cancelRide = asynchandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    throw new ApiError(400, "Ride ID is required");
  }

  const ride = await Ride.findById(rideId).populate("user");
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  const response = await Ride.findByIdAndUpdate(rideId, {
    status: "cancelled",
  });

  if (!response) {
    throw new ApiError(500, "Unable to cancel ride. Please try again");
  }

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-cancelled",
    data: ride,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Ride cancelled successfully"));
});

const RideRating = asynchandler(async (req, res) => {
  const { rideId, rating } = req.body;

  if (!rideId || !rating) {
    throw new ApiError(400, "Ride ID and rating are required");
  }

  const ride = await Ride.findByIdAndUpdate(
    rideId,
    {
      rating: rating,
      isRated: true,
      rateTime: Date.now(),
    },
    { new: true },
  );

  if (!ride) {
    throw new ApiError(500, "Unable to submit rating. Please try again");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Rating submitted successfully"));
});

const rideStatus = asynchandler(async (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    throw new ApiError(400, "Ride ID is required");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, ride.status, "Ride status fetched successfully"));
})

export {
  createride,
  farevalue,
  confirmRide,
  startRide,
  endRide,
  makepayment,
  verifypayment,
  cancelRide,
  RideRating,
  rideStatus
};
