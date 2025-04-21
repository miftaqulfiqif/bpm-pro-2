/*
  Warnings:

  - A unique constraint covering the columns `[gender,min_age,max_age,min_systolic,max_systolic,min_diastolic,max_diastolic]` on the table `category_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `category_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `category_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_age` to the `category_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_age` to the `category_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `category_results_description_key` ON `category_results`;

-- DropIndex
DROP INDEX `category_results_max_diastolic_key` ON `category_results`;

-- DropIndex
DROP INDEX `category_results_max_systolic_key` ON `category_results`;

-- DropIndex
DROP INDEX `category_results_min_diastolic_key` ON `category_results`;

-- DropIndex
DROP INDEX `category_results_min_systolic_key` ON `category_results`;

-- DropIndex
DROP INDEX `category_results_name_key` ON `category_results`;

-- AlterTable
ALTER TABLE `category_results` ADD COLUMN `color` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `max_age` INTEGER NOT NULL,
    ADD COLUMN `min_age` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `category_results_gender_min_age_max_age_min_systolic_max_sys_key` ON `category_results`(`gender`, `min_age`, `max_age`, `min_systolic`, `max_systolic`, `min_diastolic`, `max_diastolic`);
