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

const searchPatientService = async (query) => {
  try {
    if (!query) {
      throw new ResponseError(400, "Query is required");
    }
    if (!query || typeof query !== "string") {
      return []; // Jika query kosong atau bukan string, kembalikan array kosong
    }

    return await prismaClient.patient.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 10, // Batasi hasil pencarian maksimal 10 data
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    throw new Error("Gagal mencari pasien");
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

export {
  createPatientService,
  getAllPatientService,
  searchPatientService,
  updatePatientService,
};
