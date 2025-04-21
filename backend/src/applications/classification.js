import { prismaClient } from "./database.js";

/**
 *
 * @param {number} systolic - Tekanan darah sistolik
 * @param {number} diastolic - Tekanan darah diastolik
 * @param {string} patient_date_of_birth - Format: YYYY-MM-DD
 * @param {string} patient_gender - 'male' atau 'female'
 * @returns {Promise<{ name: string, color: string } | null>}
 */
export async function classifyBloodPressure(
  systolic,
  diastolic,
  patient_date_of_birth,
  patient_gender
) {
  const today = new Date();
  const birthDate = new Date(patient_date_of_birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  let categoryResults = await prismaClient.categoryResult.findMany({
    where: {
      OR: [{ gender: patient_gender }, { gender: "any" }],
    },
    orderBy: { id: "asc" },
  });

  if (categoryResults.length === 0) {
    categoryResults = await prismaClient.defaultCategoryResult.findMany({
      where: {
        OR: [{ gender: patient_gender }, { gender: "any" }],
      },
      orderBy: { id: "asc" },
    });
  }

  for (const result of categoryResults) {
    const systolicInRange =
      systolic >= result.min_systolic && systolic <= result.max_systolic;
    const diastolicInRange =
      diastolic >= result.min_diastolic && diastolic <= result.max_diastolic;

    const ageRequired = result.is_age_required ?? false;
    const ageMatch = ageRequired
      ? age >= (result.min_age ?? 0) && age <= (result.max_age ?? 0)
      : true;

    if (systolicInRange && diastolicInRange && ageMatch) {
      return {
        name: result.name,
        color: result.color,
      };
    }
  }

  return null;
}
