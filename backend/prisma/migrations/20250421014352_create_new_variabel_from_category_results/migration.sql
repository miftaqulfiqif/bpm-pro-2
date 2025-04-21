/*
  Warnings:

  - Added the required column `is_age_required` to the `category_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category_results` ADD COLUMN `is_age_required` BOOLEAN NOT NULL;
