import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        // required: true,
        minlength: [3, "First name must be at least 3 characters long"],
      },
      lastname: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters long"],
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    socketId: {
      type: String,
    },

    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.Generatingaccesstoken = function () {
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

userSchema.methods.Generatingrefershtoken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.refreshtoken,
    { expiresIn: process.env.refreshtime }
  );
};

const User = mongoose.model("User", userSchema);

export { User };
