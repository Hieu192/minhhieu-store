/*
  Warnings:

  - Made the column `image` on table `category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `image` VARCHAR(255) NOT NULL;
