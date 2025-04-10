import { createValidation } from "../validation/patient-measurement-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";
import { classifyBloodPressure } from "../applications/classification.js";
import { ResponseError } from "../errors/response-error.js";
import { Builder } from "xml2js";

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

const paginationService = async (page, limit, skip, query) => {
  try {
    const total = await prismaClient.patientMeasurement.count({
      where: query ? { patient: { name: { contains: query } } } : {},
    });

    const patient = await prismaClient.patientMeasurement.findMany({
      where: query ? { patient: { name: { contains: query } } } : {},
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
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

const paginationByUserService = async (userId, page, limit, skip, query) => {
  try {
    const searchConditions = query
      ? {
          OR: [
            {
              patient: {
                name: { contains: query },
              },
            },
            { category_result: { contains: query } },
          ],
        }
      : {};

    const whereConditions = {
      user_id: userId,
      ...searchConditions,
    };

    const total = await prismaClient.patientMeasurement.count({
      where: whereConditions,
    });

    const patient = await prismaClient.patientMeasurement.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        patient_id: true,
        patient: {
          select: {
            name: true,
            gender: true,
            phone: true,
            work: true,
            last_education: true,
            place_of_birth: true,
            date_of_birth: true,
          },
        },
        user_id: true,
        weight: true,
        systolic: true,
        diastolic: true,
        mean: true,
        heart_rate: true,
        category_result: true,
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

const exportXMLService = async (patient_measurements) => {
  try {
    const formated = {
      patient_measurements: {
        patient_measurement: patient_measurements.map((p) => ({
          id: p.id,
          patient_id: p.patient_id,
          user_id: p.user_id,
          weight: p.weight,
          systolic: p.systolic,
          diastolic: p.diastolic,
          mean: p.mean,
          heart_rate: p.heart_rate,
          category_result: p.category_result,
          patient: {
            name: p.patient.name,
            gender: p.patient.gender,
            phone: p.patient.phone,
            work: p.patient.work,
            last_education: p.patient.last_education,
            place_of_birth: p.patient.place_of_birth,
          },
        })),
      },
    };

    const builder = new Builder({
      xmldec: { version: "1.0", encoding: "UTF-8" },
      renderOpts: { pretty: true },
    });

    const xml = builder.buildObject(formated);

    return xml;
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
  paginationByUserService,
  exportXMLService,
};
