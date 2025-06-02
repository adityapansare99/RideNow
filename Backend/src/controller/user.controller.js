import { User } from "../model/user.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const registeruser = asynchandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if ([firstname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, "User not created");
  }

  const userId = await User.findById(user._id);

  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User created successfully"));
});

const Generatingaccessandrefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json(new ApiResponse(404, null, "User not found"));
      return null;
    }
    const refreshtoken = user.Generatingrefershtoken();
    const accesstoken = user.Generatingaccesstoken();

    user.refreshtoken = refreshtoken;

    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (err) {
    throw new ApiError(404, "NOT able to generate the tokens");
  }
};

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    [email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(404, "field is empty");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(500, "password is wrong");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    user._id
  );

  const loggeduser = await User.findOne(user._id).select(
    "-password -refershtoken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggeduser, accesstoken, refreshtoken },
        "successfully logged in"
      )
    );
});

const refreshaccesstoken = asynchandler(async (req, res) => {
  const serversidetoken = req.cookies.refreshtoken || req.body.refreshtoken;
  if (!serversidetoken) {
    throw new ApiError(500, "token not found to server");
  }

  try {
    const decodetoken = jwt.verify(serversidetoken, process.env.refreshtoken);

    const user = await User.findById(decodetoken?._id);
    if (!user) {
      throw new ApiError(500, "user not found");
    }
    if (serversidetoken !== user.refreshtoken) {
      throw new ApiError(500, "not same token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accesstoken, refershtoken: newrefreshtoken } =
      await generateaccesstokenandrefreshtoken(user._id);

    return res
      .status(200)
      .cookie("accesstoken", accesstoken, options)
      .cookie("refreshtoken", newrefreshtoken, options)
      .json(
        new ApiResponse(
          200,
          {
            accesstoken,
            refreshatoken: newrefreshtoken,
          },
          "access token successful"
        )
      );
  } catch (error) {
    throw new ApiError(500, "fail to decode");
  }
});

const logout = asynchandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refereshtoken", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

const profile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshtoken"
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  res.status(200).json(new ApiResponse(200, { user }, "User profile"));
});

export { registeruser, userLogin, refreshaccesstoken, logout, profile };
