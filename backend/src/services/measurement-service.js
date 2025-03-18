import { createValidation } from "../validation/measurement-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";

const createService = async (request) => {
  try {
    const measurement = validate(createValidation, request);

    return prismaClient.measurement.create({
      data: measurement,
    });
  } catch (error) {
    throw error;
  }
};

export { createService };
