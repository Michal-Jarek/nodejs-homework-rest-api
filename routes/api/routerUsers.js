import express from "express";
import { auth } from "../../src/middlewares.js";
import * as userController from "../../src/modules/users/controller.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.userSignup);
userRouter.post("/login", userController.userLogin);
userRouter.get("/logout", auth, userController.userLogout);
userRouter.get("/current", auth, userController.userCurrent);


export default userRouter;
