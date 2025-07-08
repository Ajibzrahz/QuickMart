import e from "express";
import { getCart } from "../controllers/cart_control.js";
import authenticate from "../middlewares/auth.middleware.js";

const cartRouter = e.Router();

cartRouter.route("/").get(authenticate, getCart)

export default cartRouter