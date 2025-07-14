import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import cartModel from "../models/cart.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";

const createUser = async (req, res, next) => {
  const payload = req.body;
  const pics = req.file.path;

  //confirming all important credential
  if (!payload.password || !payload.email) {
    const error = new Error("please input the require credentials");
    error.status = 400;
    return next(error);
    // return res.json({
    //   message: "please input the require credentials",
    // });
  }

  //checking user exist
  const existingUser = await userModel.findOne({ email: payload.email });
  if (existingUser) {
    const err = new Error("You already have an account, try login");
    err.status = 409;
    return next(err);
    // return res.json({
    //   message: "You already have an account, try login",
    // });
  }

  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@$%^&*?]).{8,}$/;
  if (!regexPassword.test(payload.password)) {
    const err = new Error("Input a correct password format");
    err.status = 400;
    return next(err);
    // return res.json({
    //   message: "Input a correct password format",
    // });
  }

  try {
    const result = await cloudinary.uploader.upload(pics, {
      resource_type: "image",
    });
    await fs.unlink(pics);

    if (!result) {
      const err = new Error("Format not supported");
      err.status = 400;
      next(err);
    }

    const newUser = new userModel({
      profilePic: result.secure_url,
      ...payload,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

    await cartModel.create({ user: savedUser._id });
  } catch (error) {
    await fs.unlink(pics);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email: email.toLowerCase(),
    });
    //verifying the credentials

    if (!user) {
      const err = new Error("Account does not exist, Create account");
      err.status = 404;
      return next(err);
    }
    const cart = await cartModel.findOne({ user: user._id });
    //console.log(cart)
    // comparing the passwords
    const compareHashedPassword = bcrypt.compareSync(password, user.password);

    // verifying password
    if (!compareHashedPassword) {
      const err = new Error("Incorrect email or password");
      err.status = 404;
      return next(err);
    }

    //generating the token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        cartId: cart._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2hr",
      }
    );
    //storing the token as a cookie
    res.cookie("userToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    });

    return res.status(202).json({
      messsage: "Login Successful",
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { firstname, lastname } = req.query;
  try {
    const users = await userModel.aggregate([
      {
        $match: {
          first_name: {
            $regex: firstname,
            $options: "i",
          },
          last_name: {
            $regex: lastname,
            $options: "i",
          },
        },
      },
      {
        $limit: 3,
      },
      {
        $sort: {
          first_name: 1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "sellerProducts",
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          sellerProducts: {
            brand: 1,
            price: 1,
            image: 1,
          },
        },
      },
      {
        $set: {
          sellerProducts: {
            $sortArray: {
              input: "$sellerProducts",
              sortBy: { price: -1 },
            },
          },
        },
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await userModel
      .find()
      .limit(3)
      .sort({
        last_name: 1,
        first_name: 1,
      })
      .populate({
        path: "products",
        select: "-desc -_id",
        options: {
          sort: { price: -1 },
        },
      });
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

export { createUser, login, getUser, getUsers };
