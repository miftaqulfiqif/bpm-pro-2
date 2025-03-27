/*
  Warnings:

  - Added the required column `category_result_id` to the `patient_measurements` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `patients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "patient_measurements" ADD COLUMN     "category_result_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "CategoryResult" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "min_systolic" INTEGER NOT NULL,
    "max_systolic" INTEGER NOT NULL,
    "min_diastolic" INTEGER NOT NULL,
    "max_diastolic" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "CategoryResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patient_measurements" ADD CONSTRAINT "patient_measurements_category_result_id_fkey" FOREIGN KEY ("category_result_id") REFERENCES "CategoryResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
