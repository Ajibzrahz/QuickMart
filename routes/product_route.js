import express from "express";
import {
  addProduct,
  editProduct,
  getProduct,
} from "../controllers/product_control.js";
import authenticate from "../middlewares/auth.middleware.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(authenticate, addProduct)
  .put(authenticate, editProduct)
  .get(getProduct);

export default productRouter;
