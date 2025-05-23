import { body, validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

//Register route for user
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
    res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
  }

  next();
};

//... are used to unpack the array of rules
const uservalidation = [...ValidationRules, validatorresult];

//login route validation for user 
const ValidationError = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginvalidation=(req,res,next)=>{
  const errors=validationResult(req);

  if(!errors.isEmpty()){
    res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
  }

  next();
}

const loginvalidationresult=[...ValidationError,loginvalidation];


//middle ware for the captain route
//register
const validationRulesforcaptain = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("vechile.color").isLength({min:3}).withMessage("Color must be at least 3 characters long"), 
  body("vechile.plate").isLength({min:3}).withMessage("Plate must be at least 3 characters long"),
  body("vechile.capacity").isInt({min:1}).withMessage("Capacity must be at least 1"),
  body("vechile.vechiletype").isIn({
    values: ["car", "auto", "motorcycle"],
  }).withMessage("Vechile type must be car, auto or motorcycle"),
];

const validatorresultcaptain = (req, res, next) => {
  const errors = validationRulesforcaptain(req);

  if (!errors.isEmpty()) {
    res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
  }

  next();
};

const captainvalidation = [...validationRulesforcaptain, validatorresultcaptain];

const caploginrule = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const caplogin=(req,res,next)=>{
  const errors=validationResult(req);

  if(!errors.isEmpty()){
    res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
  }

  next();
}

const caploginresult=[...caploginrule,caplogin];


export { uservalidation, loginvalidationresult, captainvalidation, caploginresult };
