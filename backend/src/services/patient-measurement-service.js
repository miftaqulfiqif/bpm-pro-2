import { createValidation } from "../validation/patient-measurement-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";
import { classifyBloodPressure } from "../applications/classification.js";
import { ResponseError } from "../errors/response-error.js";

const createService = async (user, body) => {
  try {
    const data = validate(createValidation, body);

    return await prismaClient.patientMeasurement.create({
      data: {
        patient_id: data.patient_id,
        user_id: user.id,
        last_measurement: data.last_measurement,
        weight: data.weight,
        systolic: data.systolic,
        diastolic: data.diastolic,
        mean: data.mean,
        heart_rate: data.heart_rate,
        category_result: data.category_result,
      },
    });
  } catch (error) {
    throw error;
  }
};

const measurementResultService = async (body) => {
  try {
    const categoryResult = await classifyBloodPressure(
      body.systolic,
      body.diastolic
    );
    return categoryResult;
  } catch (error) {
    throw error;
  }
};

const getAllService = async () => {
  try {
    return await prismaClient.patientMeasurement.findMany({});
  } catch (error) {
    throw error;
  }
};

const getAllByUserIdService = async (userId) => {
  try {
    return await prismaClient.patientMeasurement.findMany({
      where: {
        user_id: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

const deletePatientMeasurementService = async (
  userId,
  patientMeasurementId
) => {
  try {
    const patientMeasurementFound =
      await prismaClient.patientMeasurement.findUnique({
        where: {
          id: parseInt(patientMeasurementId),
        },
        select: {
          id: true,
          user_id: true,
        },
      });

    if (!patientMeasurementFound) {
      throw new ResponseError(404, "Patient not found");
    }

    if (patientMeasurementFound.user_id !== userId) {
      throw new ResponseError(400, "Patient cannot be deleted");
    }

    return await prismaClient.patientMeasurement.delete({
      where: {
        id: parseInt(patientMeasurementId),
      },
    });
  } catch (error) {
    throw error;
  }
};

const searchPatientMeasurement = async (query) => {
  try {
    if (!query) {
      throw new ResponseError(400, "Query is required");
    }
    if (!query || typeof query !== "string") {
      return [];
    }

    return await prismaClient.patientMeasurement.findMany({
      where: {
        patient: {
          name: {
            contains: query,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error searching patients : ", error);
  }
};

const paginationService = async (page, limit, skip) => {
  try {
    const total = await prismaClient.patientMeasurement.count();

    const patient = await prismaClient.patientMeasurement.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
    });

    return {
      total,
      page,
      limit,
      data: patient,
    };
  } catch (error) {
    throw error;
  }
};

export {
  createService,
  measurementResultService,
  getAllService,
  getAllByUserIdService,
  deletePatientMeasurementService,
  searchPatientMeasurement,
  paginationService,
};
