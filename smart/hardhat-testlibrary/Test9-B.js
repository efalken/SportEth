const web3 = require("web3-utils");
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
var hourOffset;
var _hourSolidity;
var _timestamp;
var result;
var receipt;
var gasUsed;
var nextStart;
var gasUsed;

const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");
//const { expect } = require("chai");

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
    console.log(`oracle contract was deployed to ${oracle.address}`);
    console.log(`owner contract was deployed to ${owner.address}`);
    console.log(`account1 contract was deployed to ${account1.address}`);
  });

  describe("set up", async () => {
    it("New token balance", async () => {
      const tokBala = ethers.utils.formatUnits(
        await token.balanceOf(owner.address),
        "gwei"
      );

      await token.approve(oracle.address, 139n * million);
      await oracle.depositTokens(139n * million);

      await token.transfer(account1.address, 140n * million);
      await token.connect(account1).approve(oracle.address, 140n * million);
      await oracle.connect(account1).depositTokens(140n * million);

      await token.transfer(account2.address, 150n * million);
      await token.connect(account2).approve(oracle.address, 150n * million);
      await oracle.connect(account2).depositTokens(150n * million);

      await token.transfer(account3.address, 160n * million);
      await token.connect(account3).approve(oracle.address, 160n * million);
      await oracle.connect(account3).depositTokens(160n * million);

      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      result = await betting.connect(account1).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      result = await betting.connect(account2).fundBettor({
        value: 20n * eths,
      });
      receipt = await result.wait();
      result = await betting.connect(account3).fundBettor({
        value: 20n * eths,
      });
      receipt = await result.wait();
    });
  });

  describe("run start", async () => {
    // it("fail: withdraw too soon0", async () => {
    //   result = await expect(betting.connect(account1).withdrawBook(2n * eths))
    //     .to.be.reverted;
    // });

    it("fail: process vote with nothing to vote on", async () => {
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
    });

    it("init post", async () => {
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
    });

    it("fast forward 15 hours procVote", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).processVote();
    });

    it("fail:odds replaced", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _hourSolidity = await oracle.hourOfDay();
      console.log(_hourSolidity, "hour");
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      const revStat = await oracle.reviewStatus();
      console.log(revStat, "revStat");
      const proposer = await oracle.proposer();
      console.log(proposer, "proposer");
      const subnum = await oracle.subNumber();
      console.log(subnum, "subnum");
      result = await oracle
        .connect(account1)
        .oddsPost([
          800, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      odds0 = await oracle.propOdds(0);
      console.log("800", odds0);
      result = await oracle
        .connect(account1)
        .oddsPost([
          811, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      odds0 = await oracle.propOdds(0);
      console.log("811", odds0);
      result = await expect(
        oracle.oddsPost([
          822, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ])
      ).to.be.reverted;
      odds0 = await oracle.propOdds(0);
      console.log("811", odds0);
      //receipt = await result.wait();
      result = await oracle
        .connect(account2)
        .oddsPost([
          833, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      odds0 = await oracle.propOdds(0);
      console.log("833", odds0);
    });

    it("fail: post odds wrong hour", async () => {
      await helper.advanceTimeAndBlock(3 * secondsInHour);

      result = await oracle.connect(owner).vote(false);
      result = await oracle.connect(account3).vote(false);
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Vote 1 ${yesvote}: No Vote 1 ${novote}`);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _hourSolidity = await oracle.hourOfDay();
      console.log(_hourSolidity, "hour");
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      const revStat = await oracle.reviewStatus();
      console.log(revStat, "revStat");
      const proposer = await oracle.proposer();
      console.log(proposer, "proposer");
      const subnum = await oracle.subNumber();
      console.log(subnum, "subnum");

      result = await oracle
        .connect(account1)
        .oddsPost([
          900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      odds0 = await oracle.propOdds(0);
      console.log("900", odds0);
      const probnum0 = (await oracle.adminStruct(account2.address)).probation;
      const probnum1 = await oracle.propNumber();
      console.log("acct2", probnum0);
      console.log("epoch", probnum1);
      result = await expect(
        oracle
          .connect(account2)
          .oddsPost([
            922, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
            730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690,
            970, 760, 919, 720, 672, 800,
          ])
      ).to.be.reverted;
      odds0 = await oracle.propOdds(0);
      console.log("922", odds0);
      //receipt = await result.wait();
      result = await oracle
        .connect(account3)
        .oddsPost([
          933, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      odds0 = await oracle.propOdds(0);
      console.log("933", odds0);
    });
  });
});
