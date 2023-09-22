const web3 = require("web3-utils");
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var result;
var receipt;
var gasUsed = 0;
var nextStart;
var gas0, gas1;
const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

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
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("run trans", async () => {
    it("New token balance 0", async () => {
      const tokBala = await token.balanceOf(owner.address);
      console.log(`tokenBal is ${tokBala}`);
    });

    it("transfer tokens to acct1", async () => {
      await token.transfer(account1.address, 80n * million);
      await token.transfer(account2.address, 60n * million);
      await token.approve(oracle.address, 140n * million);
      await token.connect(account1).approve(oracle.address, 80n * million);
      await token.connect(account2).approve(oracle.address, 60n * million);
      await oracle.depositTokens(140n * million);
      await oracle.connect(account1).depositTokens(80n * million);
      await oracle.connect(account2).depositTokens(60n * million);
    });

    it("token balances", async () => {
      const tokBal10 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      console.log(`tokBal10 ${tokBal10}`);
      const tokBal11 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account1.address)).tokens,
        "gwei"
      );
      const tokBal12 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account2.address)).tokens,
        "gwei"
      );
      const tokBal13 = ethers.utils.formatUnits(
        await token.balanceOf(oracle.address),
        "gwei"
      );

      console.log(`tokBal11 ${tokBal11}`);
      console.log(`tokBal12 ${tokBal12}`);
      console.log(`tokBal13 ${tokBal13}`);

      assert.equal(tokBal10, "0.14", "Must be equal");
      assert.equal(tokBal11, "0.08", "Must be equal");
      assert.equal(tokBal12, "0.06", "Must be equal");
      assert.equal(tokBal13, "0.28", "Must be equal");
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
    });

    it("vote succeeds", async () => {
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      const bettingStat = await betting.bettingStatus();
      assert.equal(bettingStat, "1", "Must be equal");
    });

    it("send odds data", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          800, 600, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      result = await oracle.connect(owner).vote(true);
      result = await oracle.connect(account2).vote(false);
    });

    it("show votes", async () => {
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Vote 1 ${yesvote}: No Vote 1 ${novote}`);
      assert.equal(yesvote, "220000000", "Must be equal");
      assert.equal(novote, "60000000", "Must be equal");
    });

    it("process vote, should send odds", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      receipt = await result.wait();
      const result2 = await betting.odds(1);
      assert.equal(result2, "6000", "Must be equal");
      const bettingStat = await betting.bettingStatus();
      assert.equal(bettingStat, "2", "Must be equal");
    });

    it("vote post fail", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 6 * 24) * secondsInHour);
      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      result = await oracle.connect(account1).vote(false);
      result = await oracle.connect(account2).vote(false);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);
      assert.equal(yesvote, "140000000", "Must be equal");
      assert.equal(novote, "140000000", "Must be equal");
      result = await oracle.processVote();
      receipt = await result.wait();
      const bettingStat = await betting.bettingStatus();
      assert.equal(bettingStat, "2", "Must be equal");
    });
  });
});
