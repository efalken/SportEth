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
  gas3,
  margin0,
  margin1;
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
      await token.approve(oracle.address, 560n * million);
      await oracle.connect(owner).depositTokens(560n * million);
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
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas ${gasUsed}`);

      result = await betting.connect(account2).fundBettor({
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).fundBettor({
        value: 3n * eths,
      });
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0 is ${margin0}`);
      console.log(`margin1 is ${margin1}`);
      console.log(`acct1 is ${account1.address}`);
    });

    it("bets", async () => {
      await expect(betting.connect(account2).bet(0, 1, "7010")).to.be.reverted;
      receipt = await result.wait();

      result = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash1 = receipt.events[0].args.contractHash;
      // receipt = await result.wait();
      gas0 = receipt.gasUsed;
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);

      result = await betting.connect(account3).bet(0, 1, "2000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      // receipt = await result.wait();
      gas1 = receipt.gasUsed;
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);

      const acct2Bal = (await betting.userStruct(account2.address)).userBalance;
      console.log(`acct2: ${acct2Bal} `);

      await expect(betting.connect(account2).bet(0, 0, "7010")).to.be.reverted;
      receipt = await result.wait();
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);

      result = await betting.connect(account2).bet(0, 0, "7005");
      receipt = await result.wait();
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);
      // const betPayoff0 = await betting.moosev(0);
      // const netPosTeamBet0 = await betting.moosev(1);
      // const marginChange0 = await betting.moosev(2);
      // const netPosTeamOpp0 = await betting.moosev(3);
      // console.log(`betPayoff: ${betPayoff0} netPosTeamBet: ${netPosTeamBet0}`);
      // console.log(
      //   `marginChange: ${marginChange0} netPosTeamOpp: ${netPosTeamOpp0}`
      // );

      result = await betting.connect(account3).bet(0, 1, "10000");
      receipt = await result.wait();
      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);
      // const betPayoff = await betting.moosev(0);
      // const netPosTeamBet = await betting.moosev(1);
      // const marginChange = await betting.moosev(2);
      // const netPosTeamOpp = await betting.moosev(3);
      // console.log(`betPayoff: ${betPayoff} netPosTeamBet: ${netPosTeamBet}`);
      // console.log(
      //   `marginChange: ${marginChange} netPosTeamOpp: ${netPosTeamOpp}`
      // );
    });
  });
});
