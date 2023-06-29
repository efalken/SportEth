-- AlterTable
ALTER TABLE `OracleBetDataPostedEvent` MODIFY `oddsStart` VARCHAR(3000) NOT NULL;

-- AlterTable
ALTER TABLE `OracleDecOddsPostedEvent` MODIFY `decOdds` VARCHAR(3000) NOT NULL;

-- AlterTable
ALTER TABLE `OracleResultsPostedEvent` MODIFY `winner` VARCHAR(3000) NOT NULL;

-- AlterTable
ALTER TABLE `OracleSchedulePostedEvent` MODIFY `sched` VARCHAR(3000) NOT NULL;

-- AlterTable
ALTER TABLE `OracleStartTimesPostedEvent` MODIFY `starttimes` VARCHAR(3000) NOT NULL;
