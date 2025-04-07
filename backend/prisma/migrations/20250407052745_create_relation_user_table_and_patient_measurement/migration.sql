/*
  Warnings:

  - Added the required column `user_id` to the `patient_measurements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patient_measurements` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `patient_measurements` ADD CONSTRAINT `patient_measurements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
