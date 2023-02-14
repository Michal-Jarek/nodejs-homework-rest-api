import express from "express";
import * as userController from "../../src/modules/users/controller.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.userSignup);

export default userRouter;