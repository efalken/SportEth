
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
const { assert } = require('chai');

require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
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

  describe("Oracle", async () => {
    it("Authorize Oracle Token", async () => {
      await token.connect(owner).approve(oracle.address, "501");
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens("501");
    });
  });

  describe("set up contract for taking bets", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }

      var nextStart = _timestamp + 7 * 86400;
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
          827,
          955,
          1500,
          555,
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
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      await oracle.initProcess();
    });

    it("Fund Betting Contract", async () => {
      await betting.connect(owner).fundBook({
        value: "1000000000000000000",
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: "1000000000000000000",
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account3).fundBettor({
        value: "1000000000000000000",
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
      const result = await betting.connect(account3).bet(0, 0, "1000");
      const receipt = await result.wait();
      contractHash0 = receipt.events[0].args.contractHash;
    });

    let contractHash1;
    it("bet 10 on 0:1", async () => {
      const result2 = await betting.connect(account2).bet(0, 1, "1000");
      const receipt = await result2.wait();
      contractHash1 = receipt.events[0].args.contractHash;
    });

    let contractHash2;
    it("bet 10 on 2:1 (match 2: team 1)", async () => {
      const result = await betting.connect(account2).bet(2, 1, "1000");
      const receipt = await result.wait();
      contractHash2 = receipt.events[0].args.contractHash;
    });

    let contractHash3;
    let contractHash6;
    it("Offer Big Bets", async () => {
      const result3 = await betting.connect(account2).postBigBet(2, 0, 2001, 2111);
      let receipt = await result3.wait();
      contractHash3 = receipt.events[0].args.contractHash;
      const gasUsed = receipt.gasUsed;
      console.log(`gas on big bet ${gasUsed}`);
      const check0 = await betting.checkRedeem(contractHash3);
      const check1 = (await betting.betContracts(contractHash3)).betAmount;
      console.log(`checkOfferFn ${check0}`);
      console.log(`checkOfferGetter ${check1}`);
      const result6 = await betting.connect(account2).postBigBet(3, 0, 2002, 1955);
      receipt = await result6.wait();
      contractHash6 = receipt.events[0].args.contractHash;

      const check2 = await betting.checkRedeem(contractHash6);
      const check3 = (await betting.betContracts(contractHash6)).betAmount;
      console.log(`checkOfferFn2 ${check2}`);
      console.log(`checkOfferGetter3 ${check3}`);
    });

    let contractHash4;
    it("take above Big Bets", async () => {
      const result4 = await betting.connect(account3).takeBigBet(contractHash3);
      const result6 = await betting.connect(account3).takeBigBet(contractHash6);
      const receipt = await result4.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on taking big bet ${gasUsed}`);
      contractHash4 = receipt.events[1].args.contractHash;
      const pick2 = receipt.events[0].args.pick;
      console.log(`pick2 ${pick2}`);
      const pick3 = receipt.events[1].args.pick;
      console.log(`pick3 ${pick3}`);
    });

    let contractHash5;
    it("Offer Big Bet for 100 on 3:0", async () => {
      const result = await betting.connect(account2).postBigBet(3, 0, 3000, 2000);
      const receipt = await result.wait();
      const gasUsed = receipt.gasUsed;
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
      console.log(`acct3 ${userBalanceAcct3}`);
      assert.equal(bookiePool, "10000", "Must be equal");
      assert.equal(bettorLocked, "11137", "Must be equal");
      assert.equal(bookieLocked, "718", "Must be equal");
      assert.equal(userBalanceAcct2, "3997", "Must be equal");
      assert.equal(userBalanceAcct3, "4866", "Must be equal");

    });

    it("bumpTime", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86400);
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
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
    /*
        it("State Variables in Betting Contract after settle", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
          const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          const userBalanceAcct3 = await betting.userBalance(accounts[3]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);
          assert.equal(userBalanceAcct2, "5000", "Must be equal");
          assert.equal(userBalanceAcct3, "6000", "Must be equal");
          assert.equal(bookiePool, "8970", "Must be equal");
          assert.equal(bookieLocked, "0", "Must be equal");
          assert.equal(bettorLocked, "0", "Must be equal");
        });
    */
    it("redeem  regular bets  ", async () => {
      const result = await betting.connect(account2).redeem(contractHash1);
      const result2 = await betting.connect(account2).redeem(contractHash2);
      /*
      const userBalanceAcct2 = await betting.userBalance(accounts[2]);
      const userBalanceAcct3 = await betting.userBalance(accounts[3]);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`acct3 ${userBalanceAcct3}`);
      const gasUsed = result.receipt.gasUsed;
      console.log(`gas on redeem bet ${gasUsed}`);
      const result2 = await betting.redeem(contractHash2, 1021, {
        from: accounts[2],
      });
      const userBalanceAcct2b = await betting.userBalance(accounts[2]);
      const userBalanceAcct3b = await betting.userBalance(accounts[3]);
      console.log(`acct2b ${userBalanceAcct2b}`);
      console.log(`acct3b ${userBalanceAcct3b}`);
      */
    });

    it("redeem  Bigbets on 1:1 ", async () => {
      const result = await betting.connect(account3).redeem(contractHash4);
      const result2 = await betting.connect(account2).redeem(contractHash6);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      /*
      console.log(`acct2c ${userBalanceAcct2}`);
      console.log(`acct3c ${userBalanceAcct3}`);
      */
    });


    it("State Variables in Betting Contract after redemption from bettors", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const userBalanceAcct3 = await betting.userBalance(account3.address);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`acct3 ${userBalanceAcct3}`);
      assert.equal(bookiePool, "9282", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(userBalanceAcct2, "11445", "Must be equal");
      assert.equal(userBalanceAcct3, "8989", "Must be equal");
    });
  });
});
