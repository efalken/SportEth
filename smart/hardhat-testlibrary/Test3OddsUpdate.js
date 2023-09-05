const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var receipt;
var gasUsed;
var result;
var nextStart;
const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

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
    await token.setAdmin(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("Preliminaries", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 140n * million);
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens(140n * million);
    });
  });

  describe("setupBets", async () => {
    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      console.log(`nextStart is ${nextStart}`);
      console.log(`timestamp is ${_timestamp}`);
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
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
      console.log(`time is ${_timestamp}`);
      console.log(`nextStart is ${nextStart}`);
    });

    it("fast forward 12 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("Send Initial Data", async () => {
      await oracle.processVote();
      const betdata0 = await betting.betData(0);
      console.log(`betdata0 ${betdata0}`);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend = ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      await betting.connect(owner).fundBook({
        value: 10n * eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account1).fundBettor({
        value: 1n * eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: 1n * eths,
      });
    });
  });

  describe("Send Bets, update Odds, send more bets", async () => {
    let contractHash1;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      result = await betting.connect(account1).bet(0, 0, "10000");
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
    });

    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      const odds0 = await betting.odds(0);
      console.log(`odds0 ${odds0}`);
    });

    it("send updated odds data", async () => {
      result = await oracle.updatePost([
        800, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      gas0 = receipt.gasUsed;
    });

    it("fast forward 12 hours", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("approve and send to betting contract", async () => {
      result = await oracle.processVote();
      receipt = await result.wait();
      gas1 = receipt.gasUsed;
      const odds0 = await betting.odds(0);
      console.log(`odds0 ${odds0}`);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
    });

    let contractHash2;
    it("bet on 0:0 after odds update", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`time is ${_timestamp}`);
      console.log(`nextStart is ${nextStart}`);
      result12 = await betting.connect(account2).bet(0, 0, "10000");
      receipt = await result12.wait();
      contractHash2 = receipt.events[0].args.contractHash;
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
      await helper.advanceTimeAndBlock(24 * 7 * secondsInHour);
    });

    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`time is ${nextStart}`);
    });

    it("Send Event Results", async () => {
      await oracle.settlePost([
        0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it("Approve results and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
      await oracle.processVote();
    });

    it("bettorBalances", async () => {
      await betting.connect(account1).redeem();
      await betting.connect(account2).redeem();
    });

    it("Check State Variables in After Settle, Redemption", async () => {
      const bookiePool = Number(await betting.margin(0)) / 10000;
      const bettorLocked = Number(await betting.margin(2)) / 10000;
      const bookieLocked = Number(await betting.margin(1)) / 10000;
      const oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "ether"
      );
      const ethbal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(betting.address),
        "ether"
      );
      const userBalanceAcct1 =
        Number((await betting.userStruct(account1.address)).userBalance) /
        10000;
      const userBalanceAcct2 =
        Number((await betting.userStruct(account2.address)).userBalance) /
        10000;
      console.log(`acct1 ${userBalanceAcct1}`);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`margin2 ${bettorLocked}`);
      console.log(`margin1 ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal ${ethbal}`);

      assert.equal(Number(bookiePool).toFixed(3), "8.201", "mustBe equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(Number(oracleBal).toFixed(3), "0.090", "Must be equal");
      assert.equal(Number(ethbal).toFixed(3), "11.910", "Must be equal");
      assert.equal(
        Number(userBalanceAcct1).toFixed(3),
        "1.949",
        "Must be equal"
      );
      assert.equal(
        Number(userBalanceAcct2).toFixed(3),
        "1.760",
        "Must be equal"
      );

      console.log(`gas0 on updatepost ${gas0}`);
      console.log(`gas1 on processVote ${gas1}`);
    });
  });
});
