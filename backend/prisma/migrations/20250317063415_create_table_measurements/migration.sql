-- CreateTable
CREATE TABLE `measurements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(100) NOT NULL,
    `systolic` DOUBLE NOT NULL,
    `diastolic` DOUBLE NOT NULL,
    `mean` DOUBLE NOT NULL,
    `heartRate` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
