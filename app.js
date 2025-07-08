import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import users from "./routes/user_route.js";
import product from "./routes/product_route.js";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart_route.js";
import cartItemRouter from "./routes/cartItem_route.js";
import order from "./routes/order_route.js";

const app = express();
const port = "5000";

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
app.use("/api/v1/user", users);
app.use("/api/v1/product", product);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/cartitem", cartItemRouter);
app.use("/api/v1/order", order);
