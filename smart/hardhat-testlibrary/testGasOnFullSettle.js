const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset,
  _hourSolidity,
  _timestamp,
  nextStart,
  _date,
  _hour,
  hash1,
  hash2,
  hash3,
  hash4,
  hash5,
  hash6,
  hash7,
  hash8,
  hash9,
  hash10,
  hash11,
  hash12,
  result,
  receipt,
  gasUsed,
  gas0,
  gas1,
  gas2,
  gas3;
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");
const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

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
    await token.setAdmin(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      console.log(nextStart, "nextstart");
      console.log(`Oracle Address is ${oracle.address}`);
      await token.approve(oracle.address, 140n * million);
      await oracle.connect(owner).depositTokens(140n * million);
    });
  });

  describe("set up contract for taking bets", async () => {
    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;

      console.log(`time is ${nextStart}`);
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
        ],
        [
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend = ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas on secondSend = ${gasUsed}`);
      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("Fund Contract", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`currTime is ${_timestamp}`);
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas ${gasUsed}`);

      result = await betting.connect(account2).fundBettor({
        value: 35n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).fundBettor({
        value: 35n * eths,
      });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
      console.log(`acct1 is ${account1.address}`);
    });

    it("bets", async () => {
      result = await betting.connect(account2).bet(0, 0, "10000");
      result = await betting.connect(account3).bet(0, 1, "10000");
      result = await betting.connect(account2).bet(1, 0, "10000");
      result = await betting.connect(account3).bet(1, 1, "10000");
      result = await betting.connect(account2).bet(2, 0, "10000");
      result = await betting.connect(account3).bet(2, 1, "10000");
      result = await betting.connect(account2).bet(3, 0, "10000");
      result = await betting.connect(account3).bet(3, 1, "10000");
      result = await betting.connect(account2).bet(4, 0, "10000");
      result = await betting.connect(account3).bet(4, 1, "10000");
      result = await betting.connect(account2).bet(5, 0, "10000");
      result = await betting.connect(account3).bet(5, 1, "10000");
      result = await betting.connect(account2).bet(6, 0, "10000");
      result = await betting.connect(account3).bet(6, 1, "10000");
      result = await betting.connect(account2).bet(7, 0, "10000");
      result = await betting.connect(account3).bet(7, 1, "10000");
      result = await betting.connect(account2).bet(8, 0, "10000");
      result = await betting.connect(account3).bet(8, 1, "10000");
      result = await betting.connect(account2).bet(9, 0, "10000");
      result = await betting.connect(account3).bet(9, 1, "10000");

      result = await betting.connect(account2).bet(10, 0, "10000");
      result = await betting.connect(account3).bet(10, 1, "10000");
      result = await betting.connect(account2).bet(11, 0, "10000");
      result = await betting.connect(account3).bet(11, 1, "10000");
      result = await betting.connect(account2).bet(12, 0, "10000");
      result = await betting.connect(account3).bet(12, 1, "10000");
      result = await betting.connect(account2).bet(13, 0, "10000");
      result = await betting.connect(account3).bet(13, 1, "10000");
      result = await betting.connect(account2).bet(14, 0, "10000");
      result = await betting.connect(account3).bet(14, 1, "10000");
      result = await betting.connect(account2).bet(15, 0, "10000");
      result = await betting.connect(account3).bet(15, 1, "10000");
      result = await betting.connect(account2).bet(16, 0, "10000");
      result = await betting.connect(account3).bet(16, 1, "10000");
      result = await betting.connect(account2).bet(17, 0, "10000");
      result = await betting.connect(account3).bet(17, 1, "10000");
      result = await betting.connect(account2).bet(18, 0, "10000");
      result = await betting.connect(account3).bet(18, 1, "10000");
      result = await betting.connect(account2).bet(19, 0, "10000");
      result = await betting.connect(account3).bet(19, 1, "10000");

      result = await betting.connect(account2).bet(20, 0, "10000");
      result = await betting.connect(account3).bet(20, 1, "10000");
      result = await betting.connect(account2).bet(21, 0, "10000");
      result = await betting.connect(account3).bet(21, 1, "10000");
      result = await betting.connect(account2).bet(22, 0, "10000");
      result = await betting.connect(account3).bet(22, 1, "10000");
      result = await betting.connect(account2).bet(23, 0, "10000");
      result = await betting.connect(account3).bet(23, 1, "10000");
      result = await betting.connect(account2).bet(24, 0, "10000");
      result = await betting.connect(account3).bet(24, 1, "10000");
      result = await betting.connect(account2).bet(25, 0, "10000");
      result = await betting.connect(account3).bet(25, 1, "10000");
      result = await betting.connect(account2).bet(26, 0, "10000");
      result = await betting.connect(account3).bet(26, 1, "10000");
      result = await betting.connect(account2).bet(27, 0, "10000");
      result = await betting.connect(account3).bet(27, 1, "10000");
      result = await betting.connect(account2).bet(28, 0, "10000");
      result = await betting.connect(account3).bet(28, 1, "10000");
      result = await betting.connect(account2).bet(29, 0, "10000");
      result = await betting.connect(account3).bet(29, 1, "10000");
      result = await betting.connect(account2).bet(30, 0, "10000");
      result = await betting.connect(account3).bet(30, 1, "10000");
      result = await betting.connect(account2).bet(31, 0, "10000");
      result = await betting.connect(account3).bet(31, 1, "10000");
      await expect(betting.connect(account2).bet(31, 0, "10000")).to.be
        .reverted;

      // await helper.advanceTimeAndBlock(24 * 5 * secondsInHour);
    });

    it("checkHour", async () => {
      await helper.advanceTimeAndBlock(24 * 5 * secondsInHour);
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    });

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on settlePost ${gasUsed}`);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas settle Process ${gasUsed}`);
    });
  });
});
