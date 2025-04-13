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

const classificationValidation = Joi.object({
  systolic: Joi.number().required(),
  diastolic: Joi.number().required(),
  patient_date_of_birth: Joi.date().required(),
  patient_gender: Joi.string().required(),
});

export { createValidation, classificationValidation };
