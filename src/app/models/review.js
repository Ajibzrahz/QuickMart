import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 4,
    min: 1,
    max: 5,
  },
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  comment: {
    type: String,
  },
  video: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
