import Joi from "joi";

const createValidation = Joi.object({
  patient_id: Joi.number().required(),
  weight: Joi.number().required(),
  systolic: Joi.number().required(),
  diastolic: Joi.number().required(),
  mean: Joi.number().required(),
  heart_rate: Joi.number().required(),
  category_result: Joi.string().required(),
});

export { createValidation };
