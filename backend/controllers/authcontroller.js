const catchasyncerror = require("../middlewares/catchasyncerror");

const User = require("../models/usermodel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorhandler");
const sendtoken = require("../utils/jwt");
const crypto =require('crypto');


//registeruser:/api/register
exports.registeruser = catchasyncerror(async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;


        const user = await User.create({
            name,
            email,
            password,
            avatar,
        });

        sendtoken(user,201,res);
        
    } catch (err) {
        console.error('Error during registration:', err); // Log the error
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
});

//loginuser:api/ login
exports.loginUser = catchasyncerror(async (req, res, next) => {
    const {email, password} =  req.body
    

    if (!email.trim() || !password.trim()) {
       
        return next(new ErrorHandler('Please enter both email and password', 400));
    }

  
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    
    if(!await user.isvalidpassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendtoken(user, 201, res)
    
})


///logout -api/logout
exports.logoutuser =(req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly :true
    })
    .status(200)
    .json({
        success:true,
        message:'logout successfully'
    })
}

//forgotpassword - api/forget
exports.forgotpassword =catchasyncerror(async(req,res,next)=>{

     const user =await User.findOne({email:req.body.email})
    
     if(!user){
        return next(new ErrorHandler('user not found with this email',404))
     }

     const resettoken = user.getresettoken();
     await user.save({validateBeforeSave : false})
    

     const reseturl =`${req.protocol}://${req.get('host')}/api/password/reset/${resettoken}`

     const message =`your password reset url is as follow \n\n
     ${reseturl}\n\n if you have not requested this email,then ignore it`

     try{
        sendEmail({
            email:user.email,
            subject:"amzon password recovery ",
            message
        })
        res.status(200).json({
            success:true,
            message:`email sent to ${user.email}`
        })

     }catch(error){
        user.resetPasswordToken =undefined;
        user.resetPasswordTokenExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message),500)
     }
     

})

//reset password -/api/password/reset/:token
exports.resetpassword = catchasyncerror(async(req,res,next)=>{
    const hashedtoken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken:hashedtoken,
        resetPasswordTokenExpire:{
            $gt:Date.now()
        }
    })
    if(!user){
        return next(new ErrorHandler('passsord reset token is expired',400))
    }

    if(req.body.password !==req.body.confirmpassword){
        return next( new ErrorHandler('password doesnot matches',400))
    }

    user.password =req.body.password;
    user.resetPasswordToken =undefined;
    user.resetPasswordTokenExpire =undefined;
    await user.save({validateBeforeSave:false})

    sendtoken(user,201,res);

})

//get user profile -api/myprofile
exports.getuserprofile =catchasyncerror(async(req,res,next)=>{
 const user =await  User.findById(req.user.id)
 res.status(200).json({
    success:true,
    user
 })
})

//changepassword -api/password/change

exports.changepassword =catchasyncerror(async(req,res,next)=>{
    const user =await User.findById(req.user.id).select('+password')

    //check old password
    
    if (! await user.isvalidpassword(req.body.oldpassword)){
        return next(new ErrorHandler('old password is incorrect',401))
    }
    
    //assign new passowrd

    user.password =req.body.password;
    await user.save();
    res.status(200).json({
        success : true
    })

})

//updateprofile -

exports.updateprofile =catchasyncerror(async(req,res,next)=>{
    const newuserdata = {
        name: req.body.name,
        email:req.body.email
    }

   const user = await  User.findByIdAndUpdate(req.user.id,newuserdata,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        sucess:true,
        user
    })
})

//admin:getallusers

exports.getallusers = catchasyncerror(async(req,res,next)=>{
    const users =await User.find();
    res.status(200).json({
        sucess:true,
        users
    })
})

//admin:get specific user

exports.getuser =catchasyncerror(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('user not found with this id',404))
    }
    res.status(200).json({
        sucess:true,
        user
    })
})

//admin:update specific user

exports.updateuser =catchasyncerror(async(req,res,next)=>{
    const newuserdata = {
        name: req.body.name,
        email:req.body.email,
        role:req.body.role
    }

   const user = await  User.findByIdAndUpdate(req.user.id,newuserdata,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        sucess:true,
        user
    })

})

//admin:delete user

exports.deleteuser =catchasyncerror(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('user not found with this id ',404))
    }
    await  user.deleteOne();
    res.status(200).json({
        success:true,
    })
})