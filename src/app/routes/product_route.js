import express from "express";
import {
  addProduct,
  editProduct,
  getProduct,
} from "../controllers/product_control.js";
import authenticate from "../middlewares/auth.middleware.js";
import { productImage } from "../middlewares/multer.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(authenticate, productImage, addProduct)
  .put(authenticate, editProduct)
  .get(getProduct);

export default productRouter;
