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
      result = await expect(betting.connect(account1).withdrawBook(2n * eths))
        .to.be.reverted;
      result = await expect(oracle.connect(owner).withdrawTokens(1n * million))
        .to.be.reverted;
    });
  });

  describe("run start", async () => {
    it("init post", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      _hourSolidity = Number(await oracle.hourOfDay());
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

    it("fail: try to send too soon", async () => {
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
    });

    it("fast forward 15 hours procVote", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).processVote();
    });

    it("fail: post odds wrong hour", async () => {
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
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await oracle
        .connect(account1)
        .oddsPost([
          900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
    });

    it("odds need to be processed before settle post", async () => {
      await expect(
        oracle.settlePost([
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ])
      ).to.be.reverted;
    });

    it("no betting before odds processed", async () => {
      await expect(betting.connect(account2).bet(2, 0, "10000")).to.be.reverted;
    });

    it("bets valid, wd not after odds processed", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
      result = await betting.connect(account2).bet(3, 0, "10000");
      result = await betting.connect(account2).bet(3, 1, "10000");
    });

    it("settle post needs 48 hours after friday 10 pm GMT", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await expect(
        oracle.settlePost([
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ])
      ).to.be.reverted;
      await helper.advanceTimeAndBlock(9 * 24 * secondsInHour);
      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
    });

    it("fail: need init, not settle post", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await expect(
        oracle.settlePost([
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ])
      ).to.be.reverted;
    });

    it("fail: need init, not odds post", async () => {
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

    it("fail: start times too early", async () => {
      nextStart = _timestamp;
      result = await expect(
        oracle
          .connect(account1)
          .initPost(
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
        oracle
          .connect(account1)
          .initPost(
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
      result = await oracle
        .connect(account1)
        .initPost(
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

    it("bet and wd", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
    });

    it("init sent, but not odds, valid transactions", async () => {
      result = await expect(betting.connect(account2).bet(3, 1, "10000")).to.be
        .reverted;
      result = await betting.connect(account1).withdrawBook(10000);
      result = await betting.connect(account1).withdrawBook(10000);
      result = await betting.connect(account1).fundBook({
        value: 2n * eths,
      });
      result = await oracle.connect(owner).withdrawTokens(1n * million);
      await token.connect(owner).approve(oracle.address, 1n * million);
      result = await oracle.connect(owner).depositTokens(1n * million);

      result = await expect(betting.connect(account1).withdrawBook(20000)).to.be
        .reverted;
      result = await expect(oracle.connect(owner).withdrawTokens(1n * million))
        .to.be.reverted;
    });

    it("send odds to send betting contract", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _hourSolidity = Number(await oracle.hourOfDay());
      console.log("hour fail", _hourSolidity);
      result = await oracle.oddsPost([
        911, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);

      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(owner).processVote();
      const odds0 = await betting.odds(0);
      console.log("odds", odds0);
      result = await expect(betting.connect(account1).withdrawBook(2n * eths))
        .to.be.reverted;
      result = await betting.connect(account2).bet(3, 0, "10000");
    });
  });
});
