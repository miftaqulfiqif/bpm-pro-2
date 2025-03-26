import { prismaClient } from "./database.js";

export async function classifyBloodPressure(systolic, diastolic) {
  const categoryResults = await prismaClient.categoryResult.findMany();

  let classification = "";

  for (const result of categoryResults) {
    if (
      systolic >= result.min_systolic &&
      systolic <= result.max_systolic &&
      diastolic >= result.min_diastolic &&
      diastolic <= result.max_diastolic
    ) {
      classification = result.name;
      break;
    }
  }

  // Pengkategorian Hard Code
  if (!classification) {
    if (systolic < 120 && diastolic < 80) {
      classification = "Normal";
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      classification = "Prehipertensi";
    } else if (
      (systolic >= 130 && systolic <= 139) ||
      (diastolic >= 80 && diastolic <= 89)
    ) {
      classification = "Hipertensi Tingkat 1";
    } else if (systolic >= 140 || diastolic >= 90) {
      classification = "Hipertensi Tingkat 2";
    } else if (systolic > 180 || diastolic > 120) {
      classification = "Krisis Hipertensi";
    }
  }

  return classification;
}
