-- AlterTable
ALTER TABLE `category_results` MODIFY `max_age` INTEGER NULL DEFAULT 0,
    MODIFY `min_age` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `default_category_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(191) NOT NULL DEFAULT 'any',
    `color` VARCHAR(191) NOT NULL,
    `is_age_required` BOOLEAN NOT NULL,
    `min_age` INTEGER NULL DEFAULT 0,
    `max_age` INTEGER NULL DEFAULT 0,
    `min_systolic` INTEGER NOT NULL,
    `max_systolic` INTEGER NOT NULL,
    `min_diastolic` INTEGER NOT NULL,
    `max_diastolic` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `default_category_results_gender_min_age_max_age_min_systolic_key`(`gender`, `min_age`, `max_age`, `min_systolic`, `max_systolic`, `min_diastolic`, `max_diastolic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `default_category_results` ADD CONSTRAINT `default_category_results_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
