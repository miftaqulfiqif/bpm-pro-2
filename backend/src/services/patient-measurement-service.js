import { createValidation } from "../validation/patient-measurement-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../applications/database.js";
import { classifyBloodPressure } from "../applications/classification.js";

const createService = async (body) => {
  try {
    const data = validate(createValidation, body);

    const category = await classifyBloodPressure(data.systolic, data.diastolic);

    return await prismaClient.patientMeasurement.create({
      data: {
        patient_id: data.patient_id,
        last_measurement: data.last_measurement,
        weight: data.weight,
        systolic: data.systolic,
        diastolic: data.diastolic,
        mean: data.mean,
        heart_rate: data.heart_rate,
        category_result: category,
      },
    });
  } catch (error) {
    throw error;
  }
};

export { createService };
