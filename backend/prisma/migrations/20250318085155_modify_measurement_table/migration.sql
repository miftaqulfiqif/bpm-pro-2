/*
  Warnings:

  - The primary key for the `measurements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `measurements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `measurements` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `measurements` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `measurements_user_id_key` ON `measurements`(`user_id`);
