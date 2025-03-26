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
      classification = "Optimal";
    } else if (
      (systolic >= 120 && systolic <= 129) ||
      (diastolic >= 80 && diastolic <= 84)
    ) {
      classification = "Normal";
    } else if (
      (systolic >= 130 && systolic <= 139) ||
      (diastolic >= 85 && diastolic <= 89)
    ) {
      classification = "High Normal";
    } else if (systolic > 140 || diastolic > 90) {
      classification = "Hypertension";
    }
  }

  return classification;
}
