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
    [owner, account1, account2, account3, account4, account5, account6, _] =
      await ethers.getSigners();
    oracle = await Oracle.deploy(
      betting.address,
      token.address,
      owner.address,
      account1.address,
      account2.address
    );
    await betting.setOracleAddress(oracle.address);
  });

  describe("run trans", async () => {
    it("Deposit Tokens in Oracle Contract0", async () => {
      await token.approve(oracle.address, 150n * million);
      await oracle.depositTokens(110n * million);
      await token.transfer(betting.address, 600n * million);
      await token.transfer(account1.address, 125n * million);
      await token.connect(account1).approve(oracle.address, 125n * million);
      await oracle.connect(account1).depositTokens(125n * million);
    });

    it("initial contract with one token owner", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      result = await oracle.connect(account1).vote(true);
      result = await oracle.processVote();
      await betting.connect(account4).fundBook({
        value: 50n * eths,
      });

      await betting.connect(account5).fundBettor({
        value: 50n * eths,
      });
      receipt = await result.wait();
      _hourSolidity = Number(await oracle.hourOfDay());
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          43, 43, 100, 77, 20, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.vote(true);
      result = await oracle.processVote();
    });

    it("Send  Bet #1", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      await oracle.connect(account1).vote(true);
      await oracle.processVote();
    });
  });

  describe("Second epoch with two oracles", async () => {
    it("take2", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          43, 43, 100, 77, 20, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.vote(true);
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
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      await oracle.connect(account1).vote(true);
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
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
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          43, 43, 100, 77, 20, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      result = await oracle.processVote();
    });

    it("bet again", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      result = await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.connect(account1).vote(true);
      receipt = await result.wait();
      result = await oracle.connect(account2).vote(true);
      receipt = await result.wait();
      result = await oracle.processVote();
      receipt = await result.wait();
      result = await oracle.depositTokens(40n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "ether"
      );
      console.log(`acct0 wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(3), "0.127", "Must be equal");
    });
  });

  describe("fourth epoch with three oracles", async () => {
    it("take 4", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          43, 43, 100, 77, 20, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).vote(true);
      await oracle.connect(account2).vote(true);
      result = await oracle.processVote();
    });

    it("bet and settle", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      await oracle.connect(account1).vote(true);
      await oracle.connect(account2).vote(true);
      await oracle.connect(account1).processVote();
      result = await oracle.connect(account1).withdrawTokens(125n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "ether"
      );
      console.log(`acct1 wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(3), "0.177", "Must be equal");
    });

    it("odds 5", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account2)
        .oddsPost([
          43, 43, 100, 77, 20, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.connect(owner).vote(true);
      result = await oracle.processVote();
    });
  });

  describe("fifth epoch with 2 oracles", async () => {
    it("take 5", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 8 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
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
      await oracle.connect(account2).vote(true);
      await oracle.processVote();
    });

    it("final", async () => {
      const totTok1 = (await oracle.adminStruct(account1.address)).tokens;
      console.log(`totTok1 ${totTok1}`);
      const totalTokens = await oracle.tokenRevTracker();
      console.log(`tokenRevTracker ${totalTokens}`);
      result = await oracle.connect(account2).withdrawTokens(100n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "ether"
      );
      assert.equal(Number(ethout).toFixed(3), "0.097", "Must be equal");
      console.log(`acct2 wd ${ethout}`);
      result = await oracle.withdrawTokens(150n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "ether"
      );
      console.log(`acct0 final wd ${ethout}`);
      assert.equal(Number(ethout).toFixed(3), "0.100", "Must be equal");
    });
  });
});
