const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset, _hourSolidity, _timestamp, nextStart, margin0, margin1;
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

const { assert } = require("chai");
const { expect } = require("chai");
require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");

    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      console.log(nextStart, "nextstart");
      console.log(`Oracle Address is ${oracle.address}`);
      await token.approve(oracle.address, 140n * million);
      await oracle.connect(owner).depositTokens(140n * million);
      result = await token.transfer(account1.address, 140n * million);
      result = await token
        .connect(account1)
        .approve(oracle.address, 140n * million);
      result = await oracle.connect(account1).depositTokens(140n * million);
    });
  });

  describe("set up contract for taking bets", async () => {
    it("send initial slate", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      _hourSolidity = Number(await oracle.hourOfDay());
      result = await oracle.settleRefreshPost(
        [
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
          "NFL:ARI:LAC",
          "MMA:Holloway:Kattar",
          "NFL:BAL:MIA",
          "NFL:BUF:MIN",
          "NFL:CAR:NE",
          "NFL:CHI:NO",
          "NFL:CIN:NYG",
          "NFL:CLE:NYJ",
          "NFL:DAL:OAK",
          "NFL:DEN:PHI",
          "NFL:DET:PIT",
          "NFL:GB:SEA",
          "NFL:HOU:SF",
          "NFL:IND:TB",
          "NFL:JAX:TEN",
          "NFL:KC:WSH",
          "MMA:Holloway:Kattar",
          "MMA:Ponzinibbio:Li",
          "MMA:Kelleher:Simon",
          "MMA:Hernandez:Vieria",
          "MMA:Akhemedov:Breese",
          "NCAAF: Mich: OhioState",
          "NCAAF: Minn : Illinois",
          "NCAAF: MiamiU: Florida",
          "NCAAF: USC: UCLA",
          "NCAAF: Alabama: Auburn",
          "NCAAF: ArizonaSt: UofAriz",
          "NCAAF: Georgia: Clemson",
          "NCAAF: PennState: Indiana",
          "NCAAF: Texas: TexasA&M",
          "NCAAF: Utah: BYU",
          "NCAAF: Rutgers: VirgTech",
        ],
        [
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
        ]
      );
    });

    it("fast forward 15 hours procVote", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).processVote();
    });

    it("Fund Contract", async () => {
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      result = await betting.connect(account2).fundBettor({
        value: 50n * eths,
      });
      result = await betting.connect(account3).fundBettor({
        value: 50n * eths,
      });
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0 is ${margin0}`);
      console.log(`margin1 is ${margin1}`);
      console.log(`acct1 is ${account1.address}`);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 999, 999, 999, 999, 999, 999, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
    });

    it("process", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 18);
      result = await oracle.processVote();
    });

    it("bets", async () => {
      margin0 = await betting.margin(0);
      console.log(`margin0 is ${margin0}`);
      //moose = await betting.moose();
      //await betting.connect(account2).bet(0, 0, "60062");
      //moose = await betting.moose();
      //console.log(`moose: ${moose} `);
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`freeCapital:${margin0 - margin1}`);

      await expect(betting.connect(account2).bet(0, 0, "60062")).to.be.reverted;
      result = await betting.connect(account2).bet(0, 0, "60061");

      result = await betting.connect(account3).bet(0, 1, "120000");

      const acct2Bal = (await betting.userStruct(account2.address)).userBalance;
      console.log(`acct2: ${acct2Bal} `);
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`freeCapital:${margin0 - margin1}`);
      const betData7a = await betting.betData(0);
      const stra = betData7a.toHexString(16).slice(2).padStart(64, "0");
      const piecesa = stra
        .toString(16)
        .match(/.{1,16}/g)
        .reverse();

      const bigIntsa = piecesa.map((s) => BigInt("0x" + s)).reverse();
      const numbersa = bigIntsa.map((bigInt) => bigInt.toString());
      console.log("LpExposure to 0-0", numbersa[2] - numbersa[1]);
      await expect(betting.connect(account2).bet(0, 0, "120122")).to.be
        .reverted;
      console.log(`margin0: ${margin0} margin1: ${margin1}`);
      result = await betting.connect(account2).bet(0, 0, "120121");
      result = await betting.connect(account2).bet(1, 0, "60061");
      result = await betting.connect(account2).bet(2, 0, "60061");
      await expect(betting.connect(account2).bet(3, 0, "60062")).to.be.reverted;
      result = await betting.connect(account2).bet(3, 0, "60061");
      result = await betting.connect(account2).bet(4, 0, "50062");
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`freeCapital:${margin0 - margin1}`);
      const betData7 = await betting.betData(5);
      const str = betData7.toHexString(16).slice(2).padStart(64, "0");
      const pieces = str
        .toString(16)
        .match(/.{1,16}/g)
        .reverse();

      const bigInts = pieces.map((s) => BigInt("0x" + s)).reverse();
      const numbers = bigInts.map((bigInt) => bigInt.toString());
      console.log("LpExposure to 0-1", numbers[2] - numbers[1]);
      result = await expect(betting.connect(account3).bet(5, 0, "10000")).to.be
        .reverted;

      margin0 = await betting.betData(0);
    });
  });
});
