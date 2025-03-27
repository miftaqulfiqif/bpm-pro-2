import Joi from "joi";

const createPatientValidation = Joi.object({
  name: Joi.string().max(255).required(),
  gender: Joi.string().max(20).required(),
  phone: Joi.number().required(),
  work: Joi.string().max(50).required(),
  last_education: Joi.string().max(50).required(),
  place_of_birth: Joi.string().max(50).required(),
  date_of_birth: Joi.date().required(),
});

const updatePatientValidation = Joi.object({
  name: Joi.string().max(255).optional(),
  gender: Joi.string().max(20).optional(),
  phone: Joi.number().optional(),
  work: Joi.string().max(50).optional(),
  last_education: Joi.string().max(50).optional(),
  place_of_birth: Joi.string().max(50).optional(),
  date_of_birth: Joi.date().optional(),
});

export { createPatientValidation, updatePatientValidation };
