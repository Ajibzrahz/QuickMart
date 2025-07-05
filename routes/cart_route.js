import e from "express";
import { getCart } from "../controllers/cart_control.js";

const cartRouter = e.Router();

cartRouter.get("/cart", getCart)

export default cartRouter