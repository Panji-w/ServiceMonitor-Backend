-- CreateTable
CREATE TABLE `Monitor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(2048) NOT NULL,
    `intervalSeconds` INTEGER NOT NULL DEFAULT 60,
    `timeoutMs` INTEGER NOT NULL DEFAULT 10000,
    `status` ENUM('UP', 'DOWN', 'DEGRADED', 'PAUSED') NOT NULL DEFAULT 'DOWN',
    `consecutiveFails` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonitorCheck` (
    `id` VARCHAR(191) NOT NULL,
    `monitorId` VARCHAR(191) NOT NULL,
    `isUp` BOOLEAN NOT NULL,
    `statusCode` INTEGER NULL,
    `responseTime` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `checkedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MonitorCheck_monitorId_checkedAt_idx`(`monitorId`, `checkedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonitorCheck` ADD CONSTRAINT `MonitorCheck_monitorId_fkey` FOREIGN KEY (`monitorId`) REFERENCES `Monitor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
