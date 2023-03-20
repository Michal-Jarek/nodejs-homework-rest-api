import express from "express";
import { auth, upload } from "../../src/middlewares.js";
import * as userController from "../../src/modules/users/controller.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.userSignup);
userRouter.post("/login", userController.userLogin);
userRouter.get("/logout", auth, userController.userLogout);
userRouter.get("/current", auth, userController.userCurrent);
userRouter.patch("/avatars", auth, upload.single("avatar"), userController.userAvatar);
userRouter.get("/verify/:verify", userController.userEmailVerify);


export default userRouter;
