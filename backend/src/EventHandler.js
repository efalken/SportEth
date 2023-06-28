import { minBlock } from "./config";

export class EventHandler {
  constructor(contract, fields, table, eventName) {
    this.contract = contract;
    this.fields = fields;
    this.table = table;
    this.filter = contract.filters[eventName];
  }

  async syncEventTillNow() {
    const lastEvent = await this.table.findFirst({
      orderBy: { blockNumber: "desc" },
    });
    const lastBlock = lastEvent?.blockNumber || minBlock;
    const emittedEvents = await this.contract.queryFilter(
      this.filter,
      lastBlock
    );
    for (const eventEmitted of emittedEvents) {
      await this.addEvent(eventEmitted);
    }
  }

  async addEvent(event) {
    const { blockNumber, transactionHash, transactionIndex, logIndex, args } =
      event;
    const data = this.parse(event);

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
