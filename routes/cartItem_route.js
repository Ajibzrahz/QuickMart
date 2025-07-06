import e from "express";
import { createCartItem } from "../controllers/cartItem_control.js";
import authenticate from "../middlewares/auth.middleware.js";

const cartItemRouter = e.Router();

cartItemRouter.route("/").post(authenticate, createCartItem);

export default cartItemRouter;
