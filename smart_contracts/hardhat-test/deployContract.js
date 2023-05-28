
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
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
var result;
var receipt;
var gasUsed;
const finneys = BigInt('1000000000000000');
const {assert} = require('chai')
require("chai").use(require("chai-as-promised")).should();

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
    [owner, account1, _] = await ethers.getSigners();
  })

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Betting Address is ${betting.address}`);
      console.log(`Oracle Address is ${oracle.address}`);
      console.log(`Token Address is ${token.address}`);
      console.log(`ReadSportEth Address is ${reader.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, "560000000");
    });
    it("Deposit Tokens in Oracle Contract2", async () => {
      await oracle.connect(owner).depositTokens("560000000");
    });
  });

  describe("set up contract for taking bets", async () => {
    it("checkHour0", async () => {
    //   _hourSolidity = await reader.hourOfDay();
    //   console.log(`hour in EVM ${_hourSolidity}`);
    //   hourOffset = 0;
    //  if (_hourSolidity > 12) {
    //   hourOffset = 36 - _hourSolidity;
    //  } else if (_hourSolidity < 12) {
    //   hourOffset = 12 - _hourSolidity;
    //  }
    //  console.log(`hourAdj ${hourOffset}`);
    //  await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
    //  _hourSolidity = await reader.hourOfDay();
    //  console.log(`hour in EVM2 ${_hourSolidity}`);
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
        [999,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,]
      );
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initProcess = ${gasUsed}`);

    });

    it("approve and send to betting contract", async () => {
     // await helper.advanceTimeAndBlock(secondsInHour * 6);
      result = await oracle.initProcess();
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initProcess = ${gasUsed}`);

      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
      const tracker1 = await oracle.betEpochOracle();
      console.log(`tracker111 ${tracker1}`);
    });


    it("Fund Contract", async () => {
      //  console.log(`startTime is ${nextStart}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      //const checkO = await betting.matches[0](contractHash3);
      console.log(`currTime is ${_timestamp}`);
      //const startNow = await betting.startTime(0);
      //console.log(`startTime is ${startNow}`);
      result = await betting.connect(owner).fundBook({
        value: 30n*finneys,
      });
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);
      result = await betting.connect(account1).fundBettor({
        value: 30n*finneys,
      });
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);
      /*result = await betting.connect(account2).fundBettor({
        value: "10000000000000000",
      });
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);*/
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
      console.log(`owner is ${owner.address}`);
      console.log(`acct1 is ${account1.address}`);
      //console.log(`acct2 is ${account2.address}`);
    });

    it("bets", async () => {
      result = await betting.connect(account1).bet(0, 0, 20);
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on betting = ${gasUsed}`);
      /*
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
      */
    });
/*
    it("Test 1", async () => {
      const checkbet = await reader.checkSingleBet(hash1);
      const checkData = await reader.showBetData(0);
      const schedule = await oracle.matchSchedule(0);
      console.log(`BBBBBBBBBBBB`);
      console.log(checkbet);
      console.log(`BBBBBBBBBBBB`);
      console.log(checkData);
      console.log(`BBBBBBBBBBBB`);
      console.log(`sched ${schedule}`);
      console.log(`bookiePool ${checkData}`);
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
      assert.equal(bookieLocked, "4614", "Must be equal");
      assert.equal(oracleBal, "0.0", "Must be equal");
      assert.equal(ethbal, "5000.0", "Must be equal");
    });



    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date( _timestamp + offset);
      console.log(`ts0 = ${_timestamp}`);
      _hour = _date.getHours();
      console.log(`hour = ${_hour}`);
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      const tracker = await oracle.betEpochOracle();
      console.log(`tracker ${tracker}`);
    });
    

    it("Send Event Results to oracle", async () => {
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
    

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("Test 2", async () => {
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

    //  await betting.redeem(hash1, 1000, { from: accounts[2] });
      await betting.connect(account3).redeem(hash2);
    //  await betting.redeem(hash3, 1000, { from: accounts[2] });
    //  await betting.redeem(hash4, 1010, { from: accounts[2] });
      await betting.connect(account3).redeem(hash5);
    //  await betting.redeem(hash6, 1010, { from: accounts[2] });
      await betting.connect(account2).redeem(hash7);
    //  await betting.redeem(hash8, 1021, { from: accounts[3] });
      await betting.connect(account2).redeem(hash9);
      await betting.connect(account2).redeem(hash10);
      await betting.connect(account2).redeem(hash11);
      await betting.connect(account3).redeem(hash12);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct2 ${userBalanceAcct2}`);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`acct3 ${userBalanceAcct3}`);
      assert.equal(bookiePool, "32266", "mustBe equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(oracleBal, "18.67", "Must be equal");
      assert.equal(ethbal, "4981.33", "Must be equal");
      assert.equal(userBalanceAcct2, "6950", "Must be equal");
      assert.equal(userBalanceAcct3, "10597", "Must be equal");
    });
*/
  });
});
