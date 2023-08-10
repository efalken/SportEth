const helper = require("../smart/hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _timestamp0, diffTimeStamp, diffNextStart;
var nextStart;
var _date;
var _hour;
var result;
var receipt;
var token0,
  token1,
  token2,
  token0Pre,
  token1Pre,
  token2Pre,
  gas0,
  gas0b,
  gas1,
  gas1b,
  gas2,
  gas2b,
  gas3,
  gas3b,
  gas4,
  gas4b;
const firstStart = 1690659274;
const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

describe("test rewards 0", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");

    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    await token.setAdmin(oracle.address);

    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("week0", async () => {
    it("initial", async () => {
      await oracle.depositTokens(510n * million);
      await token.approve(oracle.address, 490n * million);
      await token.transfer(oracle.address, 490n * million);
      var tt = await oracle.rewardTokensLeft();
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });

    it("send data", async () => {
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
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gas0 = receipt.gasUsed;
    });

    it("process data", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gas1 = receipt.gasUsed;
      await betting.connect(owner).fundBook({
        value: 6n * eths,
      });
      result = await oracle.tokenReward();
      receipt = await result.wait();
      await betting.connect(account1).fundBook({
        value: 4n * eths,
      });
      receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      result = await betting.connect(account2).fundBettor({
        value: 10n * eths,
      });
      receipt = await result.wait();
      result = await betting.connect(account2).bet(0, 0, "5000");
      receipt = await result.wait();

      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });

    it("runWeek1", async () => {
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
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gas2 = receipt.gasUsed;
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gas3 = receipt.gasUsed;
    });

    it("state 2", async () => {
      result = await oracle.tokenReward();
      receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      token0Pre = token0;
      token1Pre = token1;
      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });
  });

  describe("Second Epoch", async () => {
    it("run week2", async () => {
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
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      result = await betting.connect(account2).bet(0, 0, "5000");
      receipt = await result.wait();
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
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);

      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.processVote();
    });

    it("state 3", async () => {
      result = await oracle.tokenReward();
      receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      token0Pre = token0;
      token1Pre = token1;
      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });
  });

  describe("Third Epoch", async () => {
    it("run week3", async () => {
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      //await helper.advanceTimeAndBlock(6 * 86400);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _timestamp = (result = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber()
      )).timestamp;
      console.log(`timestamp0 ${_timestamp}`);
      nextStart = _timestamp - ((_timestamp - 1687564800) % 604800) + 7 * 86400;
      diffNextStart = nextStart - _timestamp;
      console.log(`nextStartDiff ${diffNextStart}`);
      _timestamp0 = _timestamp;
      _timestamp = (result = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber()
      )).timestamp;
      diffTimeStamp = _timestamp - _timestamp0;
      console.log(`timestampDiff ${diffTimeStamp}`);
      console.log(`nextStart ${nextStart}`);
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      _timestamp0 = _timestamp;
      _timestamp = (result = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber()
      )).timestamp;
      diffTimeStamp = _timestamp - _timestamp0;
      console.log(`timestampDiff ${diffTimeStamp}`);
      console.log(`timestamp2 ${_timestamp}`);
      console.log(`nextStart ${nextStart}`);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      _timestamp0 = _timestamp;
      _timestamp = (result = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber()
      )).timestamp;
      diffTimeStamp = _timestamp - _timestamp0;
      console.log(`timestampDiff ${diffTimeStamp}`);
      console.log(`timestamp ${_timestamp}`);
      console.log(`nextStart ${nextStart}`);

      console.log(`nextStart ${nextStart}`);

      result = await betting.connect(account2).bet(0, 0, "5000");
      receipt = await result.wait();
      result = await betting.withdrawBook(10000);
      receipt1 = await result.wait();
      result = await betting.connect(account1).withdrawBook(5000);
      receipt1 = await result.wait();
      _hourSolidity = await oracle.hourOfDay();
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);

      await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);

      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.processVote();
    });

    it("state 4", async () => {
      result = await oracle.tokenReward();
      receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      token0Pre = token0;
      token1Pre = token1;
      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });
  });

  describe("Fourth Epoch", async () => {
    it("run week4", async () => {
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
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gas0b = receipt.gasUsed;

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gas1b = receipt.gasUsed;
      result = await betting.connect(account2).fundBook({
        value: 2n * eths,
      });
      receipt = await result.wait();
      result = await oracle.connect(account2).tokenReward();
      receipt = await result.wait();
      result = await betting.connect(account2).bet(0, 0, "5000");
      receipt = await result.wait();
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
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gas2b = receipt.gasUsed;

      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      gas3b = receipt.gasUsed;
    });

    it("state 5", async () => {
      // result = await oracle.tokenReward();
      //  receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      result = await oracle.connect(account2).tokenReward();
      receipt = await result.wait();
      token0Pre = token0;
      token1Pre = token1;
      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      token2 = (await oracle.adminStruct(account2.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      const shares2 = (await betting.lpStruct(account2.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      console.log(`Acct2: Shares2 ${shares2} token2 ${token2}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );
    });
  });

  describe("Fifth Epoch", async () => {
    it("run week5", async () => {
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
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.processVote();
      receipt = await result.wait();
      result = await betting.connect(account2).bet(0, 0, "5000");
      receipt = await result.wait();
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
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);

      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.processVote();
    });

    it("state 5", async () => {
      const ce2 = await betting.margin(0);
      const ts2 = await betting.margin(3);
      console.log(`BettingK : shares ${ts2} eth ${ce2}`);
      const eoa0 = ethers.utils.formatUnits(
        await ethers.provider.getBalance(owner.address),
        "ether"
      );
      const eoa1 = ethers.utils.formatUnits(
        await ethers.provider.getBalance(account1.address),
        "ether"
      );
      const eoa2 = Number(
        ethers.utils.formatUnits(
          await ethers.provider.getBalance(account2.address),
          "ether"
        )
      );
      result = await oracle.tokenReward();
      receipt = await result.wait();
      result = await oracle.connect(account1).tokenReward();
      receipt = await result.wait();
      const gasPrice = result.gasPrice;
      console.log(`gasPrice ${gasPrice}`);
      gas4 = receipt.gasUsed;
      result = await oracle.connect(account2).tokenReward();
      receipt = await result.wait();
      gas4b = receipt.gasUsed;
      token0Pre = token0;
      token1Pre = token1;
      result = await betting.withdrawBook(50000);
      receipt1 = await result.wait();
      result = await betting.connect(account1).withdrawBook(35000);
      receipt1 = await result.wait();
      result = await betting.connect(account2).withdrawBook(17258);
      receipt1 = await result.wait();
      token0 = (await oracle.adminStruct(owner.address)).tokens;
      token1 = (await oracle.adminStruct(account1.address)).tokens;
      token2 = (await oracle.adminStruct(account2.address)).tokens;
      const tokensInOracle = await oracle.feeData(0);
      const ethPerToken = await oracle.feeData(1);
      const ethInOracle = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "gwei"
      );
      console.log(
        `Oracle K: tokens ${tokensInOracle} eth ${ethInOracle} eth/token ${ethPerToken}`
      );
      const shares0 = (await betting.lpStruct(owner.address)).shares;
      const shares1 = (await betting.lpStruct(account1.address)).shares;
      const shares2 = (await betting.lpStruct(account2.address)).shares;
      console.log(`Acct0: Shares0 ${shares0} token0 ${token0}`);
      console.log(`Acct1: Shares1 ${shares1} token1 ${token1}`);
      console.log(`Acct2: Shares2 ${shares2} token2 ${token2}`);
      var tt = Number(await oracle.rewardTokensLeft());
      console.log("total tokens in k", tt);
      const ce = await betting.margin(0);
      const ts = await betting.margin(3);
      console.log(`BettingK : shares ${ts} eth ${ce}`);
      const bkepoch = await betting.params(0);
      const okepoch = await oracle.betEpochOracle();
      const epoch0 = (await oracle.adminStruct(owner.address)).baseEpoch;
      const epoch1 = (await oracle.adminStruct(account1.address)).baseEpoch;
      console.log(
        `Epoch: owner ${epoch0} acct1 ${epoch1} kontract ${bkepoch} kontract ${okepoch}`
      );

      const eoa0b = ethers.utils.formatUnits(
        await ethers.provider.getBalance(owner.address),
        "ether"
      );
      const eoa1b = ethers.utils.formatUnits(
        await ethers.provider.getBalance(account1.address),
        "ether"
      );
      const eoa2b = Number(
        ethers.utils.formatUnits(
          await ethers.provider.getBalance(account2.address),
          "ether"
        )
      );
      console.log(
        `Epoch: owner ${eoa0b - eoa0} acct1 ${eoa1b - eoa1} acct2 ${
          eoa2b - eoa2
        }`
      );
      const bettingeth = ethers.utils.formatUnits(
        await ethers.provider.getBalance(betting.address),
        "ether"
      );
      console.log(`betting k eth ${bettingeth}`);
      console.log(`gas0 on init ${gas0} and  ${gas0b}`);
      console.log(`gas1 on processVote ${gas1} and  ${gas1b}`);
      console.log(`gas2 on settle ${gas2} and  ${gas2b}`);
      console.log(`gas3 on settle2 ${gas3} and  ${gas3b}`);
      console.log(`gas3 on tokenRewards ${gas4} and  ${gas4b}`);

      const ethRev0 = eoa0b - eoa0;
      const ethRev1 = eoa1b - eoa1;
      const ethRev2 = eoa2b - eoa2;
      console.log(`betting k eth0 ${Number(ethRev0).toFixed(3)}`);
      console.log(`betting k eth1 ${Number(ethRev1).toFixed(3)}`);
      console.log(`betting k eth2 ${Number(ethRev2).toFixed(3)}`);
      assert.equal(Number(ethRev0).toFixed(3), "6.283", "Must be equal");
      assert.equal(Number(ethRev1).toFixed(3), "4.398", "Must be equal");
      assert.equal(Number(ethRev2).toFixed(3), "2.169", "Must be equal");
      assert.equal(Number(token0).toFixed(0), "555543890", "Must be equal");
      assert.equal(Number(token1).toFixed(0), "37926154", "Must be equal");
      assert.equal(Number(token2).toFixed(0), "6750766", "Must be equal");
    });
  });
});
