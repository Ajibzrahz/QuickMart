import e from "express";
import { getCart } from "../controllers/cart_control.js";

const cartRouter = e.Router();

cartRouter.route("/").get(getCart)

export default cartRouter