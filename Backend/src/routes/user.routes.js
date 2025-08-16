import {Router} from "express";
import {generateAccessToken, generateNewPassword, getUser, loginUser, logoutUser, registerUser, updateProfileImage, updateUser} from '../controllers/user.controllers.js';
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const userRouter = Router();

userRouter.route('/register').post(upload.single('avatar'),registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT,logoutUser);
userRouter.route('/getUser').get(verifyJWT,getUser);
userRouter.route('/updateUser').put(verifyJWT,updateUser);
userRouter.route('/generatePassword').post(verifyJWT,generateNewPassword);
userRouter.route('/generateAccessToken').get(verifyJWT,generateAccessToken);
userRouter.route('/updateProfileImage').put(verifyJWT,updateProfileImage);

export {userRouter};