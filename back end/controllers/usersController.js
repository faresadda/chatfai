const User=require('../models/userModel')
const appError=require('../utils/appError')
const asyncHandler=require('express-async-handler')
const {validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken');
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')
const appData=require('../utils/appData')

const getUser = asyncHandler(async (req,res)=>{
    const id=req.params.id;
    const user = await User.findById(id)
    if(!user){return res.status(404).json(appError.createError(404,'this id is not found'))}
    res.status(200).json(appData.createData('user data fetched successfully',user))
})

const registre = asyncHandler(async (req,res)=>{
    const {name,email,password}=req.body

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json([{status:'fail',msg:'Email already registered',code:400}]);
    }

    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(401).json(errors.array())}

    // hash password
    const hash=await bcrypt.hash(password,10)

    // create verification code
    const verificationCode = crypto.randomInt(10000, 99999);
    await sendEmail({email:email,subject:'verification code',message:`Your account verification code is ${verificationCode}`})

    const newUser = new User({
        name,
        email,
        password:hash,
        isVerified: false,
        verificationCode})

    // create token
    const token = createToken({id:newUser._id})
    newUser.token=token
    await newUser.save()
    const user = await User.findOne({email:email},{_id:1})
    res.status(200).json(appData.createData('registre successfully',user))
})

// verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const code = req.body.code
    const user = await User.findById(req.params.id);


    if (user.verificationCode != code) {
      return res.status(400).json({ message: 'Invalid code' });
    }
  
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
  
    res.status(200).json(appData.createData('email verified successfully',user));
  });
  
const login = asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user = await User.findOne({email:email})
    if(!user){return res.status(404).json(appError.createError(404,'user not found'))}
    const verifyPassword = await bcrypt.compare(password,user.password)
    if(verifyPassword){
        const token=createToken({id:user._id})
        const update = await User.findByIdAndUpdate(user._id,{$set:{token:token}},{ new: true })
        const userVerify = await User.findOne({email:email},{isVerified:1})
        res.status(200).json(appData.createData('login successfully', update.isVerified ? update : userVerify))
    }
    else{res.status(400).json(appError.createError(400,'password is wrong'))}
})


// change password
const updatePassword = asyncHandler(async (req,res)=>{
    const {oldpassword,password}=req.body;
    const id=req.params.id;
    const user = await User.findById(id)

    const verifyPassword = await bcrypt.compare(oldpassword, user.password);
    if(verifyPassword){
        const errors=validationResult(req)
        if(!errors.isEmpty()){return res.status(401).json(errors.array())}
        const hash=await bcrypt.hash(password,10)
        const token=createToken({id:user._id})
        const update = await User.findByIdAndUpdate(user._id,{$set:{password:hash,token:token}},{ new: true })
        res.status(200).json(appData.createData('password updated successfully',update))
    }
    else{res.status(400).json([{status:'fail',msg:'password is wrong',code:400}])}
})

// update profile
const updateUser = asyncHandler(async (req,res)=>{
    const id=req.params.id
    const user = await User.findByIdAndUpdate(id,{$set:{...req.body}})
    if(!user){return res.status(404).json(appError.createError(404,'this id is not found'))}
    res.status(200).json(appData.createData('update successfully',user))
})

const deleteUser = asyncHandler(async (req,res)=>{
    const id=req.params.id
    const user = await User.findByIdAndDelete(id)
    if(!user){return res.status(400).json(appError.createError(404,'this id is not found'))}
    res.status(200).json(appData.createData('user deleted successfully',null))
})

// send verification code
const accountRecovery = asyncHandler(async (req,res)=>{
    const email=req.body.email
    var user = await User.findOne({email:email})
    if(!user){
        return res.status(404).json(appError.createError(404,'user not found'))
    }
    const verificationCode = crypto.randomInt(10000, 99999);
    user = await User.findOneAndUpdate({email:email},{$set:{verificationCode:verificationCode}},{ new: true })
    await sendEmail({email:email,subject:'verification code',message:`Your account verification code is ${verificationCode}`})
    user = await User.findOne({email:email},{_id:1})
    res.status(200).json(appData.createData('verification code sent successfully',user))
})

// new password
const newPassword = asyncHandler(async(req,res)=>{
    const password=req.body.password;
    const id=req.params.id
    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(401).json(errors.array())}
    const hash = await bcrypt.hash(password,10)
    const update = await User.findByIdAndUpdate(id,{$set:{password:hash}},{new:true})
    res.status(200).json(appData.createData('password updated successfully',null))
})

const resendCode = asyncHandler ( async (req,res)=>{
    const id=req.params.id
    const verificationCode=crypto.randomInt(10000,99999)
    const update = await User.findByIdAndUpdate(id,{$set:{verificationCode:verificationCode}},{new:true})
    await sendEmail({email:update.email,subject:'verification code',message:`Your account verification code is ${verificationCode}`})
    res.status(200).json(appData.createData('verification code sent successfully',null))
})

module.exports = {
    registre,
    login,
    updateUser,
    deleteUser,
    getUser,
    updatePassword,
    verifyEmail,
    accountRecovery,
    newPassword,
    resendCode,
}
