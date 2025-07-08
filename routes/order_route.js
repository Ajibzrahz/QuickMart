import e from "express";
import { createOrder } from "../controllers/order_control.js";
import authenticate from "../middlewares/auth.middleware.js";

const orderRouter = e.Router();

orderRouter.route("/").post(authenticate, createOrder);

export default orderRouter;
