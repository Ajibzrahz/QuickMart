import productModel from "../models/product.js";
import userModel from "../models/user.js";

import cloudinary from "../../../utils/cloudinary.js";
import fs from "fs/promises";
import customAPIError from "../error/custom-error.js";

const addProduct = async (req, res, next) => {
  const { id, role } = req.user;
  const product = req.body;
  const image = req.files;

  if (role !== "seller" && role !== "admin") {
    const err = new customAPIError(
      "you cannot add a product, create a seller account",
      403
    );
    return next(err);
  }

  if (!image || image.length === 0) {
    const err = new customAPIError(
      "please provide an image for your product",
      400
    );
    return next(err);
  }
  try {
    const uploadedimages = [];

    for (const file of image) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
        folder: "images",
      });
      uploadedimages.push(result.secure_url);

      await fs.unlink(file.path);
    }

    console.log(uploadedimages);
    //

    const newProduct = new productModel({
      seller: id,
      image: uploadedimages,
      ...product,
    });
    const savedproduct = await newProduct.save();
    const userInfo = await userModel.findById(id);
    userInfo.products.push(savedproduct._id);
    await userInfo.save();

    return res.status(201).json({
      message: "Item added Successfully",
      item: savedproduct,
    });
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  const { id, role } = req.user;
  const { productID } = req.query;
  const payload = req.body;
  //checking if user is a seller
  // if (role !== "seller") {
  //   const err = new Error("you cannot edit this product")
  //   err.status
  //   return res.send();
  // }
  try {
    const product = await productModel.findById(productID);
    //checking if the user can update the product
    if (id.toString() != product.seller.toString() && role != "admin") {
      const err = new customAPIError(
        "You do not have permission to edit this product.",
        403
      );
      return next(err);
    }
    //checking if post exist
    if (!product) {
      const err = new customAPIError("This product does not exist", 404);
      return next(err);
    }

    //updating product
    const updated = await productModel.findByIdAndUpdate(
      productID,
      { ...payload },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  const { brandName } = req.query;
  try {
    const products = await productModel.aggregate([
      {
        $match: {
          brand: { $regex: brandName, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 0,
          price: 1,
          image: 1,
          brand: 1,
          userDetails: {
            first_name: 1,
            last_name: 1,
            email: 1,
            phone_number: 1,
          },
        },
      },
      {
        $sort: {
          price: -1,
        },
      },
    ]);
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

export { editProduct, addProduct, getProduct };
