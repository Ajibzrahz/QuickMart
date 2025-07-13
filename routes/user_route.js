import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  login,
} from "../controllers/user_control.js";
import { profilePicture } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.route("/").post(profilePicture, createUser).get(getUser);
userRouter.route("/login").post(login);
userRouter.route("/all").get(getUsers);

export default userRouter;
