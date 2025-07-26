import Joi from "joi";

const cartValidator = Joi.object({
  items: Joi.array().items(
    Joi.string().hex().length(24).required().messages({
      "string.hex": "Must be an objectID",
      "any.required": "item ID is required",
    })
  ),
  user: Joi.string().hex().length(24).required().messages({
    "string.hex": "Must be an objectID",
    "any.required": "user ID is required",
  }),
});

export default cartValidator;
