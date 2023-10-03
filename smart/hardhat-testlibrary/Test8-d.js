const helper = require("../hardhat-helpers");
const { ethers } = require("hardhat");
var utils = require("ethers").utils;
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var nextStart = 1690025499;
var _timestamp;
var ethout;
var tokensout;
var receipt;
var result;
const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const tenthEthInK = BigInt("1000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting,
    oracle,
    token,
    owner,
    account1,
    account2,
    account3,
    account4,
    account5,
    account6;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");

    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, account4, account5, account6, _] =
      await ethers.getSigners();
  });

  describe("run trans", async () => {
    it("Deposit Tokens in Oracle Contract0", async () => {
      await token.approve(oracle.address, 110n * million);
      await oracle.depositTokens(110n * million);
      await token.transfer(betting.address, 600n * million);
      await token.transfer(account1.address, 125n * million);
      await token.connect(account1).approve(oracle.address, 125n * million);
      await oracle.connect(account1).depositTokens(125n * million);
    });

    it("initial contract with one token owner", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "NFL:ATL:LAR",
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
          "MMA:Memphis:Brooklyn",
          "MMA:Boston:Charlotte",
          "MMA:Milwaukee:Dallas",
          "MMA:miami:LALakers",
          "MMA:Atlanta:SanAntonia",
          "NHL:Colorado:Washington",
          "NHL:Vegas:StLouis",
          "NHL:TampaBay:Dallas",
          "NHL:Boston:Carolina",
          "NHL:Philadelphia:Edmonton",
          "NHL:Pittsburgh:NYIslanders",
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
      await betting.connect(account4).fundBook({
        value: 50n * eths,
      });

      await betting.connect(account5).fundBettor({
        value: 50n * eths,
      });
      receipt = await result.wait();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      result = await oracle.vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("Send  Bet #1", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
    });
  });

  describe("Second epoch with two oracles", async () => {
    it("take2", async () => {
      // await token.transfer(account1.address, 125n * million);
      // await token.connect(account1).approve(oracle.address, 125n * million);
      // await oracle.connect(account1).depositTokens(125n * million);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account1)
        .initPost(
          [
            "NFL:ARI:LAC",
            "NFL:ATL:LAR",
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
            "MMA:Memphis:Brooklyn",
            "MMA:Boston:Charlotte",
            "MMA:Milwaukee:Dallas",
            "MMA:miami:LALakers",
            "MMA:Atlanta:SanAntonia",
            "NHL:Colorado:Washington",
            "NHL:Vegas:StLouis",
            "NHL:TampaBay:Dallas",
            "NHL:Boston:Carolina",
            "NHL:Philadelphia:Edmonton",
            "NHL:Pittsburgh:NYIslanders",
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
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle.oddsPost([
        800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("Send  Bet #2", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      const odds = ethers.utils.formatUnits(
        receipt.events[0].args.payoff,
        "finney"
      );
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      await oracle
        .connect(account1)
        .settlePost([
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
      await oracle.connect(owner).vote(true);
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
    });
  });

  describe("third epoch with three oracles", async () => {
    it("take 3", async () => {
      const result0 = await token.transfer(account2.address, 100n * million);
      const receipt0 = await result0.wait();
      await token.connect(account2).approve(oracle.address, 100n * million);
      const result2 = await oracle
        .connect(account2)
        .depositTokens(100n * million);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "NFL:ATL:LAR",
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
          "MMA:Memphis:Brooklyn",
          "MMA:Boston:Charlotte",
          "MMA:Milwaukee:Dallas",
          "MMA:miami:LALakers",
          "MMA:Atlanta:SanAntonia",
          "NHL:Colorado:Washington",
          "NHL:Vegas:StLouis",
          "NHL:TampaBay:Dallas",
          "NHL:Boston:Carolina",
          "NHL:Philadelphia:Edmonton",
          "NHL:Pittsburgh:NYIslanders",
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
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(account1).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
      receipt = await result.wait();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("bet again", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      result = await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      result = await oracle.connect(account1).vote(true);
      receipt = await result.wait();
      result = await oracle.connect(account2).vote(true);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      receipt = await result.wait();
    });
  });

  describe("fourth epoch with three oracles", async () => {
    it("take 4", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account1)
        .initPost(
          [
            "NFL:ARI:LAC",
            "NFL:ATL:LAR",
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
            "MMA:Memphis:Brooklyn",
            "MMA:Boston:Charlotte",
            "MMA:Milwaukee:Dallas",
            "MMA:miami:LALakers",
            "MMA:Atlanta:SanAntonia",
            "NHL:Colorado:Washington",
            "NHL:Vegas:StLouis",
            "NHL:TampaBay:Dallas",
            "NHL:Boston:Carolina",
            "NHL:Philadelphia:Edmonton",
            "NHL:Pittsburgh:NYIslanders",
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
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();

      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle.oddsPost([
        800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await oracle.connect(account1).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      await token.approve(oracle.address, 40n * million);
      result = await oracle.depositTokens(40n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`account0 eth Out ${ethout}`);
      assert.equal(Number(ethout).toFixed(2), "126.45", "Must be equal");
    });

    it("bet and settle", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      await oracle
        .connect(account1)
        .settlePost([
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(account1).processVote();
    });
  });

  describe("fifth epoch with 2 oracles", async () => {
    it("take 5", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "NFL:ATL:LAR",
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
          "MMA:Memphis:Brooklyn",
          "MMA:Boston:Charlotte",
          "MMA:Milwaukee:Dallas",
          "MMA:miami:LALakers",
          "MMA:Atlanta:SanAntonia",
          "NHL:Colorado:Washington",
          "NHL:Vegas:StLouis",
          "NHL:TampaBay:Dallas",
          "NHL:Boston:Carolina",
          "NHL:Philadelphia:Edmonton",
          "NHL:Pittsburgh:NYIslanders",
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

      await oracle.connect(account1).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      receipt = await result.wait();
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      const totVotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`totVotes ${totVotes}`);
      const startProp = (await oracle.adminStruct(account1.address))
        .basePropNumber;
      console.log(`startprop ${startProp}`);
      const currProp = await oracle.propNumber();
      console.log(`currProp ${currProp}`);
      result = await oracle.connect(account1).withdrawTokens(125n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`acct1 wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(2), "139.09", "Must be equal");
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      result = await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(account2).vote(true);
      result = await oracle.processVote();
      receipt = await result.wait();
    });
  });

  describe("sixth epoch with 2 oracles", async () => {
    it("post init", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account2)
        .initPost(
          [
            "NFL:ARI:LAC",
            "NFL:ATL:LAR",
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
            "MMA:Memphis:Brooklyn",
            "MMA:Boston:Charlotte",
            "MMA:Milwaukee:Dallas",
            "MMA:miami:LALakers",
            "MMA:Atlanta:SanAntonia",
            "NHL:Colorado:Washington",
            "NHL:Vegas:StLouis",
            "NHL:TampaBay:Dallas",
            "NHL:Boston:Carolina",
            "NHL:Philadelphia:Edmonton",
            "NHL:Pittsburgh:NYIslanders",
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
      await oracle.connect(owner).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 22 - _hourSolidity;
      if (hourOffset < 0) hourOffset = 25;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle.oddsPost([
        800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("final", async () => {
      result = await oracle.withdrawTokens(100n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`acct0 final wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(2), "122.76", "Must be equal");
      const result1 = await oracle
        .connect(account2)
        .withdrawTokens(100n * million);
      const receipt1 = await result1.wait();
      ethout = ethers.utils.formatUnits(
        receipt1.events[1].args.etherChange,
        "finney"
      );
      console.log(`account2 wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(2), "111.69", "Must be equal");
    });
  });
});
7;