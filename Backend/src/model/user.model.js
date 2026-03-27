import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
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

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    image:{
      type:String,
      default:"data:image/webp;base64,UklGRlADAABXRUJQVlA4IEQDAABwJACdASrnAOoAPp1OoEylpKMiJlKYaLATiWlu/HyYMudUxf6jvIWLbQfsvlbRIuRkqWHpu/Z/Mb5wP66oiyt0a6oiyt0a6oiyt0Va15xCADHl5wdyRj2VvIwYvUv+HqK8iS7ZlVV6GL082NdT+YUrsu9SKi7aXW6g49gmemcIuESnenVzYJ5orBx0HEwHpTv2kc8n+TwHXXFzN8bzjhNBG41IcbxkdHpX+ywGJw1JTtMAUNKW0cX2LLOhgIWc4ybEDnOwpnSBnUYMfAyiPWBqMtz6jHt3n+czWQpV6uJcGB8tbgkhpxC9bH3gPUS4CISEH/qTXKRq7QixUy90/bhVq3RqgUArdNlye/Gdi1z8G9sgPZx0a6oiyt0a6oiyt0a6oiyt0a6oiyt0VAAA/v1hgAAE9v1Nxc3zrPv1P3rD6vZBpx7lM/kdslOh8nAw1HjU/eXLM7EJ6lnXM5kFfpY72+fXRsgt1Fk50VSiWtjj4X7Cp5nLMIjn87+R6jby2r0oJeHD/HbHowTjqGxjTwUyTZzRBtTF4GMGGBV9opaUWnq681ION0bZYjggJ7twiRgSJ/+dE6FKoJqleXODh6yPhpOQGVE7+m7POSTdSROKFBorP9sZE5Aqz7R/tGdIujdh1f0sPaZGyLY3yIrAxZbU0ZOrUerupjN/zELfg4P+HR2AP38qeOIijaT15n0LnVXAnJZ4h3IP6S7pKOyeNWQ2OUb/wkDhrfTOGgRRMhpsFIFWaz45KmArd7Lr7hRuy5qhTlJ57mBn5c7BHCR/GME4I+fvIzYUZHTFQGyziRxX/v5M9ZuJtfHnaCPSvyQvbBzgViDrR16KstwYlNQoGyNDMlnAXqy6mDq3Id/vuBwKPwFGDSwmvjH6Tuu3E5hRTLLDc2YiPyalhH8ZEMS8/sS/3n4YwRCYKgibY7P5ksfqNXq7Eh7qjDUauIivNReoT0JaYHJikO4kKwMcacWCgLocgpFglFIMD/bzoH5cU47yO9Pt2hs1IRofG1cOQQvED8RYXBFel3xQrlkzi0g3MgzhwWYGWXSXnbBXyUk49AbR7Qmgjor0m78IE6i4N8txyQEseQM3EMa5DZGKASLiTLAAAAAAAA==",
    }
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
      email: this.email,
      fullname: this.fullname,
    },
    process.env.accesstoken,
    { expiresIn: process.env.accesstime }
  );
};

userSchema.methods.Generatingrefershtoken = function () {
  return jwt.sign(
    {
      email: this.email,
    },
    process.env.refreshtoken,
    { expiresIn: process.env.refreshtime }
  );
};

const User = mongoose.model("User", userSchema);

export { User };
