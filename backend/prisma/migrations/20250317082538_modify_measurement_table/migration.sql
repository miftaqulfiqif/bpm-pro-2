/*
  Warnings:

  - You are about to drop the column `heartRate` on the `measurements` table. All the data in the column will be lost.
  - Added the required column `heart_rate` to the `measurements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `measurements` DROP COLUMN `heartRate`,
    ADD COLUMN `heart_rate` DOUBLE NOT NULL;
