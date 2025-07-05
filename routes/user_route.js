import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  login,
} from "../controllers/user_control.js";

const userRouter = express.Router();

userRouter.post("/user", createUser);
userRouter.post("/login", login);
userRouter.get("/user", getUser);
userRouter.get("/alluser", getUsers);

export default userRouter;
