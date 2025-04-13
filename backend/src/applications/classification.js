import { prismaClient } from "./database.js";

export async function classifyBloodPressure(
  systolic,
  diastolic,
  patient_date_of_birth,
  patient_gender
) {
  let classification = "Unknown";

  const today = new Date();
  const birthDate = new Date(patient_date_of_birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  let categoryResults = await prismaClient.categoryResult.findMany();

  if (categoryResults.length === 0) {
    categoryResults = [
      {
        name: "Normal",
        min_systolic: 90,
        max_systolic: 120,
        min_diastolic: 60,
        max_diastolic: 80,
        age_min: 18,
        age_max: 40,
        gender: "male",
      },
      {
        name: "Normal",
        min_systolic: 90,
        max_systolic: 125,
        min_diastolic: 60,
        max_diastolic: 80,
        age_min: 18,
        age_max: 40,
        gender: "female",
      },
      {
        name: "Elevated",
        min_systolic: 121,
        max_systolic: 129,
        min_diastolic: 60,
        max_diastolic: 80,
        age_min: 18,
        age_max: 60,
        gender: "male",
      },
      {
        name: "Hypertension Stage 1",
        min_systolic: 130,
        max_systolic: 139,
        min_diastolic: 80,
        max_diastolic: 89,
        age_min: 18,
        age_max: 60,
        gender: "any",
      },
      {
        name: "Hypertension Stage 2",
        min_systolic: 140,
        max_systolic: 180,
        min_diastolic: 90,
        max_diastolic: 120,
        age_min: 18,
        age_max: 100,
        gender: "any",
      },
    ];
  }

  for (const result of categoryResults) {
    const ageMatch = age >= result.age_min && age <= result.age_max;
    const genderMatch =
      result.gender === "any" || result.gender === patient_gender;

    if (
      systolic >= result.min_systolic &&
      systolic <= result.max_systolic &&
      diastolic >= result.min_diastolic &&
      diastolic <= result.max_diastolic &&
      ageMatch &&
      genderMatch
    ) {
      classification = result.name;
      break;
    }
  }

  return classification;
}
