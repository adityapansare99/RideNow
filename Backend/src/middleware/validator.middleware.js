import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//Register route
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

export { uservalidation, loginvalidationresult };
