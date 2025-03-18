import { createValidation } from "../validation/measurement-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";

const createService = async (request) => {
  try {
    const measurement = validate(createValidation, request);

    const userFound = await prismaClient.measurement.findUnique({
      where: {
        user_id: measurement.user_id,
      },
      select: {
        user_id: true,
      },
    });

    if (!userFound) {
      return prismaClient.measurement.create({
        data: measurement,
      });
    } else {
      return prismaClient.measurement.upsert({
        where: {
          user_id: measurement.user_id,
        },
        update: measurement,
        create: measurement,
      });
    }
  } catch (error) {
    throw error;
  }
};

export { createService };
