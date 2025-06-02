import mongoose from "mongoose";

const rideschema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },

    pickup: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
      default: "pending",
    },

    duration: {
      type: Number,
    },

    distance: {
      type: Number,
    },

    paymentID: {
      type: String,
    },

    orderID: {
      type: String,
    },

    signature: {
      type: String,
    },

    otp: {
      type: String,
      select: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideschema);

export { Ride };
