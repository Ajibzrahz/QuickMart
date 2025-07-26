import Joi, { allow } from "joi";

const userValidate = Joi.object({
  first_name: Joi.string().min(3).max(255).required(),
  last_name: Joi.string().min(3).max(255).required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 5 digits",
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@$%^&*?]).{8,}$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .message({ "string.email": "invalid Email" }),
  role: Joi.string(),
  address: Joi.string().required().messages({
    "string.base": "Address should be a string",
    "any.required": "Address is required",
  }),
});

export default userValidate;
