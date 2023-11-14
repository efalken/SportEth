-- CreateTable
CREATE TABLE `OracleResultsPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `winner` VARCHAR(3000) NOT NULL,
    `manualEntry` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleDecOddsPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `probSpread` VARCHAR(3000) NOT NULL,
    `manualEntry` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleStartTimesPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `starttimes` VARCHAR(3000) NOT NULL,
    `manualEntry` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleSchedulePostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `sched` VARCHAR(3000) NOT NULL,
    `manualEntry` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
