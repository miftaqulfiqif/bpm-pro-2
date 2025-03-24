import { createValidation } from "../validation/patient-measurement-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";

const createService = async (body) => {
  try {
    const data = validate(createValidation, body);
    return await prismaClient.patientMeasurement.create({
      data: {
        ...data,
      },
    });
  } catch (error) {
    throw error;
  }
};

export { createService };
