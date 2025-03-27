/*
  Warnings:

  - You are about to drop the `CategoryResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "patient_measurements" DROP CONSTRAINT "patient_measurements_category_result_id_fkey";

-- DropTable
DROP TABLE "CategoryResult";

-- CreateTable
CREATE TABLE "category_results" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "min_systolic" INTEGER NOT NULL,
    "max_systolic" INTEGER NOT NULL,
    "min_diastolic" INTEGER NOT NULL,
    "max_diastolic" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "category_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patient_measurements" ADD CONSTRAINT "patient_measurements_category_result_id_fkey" FOREIGN KEY ("category_result_id") REFERENCES "category_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
