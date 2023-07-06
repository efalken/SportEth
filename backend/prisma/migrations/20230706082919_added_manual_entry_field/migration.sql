-- AlterTable
ALTER TABLE `BettingBetRecordEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BettingFundingEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BettingOfferRecordEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleBetDataPostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleDecOddsPostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleFundingEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleParamsPostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OraclePausePostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleResultsPostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleSchedulePostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleStartTimesPostedEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OracleVoteOutcomeEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `TokenApprovalEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `TokenBurnEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `TokenMintEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `TokenTransferEvent` ADD COLUMN `manualEntry` BOOLEAN NOT NULL DEFAULT false;
