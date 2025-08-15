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

    profilepic: {
      type: String,
      default:"data:image/webp;base64,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",
    }
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
