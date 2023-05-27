
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var nextStart;
var nextStart5;
const { assert } = require('chai');
const { expect } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory('Betting')
    const Token = await ethers.getContractFactory('Token')
    const Oracle = await ethers.getContractFactory('Oracle')
    const Reader = await ethers.getContractFactory('ReadSportEth')
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    reader = await Reader.deploy(betting.address, token.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  })

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 560n*million);
    });
    it("Deposit Tokens in Oracle Contract2", async () => {
      await oracle.connect(owner).depositTokens(560n*million);
    });
  });

  describe("set up contract for taking bets", async () => {
    it("send init", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
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
          999,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
    });

    it("approve and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();

      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("Fund Contract", async () => {
      //  console.log(`startTime is ${nextStart}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      //const checkO = await betting.matches[0](contractHash3);
      console.log(`currTime is ${_timestamp}`);
      //const startNow = await betting.startTime(0);
      //console.log(`startTime is ${startNow}`);
      await betting.fundBook({
        value: 1n*eths,
      });

      await betting.connect(account1).fundBettor({
        value: 1n*eths,
      });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
    });

    it("Send Initial Event Results", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    nextStart = _timestamp + 7 * 86400;
      await oracle.settlePost([
        1,
        1,
        0,
        2,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);
    });

    it("settle", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      const result2 = await oracle.settleProcess();
    });

    it("send new data", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
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
          "NHL:Pittsburgh:NYIslanders"
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
          nextStart
        ],
        [
          999,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
    });

    it("approve and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("Send Initial Event Results", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    nextStart = _timestamp + 7 * 86400;

      await oracle.settlePost([
        1,
        1,
        0,
        2,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]);
    });

    it("settle", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      const result2 = await oracle.settleProcess();
      const receipt = await result2.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on first settlement ${gasUsed}`);
    });
  });

  describe("send new data", async () => {
    it("checkHour", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    nextStart = _timestamp + 7 * 86400;

      nextStart0 = _timestamp + 86400;
      console.log(`Most startTimes are ${nextStart}`);
      console.log(`Match 5 startTime is ${nextStart0}`);
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
          "NHL:Pittsburgh:NYIslanders"
        ],
        [
          nextStart0,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart,
          nextStart
        ],
        [
          999,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
    });

    it("approve and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("bets", async () => {
      var result = await betting.connect(account1).bet(1, 0, "1000");
      var result = await betting.connect(account1).bet(2, 0, "1000");
      var result = await betting.connect(account1).bet(3, 0, "1000");
      var result = await betting.connect(account1).bet(4, 0, "1000");
    });

    it("Fail: Excess Amount Should Fail because max size is 2000 (10000/5), and the bet payout is > 2000 ", async () => {
      const result = await expect(betting.connect(account1).bet(5, 0, "2501")).to.be.reverted;
    });

    it("Test 1", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const betBal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");

      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracle ${oracleBal}`);
      console.log(`bet ${betBal}`);
      
            assert.equal(bookiePool, "10000", "mustBe equal");
            assert.equal(bettorLocked, "4000", "Must be equal");
            assert.equal(bookieLocked, "2776", "Must be equal");
            assert.equal(oracleBal, "0.0", "Must be equal");
            assert.equal(betBal, "2000.0", "Must be equal");
    });

    it("fail: attempt to withdraw 10001 too much", async () => {
      const ethout0 = await expect(betting.withdrawBook("8000")).to.be.reverted;
      const bookiePool = await betting.margin(0);
      const bookieLocked = await betting.margin(1);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bookieLocked ${bookieLocked}`);
    });

    it("withdrawal of 5000 should succeed", async () => {
      const ethout0 = await betting.withdrawBook("5000");
    });

    it("putting that 5000 back, should succeed", async () => {
      await betting.connect(account3).fundBook({
        value: 500n*finneys,
      });
    });

    it("Fail: funding after earliest start prohibited", async () => {
      await helper.advanceTimeAndBlock(2 * 86400);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`currTime is ${_timestamp}`);
      await expect(betting.fundBook({
        value: 3n*eths,
      })).to.be.reverted;
    });

    it("Fail: withdraw after earliest start prohibited", async () => {
      await expect(betting.withdrawBook(777)).to.be.reverted;
    });

    it("Fail:betting after match 0 that has started", async () => {
      await expect(betting.connect(account1).bet(0, 1, "1000")).to.be.reverted;
    });

    it("succeed: funding on match 5 which has not started", async () => {
      await betting.connect(account1).bet(5, 0, "1000");
    });
  });
});
