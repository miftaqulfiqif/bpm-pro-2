import Joi from "joi";

const registerValidation = Joi.object({
  name: Joi.string().max(255).required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
  token: Joi.string().max(100),
});

const loginValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
});

const getUserValidation = Joi.string().max(100).required();

const deleteUserValidation = Joi.string().max(20).required();

const updateUserValidation = Joi.object({
  password: Joi.string().max(20).required(),
  name: Joi.string().max(255),
  username: Joi.string().max(100),
  new_password: Joi.string().max(20),
});

const updatePasswordValidation = Joi.object({
  password: Joi.string().max(20).required(),
  new_password: Joi.string().max(20).required(),
});

export {
  registerValidation,
  loginValidation,
  getUserValidation,
  deleteUserValidation,
  updateUserValidation,
  updatePasswordValidation,
};
