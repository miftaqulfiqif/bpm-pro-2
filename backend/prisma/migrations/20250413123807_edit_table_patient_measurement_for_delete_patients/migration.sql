-- DropForeignKey
ALTER TABLE `patient_measurements` DROP FOREIGN KEY `patient_measurements_patient_id_fkey`;

-- DropIndex
DROP INDEX `patient_measurements_patient_id_fkey` ON `patient_measurements`;

-- AddForeignKey
ALTER TABLE `patient_measurements` ADD CONSTRAINT `patient_measurements_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
