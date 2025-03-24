import Joi from "joi";

const createValidation = Joi.object({
  user_id: Joi.string().required(),
  systolic: Joi.number().required(),
  diastolic: Joi.number().required(),
  mean: Joi.number().required(),
  heart_rate: Joi.number().required(),
});

export { createValidation };
