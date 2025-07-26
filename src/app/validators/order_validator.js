import Joi from "joi";

const orderValidate = Joi.object({
  user: Joi.string().hex().length(24).required().messages({
    "string.length": "Object ID must be 24 characters",
    "any.required": "user ID are required",
  }),
  items: Joi.array().items(
    Joi.string().hex().length(24).required().messages({
      "string.length": "Object ID must be 24 characters",
      "any.required": "items ID are required",
    })
  ),
  payment: Joi.string()
    .valid("Cash", "Transfer", "Card")
    .default("Cash")
    .messages({ "any.only": "payment must be Cash, Transfer or Card" }),
  status: Joi.string()
    .valid("pending", "paid", "shipped", "delivered", "cancelled")
    .default("pending")
    .messages({ "any.only": "Invalid status" }),
  totalAmount: Joi.number().required().messages({
    "number.base": "Amount must be a number",
    "any.required": "The amount is required",
  }),
  placedAt: Joi.date().messages({ "date.base": "invalid date format" }),
});

export default orderValidate;
