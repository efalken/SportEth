const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset,
  _hourSolidity,
  _timestamp,
  nextStart,
  result,
  receipt,
  oracleBal,
  ethout,
  tokensout;

const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const fujiAdj = 10000;
var fujiAdjn = BigInt(fujiAdj);
var eths = 1000000000000000000n;
eths = eths / fujiAdjn;
const million = BigInt("1000000");

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("BettingFuji");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("OracleFuji");
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("run transactions", async () => {
    it("create oracle accounts", async () => {
      await token.approve(oracle.address, 140n * million);
      await oracle.connect(owner).depositTokens(140n * million);
      result = await token.transfer(account1.address, 140n * million);
      result = await token
        .connect(account1)
        .approve(oracle.address, 130n * million);
      result = await oracle.connect(account1).depositTokens(130n * million);
    });

    it("send init", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      result = await oracle.initPost(
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
      await oracle.connect(account1).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("Fund Contract", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      const ethcheck = 30n * eths;
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      result = await betting.connect(account2).fundBettor({
        value: 10n * eths,
      });
      result = await betting.connect(account3).fundBettor({
        value: 10n * eths,
      });
    });

    it("send odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      await oracle.vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("bets", async () => {
      result = await betting.connect(account2).bet(2, 0, "20000");
      result = await betting.connect(account3).bet(2, 1, "20000");
    });

    it("Send Event Results to oracle", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      await oracle.settlePost([
        1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      await oracle.connect(account1).vote(true);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
    });

    it("PostSettle", async () => {
      const fee0 = await oracle.totalTokens();
      const fee1 = await oracle.tokenRevTracker();
      console.log("fee0", fee0);
      console.log("fee1", fee1);
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log("oraclBal", oracleBal);

      result = await oracle.withdrawTokens(140n * million);
      receipt = await result.wait();
      ethout = receipt.events[1].args.etherChange;
      console.log(`account0 eth Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`account0 tokens Out ${tokensout}`);

      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log("oraclBal", oracleBal);

      result = await oracle.connect(account1).withdrawTokens(130n * million);
      receipt = await result.wait();
      ethout = receipt.events[1].args.etherChange;
      console.log(`account1 eth Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`account1 tokens Out ${tokensout}`);

      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log("oraclBal", oracleBal);
    });
  });
});
