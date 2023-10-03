-- CreateTable
CREATE TABLE IF NOT EXISTS "OracleResultsPostedEvent" (
    "blockNumber" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" INTEGER NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL,
    "propnum" INTEGER NOT NULL,
    "winner" VARCHAR(3000) NOT NULL,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OracleResultsPostedEvent_pkey" PRIMARY KEY ("blockNumber","transactionHash","transactionIndex","logIndex")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OracleDecOddsPostedEvent" (
    "blockNumber" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" INTEGER NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL,
    "propnum" INTEGER NOT NULL,
    "decOdds" VARCHAR(3000) NOT NULL,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OracleDecOddsPostedEvent_pkey" PRIMARY KEY ("blockNumber","transactionHash","transactionIndex","logIndex")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OracleStartTimesPostedEvent" (
    "blockNumber" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" INTEGER NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "propnum" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL,
    "starttimes" VARCHAR(3000) NOT NULL,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OracleStartTimesPostedEvent_pkey" PRIMARY KEY ("blockNumber","transactionHash","transactionIndex","logIndex")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OracleSchedulePostedEvent" (
    "blockNumber" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" INTEGER NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "propnum" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL,
    "sched" VARCHAR(3000) NOT NULL,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OracleSchedulePostedEvent_pkey" PRIMARY KEY ("blockNumber","transactionHash","transactionIndex","logIndex")
);
