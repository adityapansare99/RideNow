import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import axios, { Axios } from "axios";
import { Captain } from "../model/captain.model.js";

const getAddressCoordinate = async (address) => {
  if (!address) {
    throw new ApiError(400, "address is required");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new ApiError(400, "Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to fetch coordinates");
  }
};

const get_distance_time = async (origin, destination) => {
  if (!origin || !destination) {
    throw new ApiError(400, "origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (
        !response.data.rows[0].elements[0].distance ||
        !response.data.rows[0].elements[0].duration
      ) {
        throw new ApiError(400, "Unable to fetch distance and time");
      }

      const distance = response.data.rows[0].elements[0].distance.value;
      const time = response.data.rows[0].elements[0].duration.value;
      return {
        distance,
        time,
      };
    } else {
      throw new ApiError(400, "Unable to fetch distance and time");
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to fetch distance and time");
  }
};

const autosuggestion = async (input) => {
  if (!input) {
    throw new ApiError(400, "query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions;
    } else {
      throw new ApiError(400, "Unable to fetch suggestions");
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to fetch suggestions");
  }
};

const getCaptaininTheRadius = async (ltd, lng, radius) => {
  const captains = await Captain.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
};

export {
  getAddressCoordinate,
  get_distance_time,
  autosuggestion,
  getCaptaininTheRadius,
};
