import Joi from "joi";

const register = Joi.object({
  name: Joi.string().max(255).required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
  token: Joi.string().max(100),
});

const login = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
});

export { register, login };
