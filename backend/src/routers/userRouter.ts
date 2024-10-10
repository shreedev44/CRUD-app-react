import express from "express";
import { userRouteProtector, refreshToken } from "../middlewares/jwtAuth";
import * as userController from "../controllers/userController";
const userRouter = express.Router();

userRouter.post("/signup", userController.registerUser);

userRouter.post("/login", userController.verifyUser);

userRouter.get("/fetch-user", userRouteProtector, userController.fetchUser);

userRouter.patch("/update-profile", userRouteProtector, userController.updateProfile);

userRouter.get('/logout', userRouteProtector, userController.logout)

userRouter.get("/refresh-token", refreshToken);

export default userRouter;
