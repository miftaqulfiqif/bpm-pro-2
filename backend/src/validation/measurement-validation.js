import Joi from "joi";

const createValidation = Joi.object({
  user_id: Joi.string().max(100).required(),
  systolic: Joi.number().required(),
  diastolic: Joi.number().required(),
  mean: Joi.number().required(),
  heart_rate: Joi.number().required(),
});

export { createValidation };
