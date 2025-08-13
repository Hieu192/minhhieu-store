-- AlterTable
ALTER TABLE `news` ADD COLUMN `status` ENUM('Draft', 'Pending', 'Published', 'Archived') NOT NULL DEFAULT 'Published';

-- AlterTable
ALTER TABLE `product` ADD COLUMN `status` ENUM('Published', 'Draft', 'Archived') NOT NULL DEFAULT 'Published';
