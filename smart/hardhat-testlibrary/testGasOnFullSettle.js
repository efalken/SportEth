const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset, _hourSolidity, _timestamp, nextStart, result, receipt, gasUsed;
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");
const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("BettingV4");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");

    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("run tx", async () => {
    it("create oracle accounts", async () => {
      await token.approve(oracle.address, 140n * million);
      await oracle.connect(owner).depositTokens(140n * million);
      result = await token.transfer(account1.address, 140n * million);
      result = await token
        .connect(account1)
        .approve(oracle.address, 140n * million);
      result = await oracle.connect(account1).depositTokens(140n * million);
    });

    it("send init", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
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
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("Fund Contract", async () => {
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbook  ${gasUsed}`);

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

    it("send odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          730, 690, 970, 760,
        ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();

      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend = ${gasUsed}`);
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
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet ${gasUsed}`);
      result = await betting.connect(account2).bet(5, 1, "10000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet 2 ${gasUsed}`);
      //await expect(betting.connect(account2).bet(31, 0, "10000")).to.be
      //  .reverted;

      // await helper.advanceTimeAndBlock(24 * 5 * secondsInHour);
    });

    it("Send Event Results to oracle", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 6 * 24) * secondsInHour);
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
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on settlePost ${gasUsed}`);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas settle Process ${gasUsed}`);
      result = await betting.connect(account2).redeem();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas redeem ${gasUsed}`);
    });

    it("send odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          730, 690, 970, 760,
        ]);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on oddsPost = ${gasUsed}`);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();

      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on Odds send = ${gasUsed}`);
    });
  });
});
