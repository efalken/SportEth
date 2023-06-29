import { minBlock, provider } from "./config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventHandler {
  constructor(contract, fields, table, eventName) {
    this.contract = contract;
    this.fields = fields;
    this.table = prisma[table];
    this.filter = contract.filters[eventName];
    console.log(table);
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
    let tillBlock = await provider.getBlockNumber();
    let blocks = tillBlock - startBlock;
    while (tillBlock >= startBlock) {
      try {
        const emittedEvents = await this.contract.queryFilter(
          this.filter,
          startBlock,
          startBlock + blocks
        );
        for (const eventEmitted of emittedEvents) {
          await this.addEvent(eventEmitted);
        }
        startBlock += blocks;
      } catch (err) {
        blocks = Math.floor(blocks / 2);
      }
    }
  }

  async addEvent(event) {
    const { blockNumber, transactionHash, transactionIndex, logIndex, args } =
      event;
    const data = this.parse(event);
    console.log(event);
    console.log(data);

    const oldEvent = await this.table.findUnique({
      where: {
        blockNumber_transactionHash_transactionIndex_logIndex: {
          blockNumber,
          transactionHash,
          transactionIndex,
          logIndex,
        },
      },
    });
    if (oldEvent) return;

    await this.table.create({ data });
  }

  parse(event) {
    const { blockNumber, transactionHash, transactionIndex, logIndex, args } =
      event;
    const data = {
      blockNumber,
      transactionHash,
      transactionIndex,
      logIndex,
    };
    for (const [argName, fieldName, fieldType] of this.fields) {
      data[fieldName] = this.parseField(fieldType, args[argName]);
    }
    return data;
  }

  parseField(type, value) {
    if (type === "string") return value;
    if (type === "bigint") return value;
    if (type === "int") return Number(value);
    if (type === "int[]") {
      return value.map((el) => Number(el).toString()).join(",");
    }
    return value;
  }
}
