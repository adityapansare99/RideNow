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
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { address } = req.query;

  const coordinates = await getAddressCoordinate(address);

  if (!coordinates) {
    throw new ApiError(404, "No coordinates found for the given address");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, coordinates, "Coordinates fetched successfully"),
    );
});

const getdistancetime = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { origin, destination } = req.query;

  const response = await get_distance_time(origin, destination);

  if (!response) {
    throw new ApiError(
      404,
      "Unable to fetch distance and time for the given route",
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Distance and time fetched successfully"),
    );
});

const autocompletesuggestions = asynchandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { input } = req.query;

  if (!input) {
    throw new ApiError(400, "Search input is required");
  }

  const response = await autosuggestion(input);

  if (!response) {
    throw new ApiError(404, "No suggestions found for the given input");
  }

  res
    .status(200)
    .json(new ApiResponse(200, response, "Suggestions fetched successfully"));
});

export { getcoordinates, getdistancetime, autocompletesuggestions };
