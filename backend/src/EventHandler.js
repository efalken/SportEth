import { minBlock, provider } from "./config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventHandler {
  constructor(contract, fields, table, eventName) {
    this.contract = contract;
    this.fields = fields;
    this.table = prisma[table];
    this.filter = contract.filters[eventName];
  }

  async syncEvent() {
    this.startListener();
    await this.syncEventTillNow();
  }

  startListener() {
    this.contract.on(this.filter, async (...args) => {
      const eventEmitted = args[args.length - 1];
      await this.addEvent(eventEmitted);
    });
  }

  async syncEventTillNow() {
    const lastEvent = await this.table.findFirst({
      orderBy: { blockNumber: "desc" },
    });
    const lastBlock = lastEvent?.blockNumber || minBlock;
    let startBlock = lastBlock;
    let tillBlock = Number(await provider.getBlockNumber());
    let blocks = tillBlock - startBlock;
    while (tillBlock >= startBlock) {
      try {
        const emittedEvents = await this.contract.queryFilter(
          this.filter,
          startBlock,
          Math.min(startBlock + blocks, tillBlock)
        );
        for (const eventEmitted of emittedEvents) {
          await this.addEvent(eventEmitted);
        }
        startBlock += blocks + 1;
      } catch (err) {
        blocks = Math.floor(blocks / 2);
      }
    }
  }

  async addEvent(event) {
    let { blockNumber, transactionHash, transactionIndex, index, log } = event;
    if (log) {
      blockNumber = log.blockNumber;
      transactionHash = log.transactionHash;
      transactionIndex = log.transactionIndex;
      index = log.index;
    }

    const data = this.parse(event);

    const oldEvent = await this.table.findUnique({
      where: {
        blockNumber_transactionHash_transactionIndex_logIndex: {
          blockNumber,
          transactionHash,
          transactionIndex,
          logIndex: index,
        },
      },
    });
    if (oldEvent) return;

    await this.table.create({ data });
  }

  parse(event) {
    let { blockNumber, transactionHash, transactionIndex, index, log, args } =
      event;
    if (log) {
      blockNumber = log.blockNumber;
      transactionHash = log.transactionHash;
      transactionIndex = log.transactionIndex;
      index = log.index;
    }

    const data = {
      blockNumber,
      transactionHash,
      transactionIndex,
      logIndex: index,
    };
    for (const [argName, fieldName, fieldType] of this.fields) {
      data[fieldName] = this.encodeField(fieldType, args[argName]);
    }
    return data;
  }

  encodeField(type, value) {
    if (type === "string") return value;
    if (type === "bigint") return value;
    if (type === "int") return Number(value);
    if (type === "int[]") {
      return value.map((el) => Number(el).toString()).join(",");
    }
    return value;
  }

  decodeField(type, value) {
    if (type === "int[]") {
      return value.split(",");
    }
    return value;
  }

  async getAllRouteHandler(req, res) {
    const fromBlock = Number(req.query.fromBlock || 0);
    const toBlock = Number(
      req.query.toBlock || (await provider.getBlockNumber())
    );

    let events = await this.table.findMany({
      where: { blockNumber: { gte: fromBlock, lte: toBlock } },
    });
    events = events.map((event) => {
      for (const [argName, fieldName, fieldType] of this.fields) {
        event[fieldName] = this.decodeField(fieldType, event[argName]);
      }
      return event;
    });
    res.json({ events });
  }
}
