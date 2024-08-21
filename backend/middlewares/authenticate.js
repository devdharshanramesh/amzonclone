const ErrorHandler = require("../utils/errorhandler");
const user =require('../models/usermodel')
const catchasyncerror = require("./catchasyncerror");
const jwt =require('jsonwebtoken');

exports.isauthenticateuser =catchasyncerror(async (req,res,next)=>{
    const{token} = req.cookies;

    if(!token){
        return next(new ErrorHandler('login first to handle this resource',401))
    }
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user =await user.findById(decoded.id)
    next();

})

exports.authorizeroles = (...roles) =>{
    return  (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed `,401))
        }
        next();
    }
}