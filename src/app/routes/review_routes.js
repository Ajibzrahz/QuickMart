import e from "express";
import { createReview } from "../controllers/review_control.js";
import authenticate from "../middlewares/auth.middleware.js";
import { reviewVideo } from "../middlewares/multer.js";

const reviewRouter = e.Router();

reviewRouter.route("/").post(createReview)

export default reviewRouter