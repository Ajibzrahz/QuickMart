import express from "express";
import { addProduct, editProduct, getProduct } from "../controllers/product_control.js";
import authenticate from "../middlewares/auth.middleware.js";

const productRouter = express.Router()

productRouter.post("/product", authenticate, addProduct)
productRouter.put("/product", authenticate, editProduct)
productRouter.get("/products", getProduct)

export default productRouter