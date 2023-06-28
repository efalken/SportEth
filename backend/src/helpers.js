import { PrismaClient } from "@prisma/client";
import { minBlock } from "./config";

const prisma = new PrismaClient();

export async function syncEventsTillNow(contract, type, filter, handler) {
  const lastSync = await prisma.blockchainSync.findFirst({
    where: { type },
    orderBy: { blockNumber: "desc" },
  });
  const lastBlock = lastSync?.blockNumber || minBlock;
  const emittedEvents = await contract.queryFilter(filter, lastBlock);
  for (const eventEmitted of emittedEvents) {
    await handler(eventEmitted);
  }
}

export async function checkAndCreateSync(
  blockNumber,
  transactionHash,
  transactionIndex,
  logIndex,
  type
) {
  const sync = await prisma.blockchainSync.findUnique({
    where: {
      blockNumber_transactionHash_transactionIndex_logIndex: {
        blockNumber,
        transactionHash,
        transactionIndex,
        logIndex,
      },
    },
  });
  if (sync) return false;

  await prisma.blockchainSync.create({
    data: {
      type,
      blockNumber,
      transactionHash,
      transactionIndex,
      logIndex,
    },
  });
  return true;
}
