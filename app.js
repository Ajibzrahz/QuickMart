import express from "express";
import mongoose from "mongoose";
import dotenv from "./utils/dotenv.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/app/routes/user_route.js";
import product from "./src/app/routes/product_route.js";
import cartRouter from "./src/app/routes/cart_route.js";
import cartItemRouter from "./src/app/routes/cartItem_route.js";
import order from "./src/app/routes/order_route.js";
import review from "./src/app/routes/review_routes.js";
import notFound from "./src/app/middlewares/not-found.js";
import errorMiddleware from "./src/app/middlewares/error-handler.js";

const app = express();
const port = process.env.PORT || 5000;

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
//content-types middlewares
app.use(express.json());
app.use(
  express.text({
    type: [
      "text/plain",
      "text/html",
      "application/javascript",
      "application/xml",
    ],
  })
);
app.use(express.urlencoded());

app.use(cookieParser());
// routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", product);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/cartitem", cartItemRouter);
app.use("/api/v1/order", order);
app.use("/api/v1/review", review);

app.use(notFound);
app.use(errorMiddleware);
