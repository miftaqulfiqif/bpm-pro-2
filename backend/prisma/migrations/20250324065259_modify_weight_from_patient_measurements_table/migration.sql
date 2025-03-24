/*
  Warnings:

  - Changed the type of `weight` on the `patient_measurements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "patient_measurements" DROP COLUMN "weight",
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
