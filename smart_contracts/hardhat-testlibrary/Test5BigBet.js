
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var result;
var receipt;
var gasUsed;
var contractHash3b;
var contractHash6b;
var contractHash3;
var contractHash6;
const { assert } = require('chai');
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');

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
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  })

  describe("Oracle", async () => {
    it("Authorize Oracle Token", async () => {
      await token.connect(owner).approve(oracle.address, 560n*million);
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens(560n*million);
    });
  });

  describe("set up contract for taking bets", async () => {
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

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      await oracle.initProcess();
    });

    it("Fund Betting Contract", async () => {
      await betting.connect(owner).fundBook({
        value: 1n*eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: 1n*eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account3).fundBettor({
        value: 1n*eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      const userBalanceAcct0 = (await betting.lpStruct(owner.address)).shares;
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`acct0 ${userBalanceAcct0}`);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`acct3 ${userBalanceAcct3}`);
    });
  });

  describe("Send  Bets", async () => {
    let contractHash0;

    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      result = await betting.connect(account3).bet(0, 0, "1000");
      receipt = await result.wait();
      contractHash0 = receipt.events[0].args.contractHash;
    });

    let contractHash1;
    it("bet 10 on 0:1", async () => {
      result = await betting.connect(account2).bet(0, 1, "1000");
      receipt = await result.wait();
      contractHash1 = receipt.events[0].args.contractHash;
    });

    let contractHash2;
    it("bet 10 on 2:1 (match 2: team 1)", async () => {
      result = await betting.connect(account2).bet(2, 1, "1000");
      receipt = await result.wait();
      contractHash2 = receipt.events[0].args.contractHash;
    });


    it("Offer Big Bets", async () => {
      result = await betting.connect(account2).postBigBet(2, 0, 2000, 2500);
      receipt = await result.wait();
      contractHash3 = receipt.events[0].args.contractHash;
      const check0 = await reader.checkRedeem(contractHash3);
      const check1 = (await betting.betContracts(contractHash3)).betAmount;
      console.log(`checkOfferFn ${check0}`);
      console.log(`checkOfferGetter ${check1}`);
      result = await betting.connect(account2).postBigBet(3, 0, 2000, 1955);
      receipt = await result.wait();
      contractHash6 = receipt.events[0].args.contractHash;
    });

    it("take above Big Bets", async () => {
      result = await betting.connect(account3).takeBigBet(contractHash3);
      receipt = await result.wait();
      contractHash3b = receipt.events[1].args.contractHash;

      result = await betting.connect(account3).takeBigBet(contractHash6);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on taking big bet ${gasUsed}`);
      contractHash6b = receipt.events[1].args.contractHash;
      
      const pick2 = receipt.events[0].args.pick;
      console.log(`pick2 ${pick2}`);
      const pick3 = receipt.events[1].args.pick;
      console.log(`pick3 ${pick3}`);
    });
    

    let contractHash5;
    it("Offer Big Bet for 100 on 3:0", async () => {
      result = await betting.connect(account2).postBigBet(3, 0, 3000, 2000);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on second offered big bet ${gasUsed}`);
      contractHash5 = receipt.events[0].args.contractHash;
    });

    it("State Variables in Betting Contract before settle", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`acct3 ${userBalanceAcct3}`);/*
      assert.equal(bookiePool, "10000", "Must be equal");
      assert.equal(bettorLocked, "12410", "Must be equal");
      assert.equal(bookieLocked, "718", "Must be equal");
      assert.equal(userBalanceAcct2, "3997", "Must be equal");
      assert.equal(userBalanceAcct3, "4866", "Must be equal");*/

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

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
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
      ]);
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("send result data to betting contract", async () => {
      await oracle.settleProcess();
    });
    
        it("State Variables in Betting Contract after settle", async () => {
          
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
          const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");

          const userBalanceAcct2 = await betting.userBalance(account2.address);
          const userBalanceAcct3 = await betting.userBalance(account3.address);
          
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);
          
          /*
          assert.equal(userBalanceAcct2, "5000", "Must be equal");
          assert.equal(userBalanceAcct3, "6000", "Must be equal");
          assert.equal(bookiePool, "8970", "Must be equal");
          assert.equal(bookieLocked, "0", "Must be equal");
          assert.equal(bettorLocked, "0", "Must be equal");*/
        });
    
    it("redeem  regular bets  ", async () => {
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      result = await betting.connect(account2).redeem(contractHash1);
      result = await betting.connect(account2).redeem(contractHash2);
      const userBalanceAcct2b = await betting.userBalance(account2.address);
      console.log(`acct2 regular change ${userBalanceAcct2b - userBalanceAcct2}`);
      console.log(`acct2 regular balance ${userBalanceAcct2b}`);
    });

    it("redeem  Bigbets on 1:1 ", async () => {
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      result = await betting.connect(account3).redeem(contractHash3b);
      result = await betting.connect(account2).redeem(contractHash6);
      const userBalanceAcct2b = await betting.userBalance(account2.address);
      const userBalanceAcct3b = await betting.userBalance(account3.address);
      console.log(`acct2 big ${userBalanceAcct2b - userBalanceAcct2}`);
      console.log(`acct3 big ${userBalanceAcct3b - userBalanceAcct3}`);
    });
    

    it("State Variables in Betting Contract after redemption from bettors", async () => {
      
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const bettingK = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct0 = await betting.userBalance(owner.address);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`acct2 final Balance ${userBalanceAcct2}`);
      console.log(`acct3 final balance ${userBalanceAcct3}`);
      console.log(`oracleK final balance ${oracleBal}`);
      console.log(`bettingK final balance ${bettingK}`);
      assert.equal(bookiePool, "8273", "Must be equal");
      assert.equal(oracleBal, "33.185", "Must be equal");
      assert.equal(bettingK, "2966.815", "Must be equal");
      assert.equal(userBalanceAcct2, "12404", "Must be equal");
      assert.equal(userBalanceAcct3, "8990", "Must be equal");
    });
    
  });
});
