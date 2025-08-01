import Joi from "joi";

const productValidator = Joi.object({
  description: Joi.string().min(6),

  image: Joi.array()
    .items(Joi.string().uri().required())
    .min(1)
    .required()
    .messages({
      "array.min": "Please provide at least one image",
      "string.uri": "Video must be a valid URL",
    }),

  brand: Joi.string().required(),
  
  inventory: Joi.number().min(1).required(),

  seller: Joi.string().hex().length(24).required().messages({
    "string.hex": "Must be an objectID",
    "any.required": "Seller ID is required",
  }),
  
});

export default productValidator
