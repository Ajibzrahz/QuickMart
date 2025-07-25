import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    address: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      enum: ["Transfer", "Cash", "Card"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
