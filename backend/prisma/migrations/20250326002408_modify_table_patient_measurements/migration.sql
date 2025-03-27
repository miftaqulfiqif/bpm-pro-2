/*
  Warnings:

  - You are about to drop the column `category_result_id` on the `patient_measurements` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "patient_measurements" DROP CONSTRAINT "patient_measurements_category_result_id_fkey";

-- AlterTable
ALTER TABLE "patient_measurements" DROP COLUMN "category_result_id",
ADD COLUMN     "category_result" TEXT;
