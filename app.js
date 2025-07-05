import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user_route.js";
import productRouter from "./routes/product_route.js";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart_route.js";
import cartItemRouter from "./routes/cartItem_route.js";

const app = express();
const port = "8081";

//connecting to mongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log("app running in port: " + port);
    });
  })
  .catch((err) => {
    console.log("Error:" + err);
  });
//middlewares
app.use(express.json());
app.use(cookieParser());
// routers
app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(cartItemRouter);
