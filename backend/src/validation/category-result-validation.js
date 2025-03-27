import Joi from "joi";

const createValidation = Joi.object({
  name: Joi.string().max(255).required(),
  min_systolic: Joi.number().required(),
  max_systolic: Joi.number().required(),
  min_diastolic: Joi.number().required(),
  max_diastolic: Joi.number().required(),
  gender: Joi.string().max(10).required(),
  description: Joi.string().max(255).required(),
});

export { createValidation };
