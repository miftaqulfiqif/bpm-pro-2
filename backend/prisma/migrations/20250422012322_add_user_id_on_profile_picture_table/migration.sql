/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `profile_pictures` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `profile_pictures` DROP FOREIGN KEY `profile_pictures_user_id_fkey`;

-- DropIndex
DROP INDEX `profile_pictures_user_id_fkey` ON `profile_pictures`;

-- CreateIndex
CREATE UNIQUE INDEX `profile_pictures_user_id_key` ON `profile_pictures`(`user_id`);

-- AddForeignKey
ALTER TABLE `profile_pictures` ADD CONSTRAINT `profile_pictures_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
