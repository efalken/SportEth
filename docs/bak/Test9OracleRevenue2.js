const helper = require("../../smart/hardhat-helpers");
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
      // const _timestamp2 = (
      //   await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      // ).timestamp;
      // console.log(`timestamp2 ${_timestamp2}`);
      // const xx = await betting.params(3);
      // console.log(`nextStart ${nextStart}`);
      // console.log(`margin7 ${xx}`);
      // console.log(`margin7 ${_timestamp2 - xx}`);

      await betting.connect(account4).fundBook({
        value: 50n * eths,
      });

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
      await oracle.settleProcess();
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log(` oracle eth in finneys ${oracleBal}`);
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
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
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
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.settleProcess();
    });

    it("check 2", async () => {
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      feePool = await oracle.feeData(0);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
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
      // console.log(`gas on tokenTransfer0 ${gasUsed0}`);
      const gasUsed1 = receipt1.gasUsed;
      // console.log(`gas on tokenTransfer1 ${gasUsed1}`);
      const gasUsed2 = receipt2.gasUsed;
      // console.log(`gas on tokenTransfer2 ${gasUsed2}`);
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      // console.log(`hourAdj ${hourOffset}`);
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
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
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
      receipt = await result.wait();
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
      result = await oracle.connect(account2).vote(true);
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.settleProcess();
      receipt = await result.wait();
      moose = await oracle.moose();
      console.log(`moose, ${moose}`);
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
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account1).initProcess();
      const activeState = await oracle.reviewStatus();
      console.log(`reviewStatus, ${activeState}`);
    });

    it("first Check", async () => {
      const activeState = await oracle.reviewStatus();
      console.log(`activestate, ${activeState}`);
      const betepoch1 = await oracle.betEpochOracle();
      console.log(`betepoch, ${betepoch1}`);
      const initepoch1 = (await oracle.adminStruct(owner.address)).baseEpoch;
      console.log(`baseEpoch, ${initepoch1}`);
      const totvotes = (await oracle.adminStruct(owner.address)).totalVotes;
      console.log(`votes, ${totvotes}`);
      const ortokens = (await oracle.adminStruct(owner.address)).tokens;
      console.log(`tokens, ${ortokens}`);
      const fee0 = await oracle.feeData(0);
      console.log(`fee0, ${fee0}`);
      const fee1 = await oracle.feeData(1);
      console.log(`fee1, ${fee1}`);
      result = await oracle.depositTokens(50n * million);
      receipt = await result.wait();
      moose = await oracle.moose();
      console.log(`moose, ${moose}`);

      tokens0 = (await oracle.adminStruct(owner.address)).tokens;
      tokens1 = await token.balanceOf(owner.address);
      tokens2 = await token.balanceOf(oracle.address);
      // console.log(`acct0 tokens in userAcct, ${tokens0}`);
      // console.log(`acct0 tokens in EOA, ${tokens1}`);
      // console.log(`acct0 tokens in K, ${tokens2}`);
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`account0 eth Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log(`account0 eth Out ${ethout}`);
      assert.equal(ethout, "212.5", "Must be equal");
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
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account1).settleProcess();
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
      const totvotes = (await oracle.adminStruct(account1.address)).totalVotes;
      console.log(`acct1 votes, ${totvotes}`);
      await oracle.connect(account2).vote(true);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.initProcess();

      const activeState = await oracle.reviewStatus();
      const ortokens = (await oracle.adminStruct(account1.address)).tokens;
      console.log(`tokens, ${ortokens}`);
      const betepoch = await oracle.betEpochOracle();
      console.log(`betepoch, ${betepoch}`);
      const initepoch = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(`initepoch, ${initepoch}`);
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      feePool = await oracle.feeData(0);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
      result = await oracle.connect(account1).withdrawTokens(150n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      moose = await oracle.moose();
      console.log(`moose, ${moose}`);
      console.log(`acct1 Out ${ethout}`);
      assert.equal(ethout, "94.65", "Must be equal");
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`tokens Out1 ${tokensout}`);
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
      await oracle.settlePost([
        0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.connect(account2).vote(true);
      await oracle.settleProcess();
    });
  });

  describe("f6ithh epoch with 2 oracles", async () => {
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
      const betepoch = await oracle.betEpochOracle();
      console.log(`betepoch, ${betepoch}`);
      const initepoch = (await oracle.adminStruct(account2.address)).baseEpoch;
      console.log(`Acct2 baseEpoch, ${initepoch}`);
      const initfee = (await oracle.adminStruct(owner.address)).initFeePool;
      result = await oracle.withdrawTokens(200n * million);
      receipt = await result.wait();
      ethout = ethers.utils.formatUnits(
        receipt.events[1].args.etherChange,
        "finney"
      );
      console.log(`acct0 Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`tokens Out0 ${tokensout}`);
      assert.equal(ethout, "129.3", "Must be equal");
      //const betepoch = await oracle.betEpochOracle();
      // console.log(`betepoch, ${betepoch}`);
      //const initepoch = (await oracle.adminStruct(account2.address)).baseEpoch;
      // console.log(`Acct2 baseEpoch, ${betepoch - initepoch}`);
      const totvotes = (await oracle.adminStruct(account2.address)).totalVotes;
      // console.log(`Acct2 votes, ${totvotes}`);
      const ortokens = (await oracle.adminStruct(account2.address)).tokens;
      // console.log(`Acct2 tokens, ${ortokens}`);
      const ethbal1 = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log(`Oracle eth, ${ethbal1}`);
      const result1 = await oracle.connect(account2).withdrawTokens(99999999);
      const receipt1 = await result1.wait();
      const tx = await ethers.provider.getTransaction(result1.hash);
      const gasPrice = tx.gasPrice;
      const gasUsed = receipt1.gasUsed;
      console.log(`gas Price (should be 0) = ${gasPrice}`);
      console.log(`gas on Withdraw = ${gasUsed}`);
      const xx = gasPrice * gasUsed;
      const ethbal2 = ethers.utils.formatUnits(
        await ethers.provider.getBalance(account2.address),
        "finney"
      );
      const xx2 = ethers.utils.formatUnits(ethers.BigNumber.from(xx), "finney");
      console.log(`ethbal1 ${ethbal1}`);
      console.log(ethbal1);
      console.log(`ethbal2 ${ethbal2}`);
      var sum1 = Number(ethbal2) - Number(ethbal1) + Number(xx2);
      sum1 = Math.round(sum1 * 100) / 100;
      console.log(`eth sent to EOA ${sum1}`);
      ethout = ethers.utils.formatUnits(
        receipt1.events[1].args.etherChange,
        "finney"
      );
      console.log(`ether acct2 ${ethout}`);
      const tokensout1 = receipt1.events[1].args.tokensChange;
      console.log(`tokens Out2 ${tokensout1}`);
      assert.equal(ethout, "63.1", "Must be equal");
      oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      console.log(`eth in Oracle Contract at end ${oracleBal}`);
    });
  });
});
