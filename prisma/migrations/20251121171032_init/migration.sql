-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `beds` INTEGER NOT NULL,
    `adults` INTEGER NOT NULL,
    `ac` ENUM('AC', 'NonAC') NOT NULL,
    `wifi` ENUM('YES', 'NO') NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `img1` LONGBLOB NULL,
    `img2` LONGBLOB NULL,
    `img3` LONGBLOB NULL,
    `img4` LONGBLOB NULL,
    `video` LONGBLOB NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `passportNumber` VARCHAR(191) NOT NULL,
    `nicNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `checkIn` DATETIME(3) NOT NULL,
    `checkOut` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtherDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `vehicleSupport` ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
    `meal` ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
    `guide` ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
    `vehicleType` ENUM('BIKE', 'CAR', 'VAN', 'SUV') NULL,
    `vehicleNumber` INTEGER NULL,
    `driver` ENUM('YES', 'NO') NULL,

    UNIQUE INDEX `OtherDetails_bookingId_key`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherDetails` ADD CONSTRAINT `OtherDetails_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
