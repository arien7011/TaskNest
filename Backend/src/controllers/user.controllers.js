import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  removeFileFromCloudinary,
} from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (
    [userName, fullName, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(401, "All Fields are Required");
  }

  const isExistingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (isExistingUser) {
    throw new ApiError(401, "User Already Exists");
  }

  const avatarLocalPath = req.file;
  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar is Required");
  }
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath.path);
  } catch (error) {
    throw new ApiError(500, error.message || "Error uploading avatar");
  }

  try {
    const user = await User.create({
      userName: userName.toLowerCase(),
      fullName,
      email,
      avatar: avatar.url,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiResponse(500, "Error creating user");
    }

    res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User Registred Successfully"));
  } catch (error) {
    if (avatar.public_id) {
      removeFileFromCloudinary(avatar.public_id);
    }
    throw new ApiError(500, error.message || "Error creating user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if ([userName, email, password].some((value) => value.trim() === "")) {
    throw new ApiError(401, "All fields are required");
  }

  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) {
    throw new ApiError(401, "User doesn't exist");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.PRODUCTION === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User loggedIn Successfully"));
});

 const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:1}});

    const options = {
      httpOnly:true,
      secure:process.env.PRODUCTION === "Production"
    }
    
    res.status(200).clearCookies("accessToken",options)
    .clearCookies("refreshToken",options).json(200,{},"User logout Successfully");
 })

 const getUser = asyncHandler(async(req,res) =>{
    const user = req.user;
    res.status(200).json(200,user,"User fetched successfully");
 })

 const generateAccessToken  = asyncHandler(async (req,res)=> {
   const refreshTokenData = req.cookie.refreshToken || req.body;
   if(!refreshTokenData){
    throw new ApiError(401,"Unauthorized access");
   }
   decodeToken = await jwt.verify(refreshTokenData,process.env.REFRESH_TOKEN_SECRET);
   
    if(!decodeToken){
    throw new ApiError(401,"Invalid Refresh Token");
   }

   const user = await User.findById(decodeToken._id);

   if(!user){
    throw new ApiError(401,"Invalid Refresh token")
   }

    if(user.refreshToken !== refreshTokenData){
      throw new ApiError(401,"Invalid Refresh token or expired");
    }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave:false})

  //  User.findByIdAndUpdate(user._id,{$set:refreshToken});

  const options = {
    httpOnly:true,
    secure:process.env.PRODUCTION === "Production"
  }

   res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(200,{},"User login Successfully")
 })

 const updateUser = asyncHandler(async(req,res) => {
    const {email,fullName}  = req.body;

    if(!(email || fullName)){
      throw new ApiError(401,"All fields are required");
    }

    const isExistingUser = await User.findOne({email:email});

    if(req.user_id !== isExistingUser._id){
      throw new ApiError(401,"Email is already exist");
    }

   const updatedUser = await User.findByIdAndUpdate(req._id,{
      email:email,
      fullName:fullName
    },
    {
      new:true
    }
  )

  res.status(200).json(new ApiError(200,updatedUser,"User Updated Successfully"));
 })

 const generateNewPassword = asyncHandler(async (req,res)=>{
   const {oldPassword,newPassword} = req.body;
   if(!(oldPassword || newPassword)){
    throw new ApiError(401,"All fields are Required");
   }

    const user = await User.findById(req.user._id);

    if(!user){
      throw new ApiError(401,"User not found")
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if(!isPasswordValid){
      throw new ApiError(401,"old Password is Invalid")
    }

    user.password = newPassword;

    await user.save({validateBeforeSave:false});

    res.status(200).json(new ApiResponse(200,{},"Password updated Successfully"));
 });

 const updateProfileImage = asyncHandler(async (req,res)=>{
   const uploadedAvatarFile = req.file;

   if(!uploadedAvatarFile){
    throw new ApiError(401,"Avatar file is missing");
   }

   const avatar = await uploadOnCloudinary(uploadedAvatarFile.path);
   
   const user = await User.findByIdAndUpdate(req.user._id,
    {$set:{avatar:avatar.url}},
    {new:true})

    res.status(200).json(200,user,"Avatar file successfully updated");

 })

export { registerUser, loginUser,logoutUser,updateUser,getUser,generateAccessToken,generateNewPassword,updateProfileImage };
