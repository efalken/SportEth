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

      await token.approve(oracle.address, 140n * million);
      await oracle.depositTokens(140n * million);

      await token.transfer(account1.address, 150n * million);
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

    it("fail: post odds wrong hour", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      hourOffset += 6;
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
      await expect(
        oracle
          .connect(account1)
          .oddsPost([
            900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
            730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690,
            970, 760, 919, 720, 672, 800,
          ])
      ).to.be.reverted;
    });

    it("attempt to send odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await oracle
        .connect(account1)
        .oddsPost([
          900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
    });

    it("fail: odds need to be processed before settle post", async () => {
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
      result = await expect(
        oracle.settleRefreshPost(
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
        )
      ).to.be.reverted;
    });

    it("init post2", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
    });

    it("init post3", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 24 * 6);
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

    it("send odds", async () => {
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
    });

    it("fail: no betting before odds processed", async () => {
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      await expect(betting.connect(account2).bet(2, 0, "10000")).to.be.reverted;
    });

    it("process odds", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("bets valid, wd not after odds processed", async () => {
      result = await betting.connect(account2).bet(3, 0, "10000");
      result = await betting.connect(account2).bet(3, 1, "10000");
    });

    it("fail: settle post needs 48 hours after friday 10 pm GMT", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await expect(
        oracle.settleRefreshPost(
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
        )
      ).to.be.reverted;
      await helper.advanceTimeAndBlock(6 * 24 * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
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
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("fail: need odds, not settle post", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await expect(
        oracle
          .connect(account1)
          .settleRefreshPost(
            [
              1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
          )
      ).to.be.reverted;
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
          919, 720, 672, 800,
        ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      await helper.advanceTimeAndBlock(6 * 24 * secondsInHour);
    });

    it("fail: start times too early", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp;
      result = await expect(
        oracle.settleRefreshPost(
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
        )
      ).to.be.reverted;
    });

    it("fail: start times too far out", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 6 * 86400;
      result = await expect(
        oracle.settleRefreshPost(
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
        )
      ).to.be.reverted;
    });

    it("correct start times w/in 4 days", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 6 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp -
        ((_timestamp - 1687554000) % 604800) +
        604800 +
        3 * 86400 +
        43200;
      console.log("here100");
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

    it("fail: withdraw while bets active, ", async () => {
      result = await expect(betting.connect(account1).withdrawBook(20000)).to.be
        .reverted;
    });

    it("fail: withdraw tokens while betting active, ", async () => {
      result = await expect(oracle.connect(owner).withdrawTokens(1n * million))
        .to.be.reverted;
    });

    it("withdraw", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
      result = await betting.connect(account1).withdrawBook(10000);
      result = await betting.connect(account1).withdrawBook(10000);
      result = await betting.connect(account1).fundBook({
        value: 2n * eths,
      });
      result = await oracle.connect(owner).withdrawTokens(1n * million);
      await token.connect(owner).approve(oracle.address, 1n * million);
      result = await oracle.connect(owner).depositTokens(1n * million);
    });

    // it("fail: withdraw too soon", async () => {
    //   result = await expect(betting.connect(account1).withdrawBook(20000)).to.be
    //     .reverted;
    // });

    it("send odds, fail from vote", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          911, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          922, 777, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(account2).vote(false);
      result = await oracle.connect(owner).processVote();
    });

    it("send odds, fail from wrong account", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await expect(
        oracle
          .connect(account1)
          .oddsPost([
            911, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
            730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690,
            970, 760, 919, 720, 672, 800,
          ])
      ).to.be.reverted;
    });

    it("send odds again to send betting contract", async () => {
      console.log("line 1033");
      const probnum0 = (await oracle.adminStruct(owner.address)).probation;
      const probnum1 = await oracle.propNumber();
      console.log("prob0", probnum0);
      console.log("prob1", probnum1);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account2)
        .oddsPost([
          911, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      console.log("line 1043");
      receipt = await result.wait();
      result = await expect(
        oracle.oddsPost([
          1000, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ])
      ).to.be.reverted;
      console.log("line 1052");
      result = await expect(
        oracle.oddsPost([
          125, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ])
      ).to.be.reverted;
      console.log("line 1060");
      // await helper.advanceTimeAndBlock(3 * secondsInHour);
      result = await oracle
        .connect(account3)
        .oddsPost([
          922, 777, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
      const odds0 = await betting.odds(0);
      assert.equal(odds0, "9220", "mustBe equal");
    });
  });
});
