import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainschema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
      },
      lastname: {
        type: String,
        required: true,
        minlength: [3, "Last name must be at least 3 characters long"],
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Enter Valid Email",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    socketId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, "Color must be at least 3 characters long"],
      },
      plate: {
        type: String,
        required: true,
        minlength: [3, "Plate must be at least 3 characters long"],
      },
      capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"],
      },
      vehicletype: {
        type: String,
        required: true,
        enum: ["car", "auto", "motorcycle"],
      },
    },

    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

captainschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

captainschema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainschema.methods.Generatingaccesstoken = function () {
  return jwt.sign(
    {
      _id: this.id,
      password: this.password,
      fullname: this.fullname,
    },
    process.env.accesstoken,
    { expiresIn: process.env.accesstime }
  );
};

captainschema.methods.Generatingrefershtoken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.refreshtoken,
    { expiresIn: process.env.refreshtime }
  );
};

const Captain = mongoose.model("Captain", captainschema);

export { Captain };
