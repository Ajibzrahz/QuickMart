import Joi from "joi";

const reviewValidate = Joi.object({
  rating: Joi.number().min(1).max(5).message({
    "number.base": "rating must be a number",
    "number.min": "rating cannot be less than 1",
    "number.max": "rating cannot be more than 5",
  }),
  user: Joi.string().hex().length(24).required().messages({
    "string.length": "Object ID must be 24 characters",
    "any.required": "user ID are required",
  }),
  product: Joi.string().hex().length(24).required().messages({
    "string.hex": "Must be an objectID",
    "any.required": "product ID is required",
  }),
  comment: Joi.string().max(500).messages({
    "string.base": "Comment must be a string",
    "string.max": "Comment is too long (max 500 characters)",
  }),

  video: Joi.string().uri().messages({
    "string.base": "Video must be a string",
    "string.uri": "Video must be a valid URL",
  }),

  createdAt: Joi.date().messages({ "date.base": "invalid date format" }),
});

export default reviewValidate
