import Joi, { any } from "joi";

const cartItemValidator = Joi.object({
  product: Joi.string().hex().length(24).required().messages({
    "string.hex": "Must be an objectID",
    "any.required": "product ID is required",
  }),
  cart: Joi.string().hex().length(24).required().messages({
    "string.hex": "Must be an objectID",
    "any.required": "cart ID is required",
  }),
  quantity: Joi.number().min(1).messages({
    "number.min": "minimum quntity is 1",
    "number.base": "Quantity must be a number",
  }),
});

export default cartItemValidator;
