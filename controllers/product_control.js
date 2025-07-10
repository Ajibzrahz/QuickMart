import productModel from "../models/product.js";
import userModel from "../models/user.js";

const addProduct = async (req, res, next) => {
  const { id, role } = req.user;
  const product = req.body;
  //
  if (role !== "seller" && role !== "admin") {
    const err = new Error("you cannot add a product, create a seller account");
    err.status = 403;
    return next(err);
  }
  try {
    const newProduct = new productModel({
      seller: id,
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
    if (id != product.seller) {
      const err = new Error(
        "This product is not your, You cannot edit this product!!!"
      );
      err.status = 403;
      return next(err);
    }
    //checking if post exist
    if (!product) {
      const err = new Error("This product does not exist");
      err.status = 404;
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
