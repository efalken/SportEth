-- CreateTable
CREATE TABLE `TokenTransferEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `value` BIGINT NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TokenBurnEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `value` BIGINT NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TokenMintEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `value` BIGINT NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TokenApprovalEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `spender` VARCHAR(191) NOT NULL,
    `value` BIGINT NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BettingBetRecordEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `bettor` VARCHAR(191) NOT NULL,
    `epoch` INTEGER NOT NULL,
    `matchNum` INTEGER NOT NULL,
    `pick` INTEGER NOT NULL,
    `betAmount` INTEGER NOT NULL,
    `payoff` INTEGER NOT NULL,
    `contractHash` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BettingOfferRecordEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `bettor` VARCHAR(191) NOT NULL,
    `epoch` INTEGER NOT NULL,
    `matchNum` INTEGER NOT NULL,
    `pick` INTEGER NOT NULL,
    `betAmount` INTEGER NOT NULL,
    `payoff` INTEGER NOT NULL,
    `contractHash` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BettingFundingEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `bettor` VARCHAR(191) NOT NULL,
    `epoch` INTEGER NOT NULL,
    `moveAmount` BIGINT NOT NULL,
    `action` INTEGER NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleResultsPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `winner` VARCHAR(191) NOT NULL,

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
    `decOdds` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleVoteOutcomeEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `voteResult` BOOLEAN NOT NULL,
    `yesvotes` INTEGER NOT NULL,
    `novotes` INTEGER NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleBetDataPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `epoch` INTEGER NOT NULL,
    `propnum` INTEGER NOT NULL,
    `oddsStart` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleParamsPostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `concLimit` INTEGER NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OraclePausePostedEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `pausedMatch1` INTEGER NOT NULL,
    `pausedMatch2` INTEGER NOT NULL,

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
    `starttimes` VARCHAR(191) NOT NULL,

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
    `sched` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OracleFundingEvent` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `tokensChange` BIGINT NOT NULL,
    `etherChange` BIGINT NOT NULL,
    `transactor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockchainSync` (
    `blockNumber` INTEGER NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `logIndex` INTEGER NOT NULL,
    `type` ENUM('TokenTransferFilter', 'TokenBurnFilter', 'TokenMintFilter', 'TokenApprovalFilter', 'BettingBetRecordFilter', 'BettingOfferRecordFilter', 'BettingFundingFilter', 'OracleResultsPostedFilter', 'OracleDecOddsPostedFilter', 'OracleVoteOutcomeFilter', 'OracleBetDataPostedFilter', 'OracleParamsPostedFilter', 'OraclePausePostedFilter', 'OracleStartTimesPostedFilter', 'OracleSchedulePostedFilter', 'OracleFundingFilter') NOT NULL,

    PRIMARY KEY (`blockNumber`, `transactionHash`, `transactionIndex`, `logIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
