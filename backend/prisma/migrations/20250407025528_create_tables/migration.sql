-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(100) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(100) NOT NULL,
    `systolic` DOUBLE NOT NULL,
    `diastolic` DOUBLE NOT NULL,
    `mean` DOUBLE NOT NULL,
    `heart_rate` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `measurements_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `phone` INTEGER NOT NULL,
    `work` VARCHAR(50) NOT NULL,
    `last_education` VARCHAR(50) NOT NULL,
    `place_of_birth` VARCHAR(50) NOT NULL,
    `date_of_birth` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_measurements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `systolic` DOUBLE NOT NULL,
    `diastolic` DOUBLE NOT NULL,
    `mean` DOUBLE NOT NULL,
    `heart_rate` DOUBLE NOT NULL,
    `category_result` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `min_systolic` INTEGER NOT NULL,
    `max_systolic` INTEGER NOT NULL,
    `min_diastolic` INTEGER NOT NULL,
    `max_diastolic` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `category_results_name_key`(`name`),
    UNIQUE INDEX `category_results_min_systolic_key`(`min_systolic`),
    UNIQUE INDEX `category_results_max_systolic_key`(`max_systolic`),
    UNIQUE INDEX `category_results_min_diastolic_key`(`min_diastolic`),
    UNIQUE INDEX `category_results_max_diastolic_key`(`max_diastolic`),
    UNIQUE INDEX `category_results_description_key`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_measurements` ADD CONSTRAINT `patient_measurements_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_results` ADD CONSTRAINT `category_results_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
