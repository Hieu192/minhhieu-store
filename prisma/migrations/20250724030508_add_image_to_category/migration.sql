-- AlterTable
ALTER TABLE `category` ADD COLUMN `image` VARCHAR(255) NULL,
    ADD COLUMN `level` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `parentId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `category_parentId_idx` ON `category`(`parentId`);

-- CreateIndex
CREATE INDEX `category_level_idx` ON `category`(`level`);

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
