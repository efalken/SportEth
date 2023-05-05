
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
var gasUsed;
var receipt;
var result;
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {assert} = require('chai');

require("chai").use(require("chai-as-promised")).should();

describe("test1", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory('Betting')
    const Token = await ethers.getContractFactory('Token')
    const Oracle = await ethers.getContractFactory('Oracle')
    token = await Token.deploy(); 
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  })

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
      console.log(`betting Address is ${betting.address}`);
      console.log(`token Address is ${token.address}`);
      console.log(`first Address is ${owner.address}`);
    });

    it("Authorize Oracle Token", async () => {
      result = await token.connect(owner).approve(oracle.address, 56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
    });
    it("Deposit Tokens in Oracle Contract2", async () => {
      result = await oracle.connect(owner).depositTokens(56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
    });
  });
  

  describe("set up contract for taking bets", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      console.log(`time is ${_timestamp}`);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
        var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
      //var nextStart = firstStart;
      //console.log(`startTime is ${nextStart}`);
      //console.log(`time is ${_timestamp}`);
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
          1000,
          2000,
          500,
          1000,
          909,
          800,
          510,
          1240,
          1470,
          960,
          650,
          1330,
          970,
          730,
          1310,
          1040,
          520,
          1020,
          1470,
          1200,
          1080,
          820,
          770,
          790,
          730,
          690,
          970,
          760,
          1000,
          720,
          1360,
          800,
        ]
      );
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initsend ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      //await helper.advanceTimeAndBlock(secondsInHour * 6);
      result = await oracle.initProcess();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
    });

    it("Fund Contract", async () => {
      //  console.log(`startTime is ${nextStart}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;

      result = await betting.connect(owner).fundBook({
        value: "3000000000000000000",
      });
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundBook ${gasUsed}`);

      result = await betting.connect(account1).fundBettor({
        value: "1000000000000000000",
      });
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundBettor ${gasUsed}`);
      await betting.connect(account2).fundBettor({
        value: "1000000000000000000",
      });

    });

    it("bets", async () => {
      var result = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet1 ${gasUsed}`);
      hash1 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).bet(0, 1, "2000");
      receipt = await result.wait();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet2 ${gasUsed}`);
      hash2 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).bet(1, 1, "1500");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet3 ${gasUsed}`);
      hash3 = receipt.events[0].args.contractHash;
      
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
    });

    it("Send Event Results to oracle", async () => {
      result = await oracle.settlePost([
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
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on settleInit ${gasUsed}`);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      result = await oracle.settleProcess();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on settleProcess ${gasUsed}`);
    });

    it("redemptions", async () => {
      result = await betting.connect(account1).redeem(hash1);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on redeem1 ${gasUsed}`);
      result = await betting.connect(account1).redeem(hash2);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on redeem2 ${gasUsed}`);
      result = await betting.connect(account1).redeem(hash3);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on redeem3 ${gasUsed}`);
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
      const userBalanceAcct0 = await betting.userBalance(owner.address);
      console.log(`acct0 ${userBalanceAcct0}`);
      const userBalanceAcct2 = await betting.userBalance(account1.address);
      console.log(`acct1 ${userBalanceAcct2}`);
      const userBalanceAcct3 = await betting.userBalance(account2.address);
      console.log(`acct2 ${userBalanceAcct3}`);
    });
    
  });
  

});
