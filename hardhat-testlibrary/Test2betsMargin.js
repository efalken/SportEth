
const helper = require("../hardhat-helpers");
const time = require("@nomicfoundation/hardhat-network-helpers");
//import { time } from "@nomicfoundation/hardhat-network-helpers";
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _timestamp0;
var _date;
var _hour;
var hash1;
var hash2;
var hash3;
var hash4;
var hash5;
var hash6;
var hash7;
var hash8;
var hash9;
var hash10;
var hash11;
var hash12;
const {assert} = require("chai")
require("chai").use(require("chai-as-promised")).should();
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');


describe("Test2", function () {
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
    it("checkHour1", async () => {
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
     _hourSolidity = await reader.hourOfDay();
     console.log(`hour in EVM2 ${_hourSolidity}`);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
        var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);

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
       await betting.connect(owner).fundBook({
        value: 3n*eths,
      });

      await betting.connect(account2).fundBettor({
        value: 1n*eths,
      });
      await betting.connect(account3).fundBettor({
        value: 1n*eths,
      });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
    });

    it("bets", async () => {
      var result = await betting.connect(account2).bet(0, 0, "1000");
      var receipt = await result.wait();
      hash1 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(0, 1, "2000");
      receipt = await result.wait();
      hash2 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result.wait();
      hash3 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 0, "1000");
      receipt = await result.wait();
      hash4 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(1, 1, "2000");
      receipt = await result.wait();
      hash5 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 0, "1000");
      receipt = await result.wait();
      hash6 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "1000");
      receipt = await result.wait();
      hash7 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(2, 1, "2000");
      receipt = await result.wait();
      hash8 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "1000");
      receipt = await result.wait();
      hash9 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "1000");
      receipt = await result.wait();
      hash10 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "1000");
      receipt = await result.wait();
      hash11 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(3, 1, "1000");
      receipt = await result.wait();
      hash12 = receipt.events[0].args.contractHash;
    });

    it("Test 1", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal in finney ${ethbal}`);

      assert.equal(bookiePool, "30000", "mustBe equal");
      assert.equal(bettorLocked, "15000", "Must be equal");
      assert.equal(bookieLocked, "4458", "Must be equal");
      assert.equal(oracleBal, "0.0", "Must be equal");
      assert.equal(ethbal, "5000.0", "Must be equal");
    });

    it("checkHour2", async () => {
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
    });

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        0,
        0,
        2,
        1,
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

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("Final Redemptions/Balances", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingk balance ${ethbal}`);

      await betting.connect(account2).redeem(hash1);
      await betting.connect(account2).redeem(hash3);
      
      await betting.connect(account2).redeem(hash4);
      await betting.connect(account2).redeem(hash6);
      await betting.connect(account2).redeem(hash7);
      await betting.connect(account3).redeem(hash8);
      await betting.connect(account2).redeem(hash9);
      await betting.connect(account3).redeem(hash12);
      
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct2 ${userBalanceAcct2}`);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`acct3 ${userBalanceAcct3}`);
      
      assert.equal(bookiePool, "32106", "mustBe equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(oracleBal, "19.47", "Must be equal");
      assert.equal(ethbal, "4980.53", "Must be equal");
      assert.equal(userBalanceAcct2, "10748", "Must be equal");
      assert.equal(userBalanceAcct3, "6950", "Must be equal");
    });

  });
});
