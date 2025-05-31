import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { createRide, getFare} from "../service/ride.service.js";
import { validationResult } from "express-validator";


const createride=asynchandler(async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
    }

    const user=req.user;

    const {pickup,destination,vehicleType}=req.body;

    try{
        const ride=await createRide({user:user._id,pickup,destination,vehicleType});

        res.status(200).json(new ApiResponse(200,ride,"Ride created successfully"));
    }

    catch(err){
        res.status(400).json(new ApiResponse(400,err,"Unable to create ride"));
    }

})

const farevalue=asynchandler(async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json(new ApiResponse(400,errors.array(),"Validation Error"));
    }    

    const {pickup,destination}=req.query;

    try{
        const fare=await getFare(pickup,destination);

        res.status(200).json(new ApiResponse(200,fare,"Fare fetched successfully"));
    }

    catch(err){
        res.status(400).json(new ApiResponse(400,err,"Unable to fetch fare"));
    }

})


export {createride, farevalue}