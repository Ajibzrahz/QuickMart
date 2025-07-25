import customAPIError from "../error/custom-error.js";

const errorMiddleware = (error, req, res, next) => {
  if (error instanceof customAPIError) {
    return res.status(error.statusCode).json({ msg: error.message });
  }

  return res.status(500).json({ msg: "something went wrong, try again!" });
};

export default errorMiddleware
