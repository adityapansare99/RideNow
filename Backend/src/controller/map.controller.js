import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  getAddressCoordinate,
  get_distance_time,
  autosuggestion,
} from "../service/map.service.js";
import { validationResult } from "express-validator";

const getcoordinates = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }
  const { address } = req.query;

  try {
    const coordinates = await getAddressCoordinate(address);

    if (!coordinates) {
      throw new ApiError(400, "Unable to fetch coordinates");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, coordinates, "Coordinates fetched successfully")
      );
  } catch (err) {
    res
      .status(400)
      .json(new ApiResponse(400, err, "Unable to fetch coordinates"));
  }
});

const getdistancetime = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { origin, destination } = req.query;

  try {
    const response = await get_distance_time(origin, destination);

    res
      .status(200)
      .json(
        new ApiResponse(200, response, "Distance and time fetched successfully")
      );
  } catch (err) {
    res
      .status(400)
      .json(new ApiResponse(400, err, "Unable to fetch distance and time"));
  }
});

const autocompletesuggestions = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  const { input } = req.query;

  if (!input) {
    throw new ApiError(400, "query is required");
  }

  try {
    const response = await autosuggestion(input);

    res
      .status(200)
      .json(new ApiResponse(200, response, "Suggestions fetched successfully"));
  } catch (err) {
    res
      .status(400)
      .json(new ApiResponse(400, err, "Unable to fetch suggestions"));
  }
});

export { getcoordinates, getdistancetime, autocompletesuggestions };
