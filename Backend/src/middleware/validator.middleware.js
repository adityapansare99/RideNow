import { body, validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

const ValidationRules = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
];

const validatorresult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  next();
};

const uservalidation = [...ValidationRules, validatorresult];

const ValidationError = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginvalidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  next();
};

const loginvalidationresult = [...ValidationError, loginvalidation];

const validationRulesforcaptain = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("vehicle.color")
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters long"),
  body("vehicle.plate")
    .isLength({ min: 3 })
    .withMessage("Plate must be at least 3 characters long"),
  body("vehicle.capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),
  body("vehicle.vehicletype")
    .isIn(["car", "auto", "motorcycle"])
    .withMessage("Vehicle type must be car, auto or motorcycle"),
];

const validatorresultcaptain = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  next();
};

const captainvalidation = [
  ...validationRulesforcaptain,
  validatorresultcaptain,
];

const caploginrule = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const caplogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), "Validation Error"));
  }

  next();
};

const caploginresult = [...caploginrule, caplogin];

export {
  uservalidation,
  loginvalidationresult,
  captainvalidation,
  caploginresult,
};
