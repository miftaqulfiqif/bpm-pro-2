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

export { createPatientValidation };
