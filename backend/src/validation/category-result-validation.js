import Joi from "joi";

const createValidation = Joi.object({
  name: Joi.string().max(255).required(),
  color: Joi.string().max(20).required(),
  gender: Joi.string().max(20).required(),
  is_age_required: Joi.boolean().required(),
  min_age: Joi.number().default(0),
  max_age: Joi.number().default(0),
  min_systolic: Joi.number().required(),
  max_systolic: Joi.number().required(),
  min_diastolic: Joi.number().required(),
  max_diastolic: Joi.number().required(),
  description: Joi.string().max(255).required(),
});

const updateValidation = Joi.object({
  name: Joi.string().max(255).optional(),
  min_systolic: Joi.number().optional(),
  max_systolic: Joi.number().optional(),
  min_diastolic: Joi.number().optional(),
  max_diastolic: Joi.number().optional(),
  description: Joi.string().max(255).optional(),
});

export { createValidation, updateValidation };
