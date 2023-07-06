import { ethers } from "ethers";
import { minBlock, provider } from "./config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventHandler {
  constructor(contract, fields, table, eventName) {
    this.contract = contract;
    this.fields = fields;
    this.table = prisma[table];
    this.filter = contract.filters[eventName];
    this.topic = this.getTopic();
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
      where: { manualEntry: false },
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

  async addEvent(event, manualEntry = false) {
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
    if (oldEvent) {
      if (oldEvent.manualEntry && !manualEntry) {
        await this.table.update({
          where: {
            blockNumber_transactionHash_transactionIndex_logIndex: {
              blockNumber,
              transactionHash,
              transactionIndex,
              logIndex: index,
            },
          },
          data: {
            manualEntry,
          },
        });
      }
      return;
    }

    await this.table.create({ data: { ...data, manualEntry } });
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

  getAllRouteHandler(filters = []) {
    return async function (req, res) {
      const fromBlock = Number(req.query.fromBlock || 0);
      const toBlock = Number(
        req.query.toBlock || (await provider.getBlockNumber())
      );

      const filterObj = {};
      for (const filter of filters) {
        const type = this.fields.filter((field) => field[1] === filter)[0][2];
        filterObj[filter] = req.query[filter]
          ? this.encodeField(type, req.query[filter])
          : undefined;
      }

      let events = await this.table.findMany({
        where: { blockNumber: { gte: fromBlock, lte: toBlock }, ...filterObj },
      });
      events = events.map((event) => {
        for (const [_argName, fieldName, fieldType] of this.fields) {
          event[fieldName] = this.decodeField(fieldType, event[fieldName]);
        }
        return event;
      });
      res.json({ events });
    }.bind(this);
  }

  getTopic() {
    const { name, inputs } = this.filter.fragment;
    let eventSelector = `${name}(${inputs
      .map((input) => input.type)
      .join(",")})`;
    const topic = ethers.keccak256(ethers.toUtf8Bytes(eventSelector));
    return topic;
  }

  async syncEventsFromTransaction(transactionReceipt) {
    const logs = transactionReceipt.logs.filter(
      (log) =>
        log.address.toLowerCase() === this.contract.target.toLowerCase() &&
        log.topics[0] === this.topic
    );
    console.log(logs);
    for (const log of logs) {
      const eventEmitted = this.contract.interface.parseLog(log);
      log.args = eventEmitted.args;
      await this.addEvent(log, true);
    }
  }
}
