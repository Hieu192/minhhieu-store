/*
  Warnings:

  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `attributes` JSON NULL,
    ADD COLUMN `badges` JSON NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `originalPrice` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
