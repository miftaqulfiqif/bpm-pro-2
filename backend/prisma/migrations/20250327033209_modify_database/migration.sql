/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[min_systolic]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[max_systolic]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[min_diastolic]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[max_diastolic]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `category_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female');
ALTER TABLE "patients" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterTable
ALTER TABLE "category_results" ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "measurements" ALTER COLUMN "user_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "user_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "category_results_name_key" ON "category_results"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_results_min_systolic_key" ON "category_results"("min_systolic");

-- CreateIndex
CREATE UNIQUE INDEX "category_results_max_systolic_key" ON "category_results"("max_systolic");

-- CreateIndex
CREATE UNIQUE INDEX "category_results_min_diastolic_key" ON "category_results"("min_diastolic");

-- CreateIndex
CREATE UNIQUE INDEX "category_results_max_diastolic_key" ON "category_results"("max_diastolic");

-- CreateIndex
CREATE UNIQUE INDEX "category_results_description_key" ON "category_results"("description");

-- AddForeignKey
ALTER TABLE "category_results" ADD CONSTRAINT "category_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
