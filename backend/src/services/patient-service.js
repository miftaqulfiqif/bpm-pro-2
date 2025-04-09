import {
  createPatientValidation,
  updatePatientValidation,
} from "../validation/patient-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";

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

const getAllPatientService = async () => {
  try {
    return prismaClient.patient.findMany({});
  } catch (error) {
    throw error;
  }
};

const getAllByUserIdService = async (userId) => {
  try {
    return prismaClient.patient.findMany({
      where: {
        user_id: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

const searchPatientService = async (query) => {
  try {
    if (!query) {
      throw new ResponseError(400, "Query is required");
    }
    if (!query || typeof query !== "string") {
      return [];
    }

    return await prismaClient.patient.findMany({
      where: {
        name: {
          contains: query,
        },
      },
    });
  } catch (error) {
    throw new Error("Error searching patients : ", error);
  }
};

const updatePatientService = async (patientId, body) => {
  try {
    const patient = validate(updatePatientValidation, body);
    const patientFound = await prismaClient.patient.findUnique({
      where: {
        id: parseInt(patientId),
      },
      select: {
        id: true,
      },
    });

    if (!patientFound) {
      throw new ResponseError(404, "Patient not found");
    }

    const data = {};

    if (patient.name) {
      data.name = patient.name;
    }
    if (patient.gender) {
      data.gender = patient.gender;
    }
    if (patient.phone) {
      data.phone = patient.phone;
    }
    if (patient.work) {
      data.work = patient.work;
    }
    if (patient.last_education) {
      data.last_education = patient.last_education;
    }
    if (patient.place_of_birth) {
      data.place_of_birth = patient.place_of_birth;
    }
    if (patient.date_of_birth) {
      data.date_of_birth = patient.date_of_birth;
    }

    return prismaClient.patient.update({
      where: {
        id: parseInt(patientId),
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        work: true,
        last_education: true,
        place_of_birth: true,
        date_of_birth: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const deletePatientService = async (userId, patientId) => {
  try {
    const patientFound = await prismaClient.patient.findUnique({
      where: {
        id: parseInt(patientId),
      },
      select: {
        id: true,
        user_id: true,
      },
    });

    if (!patientFound) {
      throw new ResponseError(404, "Patient not found");
    }

    if (patientFound.user_id !== userId) {
      throw new ResponseError(400, "Patient cannot be deleted");
    }

    return prismaClient.patient.delete({
      where: {
        id: parseInt(patientId),
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        work: true,
        last_education: true,
        place_of_birth: true,
        date_of_birth: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const paginationService = async (page, limit, skip, query) => {
  try {
    const searchConditions = query
      ? {
          OR: [
            { name: { contains: query } },
            { work: { contains: query } },
            { last_education: { contains: query } },
            { place_of_birth: { contains: query } },
          ],
        }
      : {};

    const total = await prismaClient.patient.count({
      where: searchConditions,
    });

    const patient = await prismaClient.patient.findMany({
      where: searchConditions,
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
            { name: { contains: query } },
            { work: { contains: query } },
            { last_education: { contains: query } },
            { place_of_birth: { contains: query } },
          ],
        }
      : {};

    const whereConditions = {
      user_id: userId,
      ...searchConditions,
    };

    const total = await prismaClient.patient.count({
      where: whereConditions,
    });

    const patient = await prismaClient.patient.findMany({
      where: whereConditions,
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

export {
  createPatientService,
  getAllPatientService,
  searchPatientService,
  updatePatientService,
  getAllByUserIdService,
  deletePatientService,
  paginationService,
  paginationByUserService,
};
