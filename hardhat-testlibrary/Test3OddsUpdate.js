
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var receipt;
var gasUsed;
var result;
const {assert} = require('chai')
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

  describe("Preliminaries", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 560n*million);
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens(560n*million);
    });
  });

  describe("setupBets", async () => {
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
      var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
      result = await oracle.initPost(
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
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Send Initial Data", async () => {
      await oracle.initProcess();
      const betdata0 = await betting.betData(0);
      console.log(`betdata0 ${betdata0}`);
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend = ${gasUsed}`);
    });


    it("approve and send to betting contract", async () => {
       await betting.connect(owner).fundBook({
        value: 3n*eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account1).fundBettor({
        value: 1n*eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: 1n*eths,
      });
    });
  });

  describe("Send Bets, update Odds, send more bets", async () => {
    let contractHash1;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      result = await betting.connect(account1).bet(0, 0, "1000");
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
    });

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
      var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
    });

    it("send updated odds data", async () => {
      result = await oracle.updatePost(
        [
          800,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      const betdata0 = await betting.betData(0);
      console.log(`betdata pre ${betdata0}`);
      result = await oracle.updateProcess();
      const betdata2 = await betting.betData(0);
      console.log(`betdata post ${betdata2}`);
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
    });

    let contractHash2;
    it("bet on 0:0 after odds update", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`time is ${_timestamp}`);
      result12 = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result12.wait();
      contractHash2 = receipt.events[0].args.contractHash;
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
    });

    it("Check State Variables before Settle", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct1 = await betting.userBalance(account1.address);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct1 ${userBalanceAcct1}`);
      console.log(`acct3 ${userBalanceAcct2}`);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal ${ethbal}`);

      assert.equal(userBalanceAcct2, "9000", "Must be equal");
      assert.equal(userBalanceAcct2, "9000", "Must be equal");
      assert.equal(bookiePool, "30000", "Must be equal");
      assert.equal(bettorLocked, "2000", "Must be equal");
      assert.equal(bookieLocked, "1799", "Must be equal");
      assert.equal(oracleBal, "0.0", "Must be equal");
      assert.equal(ethbal, "5000.0", "Must be equal");
    });


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
      var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
    });

    it("Send Event Results", async () => {
      await oracle.settlePost([
        0,
        0,
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

    it("Approve results and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      const betdata0 = await betting.betData(0);
      console.log(`betdata preSettle ${betdata0}`);
      const betdata1 = await betting.betData(1);
      console.log(`betdata preSettle ${betdata1}`);
      await oracle.settleProcess();
    });

    it("bettorBalances", async () => {
      await betting.connect(account1).redeem(contractHash1);
      await betting.connect(account2).redeem(contractHash2);
    });

    it("Check State Variables in After Settle, Redemption", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct1 = await betting.userBalance(account1.address);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct1 ${userBalanceAcct1}`);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`margin2 ${bettorLocked}`);
      console.log(`margin1 ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal ${ethbal}`);

      assert.equal(userBalanceAcct1, "10949", "Must be equal");
      assert.equal(userBalanceAcct2, "10760", "Must be equal");
      assert.equal(bookiePool, "28201", "Must be equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(oracleBal, "8.995", "Must be equal");
      assert.equal(ethbal, "4991.005", "Must be equal");
    });
  });
});
