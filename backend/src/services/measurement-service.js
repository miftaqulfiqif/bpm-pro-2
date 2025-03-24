import { createValidation } from "../validation/measurement-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";
import { getUserValidation } from "../validation/user-validation.js";
import { logger } from "../applications/logging.js";

const createService = async (body, user) => {
  try {
    const measurement = validate(createValidation, body);

    const userFound = await prismaClient.measurement.findUnique({
      where: {
        user_id: user.id,
      },
      select: {
        user_id: true,
      },
    });

    if (!userFound) {
      return prismaClient.measurement.create({
        data: {
          user_id: user.id,
          ...measurement,
        },
      });
    } else {
      return prismaClient.measurement.upsert({
        where: {
          user_id: user.id,
        },
        update: measurement,
        create: {
          user_id: user.id,
          ...measurement,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

const getMeasurementService = async (username) => {
  try {
    username = validate(getUserValidation, username);

    const data = await prismaClient.measurement.findFirst({
      where: {
        user_id: username,
      },
      select: {
        user_id: true,
        systolic: true,
        diastolic: true,
        mean: true,
        heart_rate: true,
        timestamp: true,
      },
    });

    if (!data) {
      throw new ResponseError(404, "User not found");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export { createService, getMeasurementService };
