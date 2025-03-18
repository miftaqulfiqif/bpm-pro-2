/*
  Warnings:

  - You are about to alter the column `timestamp` on the `measurements` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `measurements` MODIFY `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
