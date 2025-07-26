import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

const cartItemModel = mongoose.model("CartItem", cartItemSchema);
export default cartItemModel;
