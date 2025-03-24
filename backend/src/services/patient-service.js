import { createPatientValidation } from "../validation/patient-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";

const createPatientService = async (body, user) => {
  try {
    const patient = validate(createPatientValidation, body);

    return prismaClient.patient.create({
      data: {
        user_id: user.id,
        ...patient,
      },
    });
  } catch (error) {
    throw error;
  }
};

export { createPatientService };
