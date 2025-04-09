import { prismaClient } from "./database.js";
import { logger } from "./logging.js";

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

  if (!classification) {
    classification = "Unknown";
  }

  return classification;
}
