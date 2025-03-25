import { createValidation } from "../validation/category-result-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";

const createService = async (body) => {
  try {
    const data = validate(createValidation, body);

    const dataFound = await prismaClient.categoryResult.findUnique({
      where: {
        name: data.name,
      },
    });

    if (dataFound) {
      throw new ResponseError(400, "Category result already exists");
    }

    return await prismaClient.categoryResult.create({
      data: {
        name: data.name,
        min_systolic: data.min_systolic,
        max_systolic: data.max_systolic,
        min_diastolic: data.min_diastolic,
        max_diastolic: data.max_diastolic,
        gender: data.gender,
        description: data.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

export { createService };
