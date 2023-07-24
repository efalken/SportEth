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
var _date;
var _hour;
var tokens0;
var tokens1;
var tokens1;
var tokens2;
var tokens3;
var tokenstot;
var feepool;
var oracleBal;
var betEpoc;
var ethout8;
var ethout;
var tokensout;
var receipt;
var result;
const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const tenthEthInK = BigInt("1000");
//const tenthEthInK = BigInt("10000000000000");
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
    await token.setAdmin(oracle.address);
    [owner, account1, account2, account3, account4, account5, account6, _] =
      await ethers.getSigners();
  });

  describe("initial contract with one token owner", async () => {
    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 250n * million);
    });

    it("Deposit Tokens in Oracle Contract0", async () => {
      await oracle.depositTokens(250n * million);
    });

    it("transfer tokens to betting account", async () => {
      await token.transfer(betting.address, 250n * million);
    });
  });

  describe("initial contract with one token owner", async () => {
    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;

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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );

      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.initProcess();
      receipt = await result.wait();
    });

    it("Send  Bet #1", async () => {
      await betting.connect(account4).fundBook({
        value: 50n * eths,
      });
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();

      await betting.connect(account5).fundBettor({
        value: 50n * eths,
      });
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = nextStart + 7 * 86400;

      await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it("bump1", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.settleProcess();
      receipt = await result.wait();
      const epoch0 = await betting.params(0);
      console.log(`epoch , ${epoch0}`);
      moose = await oracle.moose();
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[0].args.etherChange,
        "finney"
      );
      console.log(`Account4 epoch ${epoch0} eth ${ethout}`);
    });
  });

  describe("Second epoch with two oracles", async () => {
    it("acct 1 send tokens to oracle", async () => {
      await token.transfer(account1.address, 150n * million);
      await token.connect(account1).approve(oracle.address, 150n * million);
      await oracle.connect(account1).depositTokens(150n * million);
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.initProcess();
    });

    it("Send  Bet #2", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      receipt = await result.wait();
      const odds = ethers.utils.formatUnits(
        receipt.events[0].args.payoff,
        "finney"
      );
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
      await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.settleProcess();
      moose = await oracle.moose();
      const epoch0 = await betting.params(0);
      const fee1 = await oracle.feeData(1);
      const fee0 = await oracle.feeData(0);
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();
      ethOut = ethers.utils.formatUnits(
        receipt.events[0].args.etherChange,
        "finney"
      );
      console.log(`Account4 epoch ${epoch0} eth ${ethOut}`);
      assert.equal(ethOut, "4.76", "Must be equal");
    });
  });

  describe("third epoch with three oracles", async () => {
    it("transfer tokens from account 2", async () => {
      const result0 = await token.transfer(account2.address, 100n * million);
      const receipt0 = await result0.wait();
      const result1 = await token
        .connect(account2)
        .approve(oracle.address, 100n * million);
      const receipt1 = await result1.wait();
      const result2 = await oracle
        .connect(account2)
        .depositTokens(100n * million);
      const receipt2 = await result2.wait();
      const gasUsed0 = receipt0.gasUsed;
      const gasUsed1 = receipt1.gasUsed;
      const gasUsed2 = receipt2.gasUsed;
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.initProcess();
    });

    it("bet again", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
      result = await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
    });

    it("bump settle", async () => {
      result = await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      receipt = await result.wait();
      result = await oracle.connect(account2).vote(true);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.settleProcess();
      const epoch0 = await betting.params(0);
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[0].args.etherChange,
        "finney"
      );
      console.log(`Account4 epoch ${epoch0} eth ${ethout}`);
      assert.equal(ethout, "7.4", "Must be equal");
    });
  });

  describe("fourth epoch with three oracles", async () => {
    it("post init", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account1).initProcess();
      const activeState = await oracle.reviewStatus();
    });

    it("first Check", async () => {
      const epoch0 = await betting.params(0);
      result = await oracle.withdrawTokens(50n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`account0 wd1 epoch ${epoch0} eth ${ethout}`);
      assert.equal(ethout, "205.75", "Must be equal");
    });

    it("bet and settle", async () => {
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
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
      await oracle.connect(account4).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account1).settleProcess();
      const epoch0 = await betting.params(0);
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[0].args.etherChange,
        "finney"
      );
      console.log(`Account4 epoch ${epoch0} eth ${ethout}`);
      assert.equal(ethout, "11.76", "Must be equal");
    });
  });

  describe("fifth epoch with 2 oracles", async () => {
    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      await oracle.connect(account1).vote(true);
      await oracle.connect(account4).vote(true);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.initProcess();
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      const epoch0 = await betting.params(0);
      result = await oracle.connect(account1).withdrawTokens(150n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`acct1 wd epoch ${epoch0}  eth ${ethout}`);
      assert.equal(ethout, "92.85", "Must be equal");
      result = await betting.connect(account5).bet(0, 0, 25n * tenthEthInK);
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
      result = await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account2).vote(true);
      await oracle.connect(account4).vote(true);
      result = await oracle.settleProcess();
      receipt = await result.wait();
      result = await oracle.connect(account4).tokenReward();
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[0].args.etherChange,
        "finney"
      );
      const epoch2 = await betting.params(0);
      console.log(`Account4 epoch ${epoch2} eth ${ethout}`);
      assert.equal(ethout, "21.04", "Must be equal");
    });
  });

  describe("sixth epoch with 2 oracles", async () => {
    it("post init", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp + 7 * 86400;
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
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.initProcess();
    });

    it("final", async () => {
      const epoch0 = await betting.params(0);
      result = await oracle.withdrawTokens(200n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`acct0 final wd epoch ${epoch0} eth ${ethout}`);
      assert.equal(ethout, "91.8", "Must be equal");
      tokensout = receipt.events[1].args.tokensChange;
      const result1 = await oracle.connect(account2).withdrawTokens(99999999);
      const receipt1 = await result1.wait();
      ethout = ethers.utils.formatUnits(
        receipt1.events[1].args.etherChange,
        "finney"
      );
      console.log(`account2 final epoch ${epoch0} eth ${ethout}`);
      assert.equal(ethout, "64.4", "Must be equal");
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log(`eth in Oracle Contract at end ${oracleBal}`);
      feePool = await oracle.feeData(0);
    });
  });
});
