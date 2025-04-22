import {
  createValidation,
  updateValidation,
} from "../validation/category-result-validation.js";
import { prismaClient } from "../applications/database.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../errors/response-error.js";

const createService = async (userId, body) => {
  try {
    const data = validate(createValidation, body);

    const whereClause = {
      user_id: userId,
      gender: data.gender,
      OR: [
        {
          min_systolic: { lte: data.max_systolic },
          max_systolic: { gte: data.min_systolic },
        },
        {
          min_diastolic: { lte: data.max_diastolic },
          max_diastolic: { gte: data.min_diastolic },
        },
      ],
    };

    if (data.is_age_required) {
      whereClause.min_age = { lte: data.max_age };
      whereClause.max_age = { gte: data.min_age };
      whereClause.is_age_required = true;
    } else {
      whereClause.is_age_required = false;
    }

    const existingCategory = await prismaClient.categoryResult.findMany({
      where: whereClause,
    });

    if (existingCategory.length > 0) {
      throw new ResponseError(
        400,
        "Category with overlapping range already exists"
      );
    }

    return await prismaClient.categoryResult.create({
      data: {
        user_id: userId,
        name: data.name,
        gender: data.gender,
        color: data.color,
        is_age_required: data.is_age_required,
        min_age: data.min_age,
        max_age: data.max_age,
        min_systolic: data.min_systolic,
        max_systolic: data.max_systolic,
        min_diastolic: data.min_diastolic,
        max_diastolic: data.max_diastolic,
        description: data.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getAllService = async () => {
  try {
    return await prismaClient.categoryResult.findMany({});
  } catch (error) {
    throw error;
  }
};

const getAllByUserIdService = async (userId) => {
  try {
    return await prismaClient.categoryResult.findMany({
      where: {
        user_id: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getDefaultCategoryService = async () => {
  try {
    return await prismaClient.defaultCategoryResult.findMany({});
  } catch (error) {
    throw error;
  }
};

const updateService = async (userId, categoryId, body) => {
  try {
    const data = validate(updateValidation, body);

    const existingCategory = await prismaClient.categoryResult.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                min_systolic: {
                  lte: data.max_systolic,
                },
                max_systolic: {
                  gte: data.min_systolic,
                },
              },
            ],
          },
          {
            OR: [
              {
                min_diastolic: {
                  lte: data.max_diastolic,
                },
                max_diastolic: {
                  gte: data.min_diastolic,
                },
              },
            ],
          },
        ],
      },
    });

    if (existingCategory.length > 0) {
      throw new ResponseError(
        400,
        "Systolic or Diastolic range overlaps with an existing category"
      );
    }

    return await prismaClient.categoryResult.update({
      where: {
        id: parseInt(categoryId),
      },
      data: {
        user_id: userId,
        name: data.name,
        min_systolic: data.min_systolic,
        max_systolic: data.max_systolic,
        min_diastolic: data.min_diastolic,
        max_diastolic: data.max_diastolic,
        description: data.description,
      },
    });
  } catch (error) {
    throw new ResponseError(
      error.status || 500,
      error.message || "An error occurred while updating the category"
    );
  }
};

const deleteService = async (userId, categoryId) => {
  try {
    const categoryFound = await prismaClient.categoryResult.findUnique({
      where: {
        id: parseInt(categoryId),
      },
      select: {
        id: true,
        user_id: true,
      },
    });

    if (!categoryFound) {
      throw new ResponseError(404, "Category not found");
    }

    if (categoryFound.user_id !== userId) {
      throw new ResponseError(400, "Category cannot be deleted");
    }

    return await prismaClient.categoryResult.delete({
      where: {
        id: parseInt(categoryId),
      },
    });
  } catch (error) {
    throw error;
  }
};

export {
  createService,
  getAllService,
  getDefaultCategoryService,
  getAllByUserIdService,
  updateService,
  deleteService,
};
