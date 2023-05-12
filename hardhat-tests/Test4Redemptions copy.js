
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var account2eo;
var redeemCheck;
var redeemCheckb;

//boolean redeem2;

const {assert} = require('chai');
const { expect } = require("chai");
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
    reader = await Reader.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  })

  describe("Oracle", async () => {
    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, "560");
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens("560");
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
          1000,
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

      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      await oracle.initProcess();
    });

    it("Fund Betting Contract", async () => {
       await betting.connect(owner).fundBook({
        value: "3000000000000000000",
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: "300000000000000000",
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account3).fundBettor({
        value: "300000000000000000",
      });
    });
  });

  describe("Send  Bets", async () => {
    let contractHash0;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      const result = await betting.connect(account3).bet(0, 0, "1000");
      const receipt = await result.wait()
      contractHash0 = receipt.events[0].args.contractHash;
      const gasUsed = receipt.gasUsed;
      console.log(`gas on initial bet ${gasUsed}`);
      const result2 = await betting.connect(account3).bet(3, 0, "1000");
      const result3 = await betting.connect(account3).bet(3, 1, "1000");
    });

    let contractHash1;
    let contractHash1b;    
    it("bet 10 on 0:1", async () => {
      const result2 = await betting.connect(account2).bet(0, 1, "1000");
      const receipt = await result2.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      const gasUsed4 = receipt.gasUsed;
      console.log(`gas on fourth bet ${gasUsed4}`);
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct2 balance after bet ${userBalanceAcct2}`);
      const result2b = await betting.connect(account2).bet(0, 0, "100");
      const receiptb = await result2b.wait();
      contractHash1b = receiptb.events[0].args.contractHash;
    });

    let contractHash21;
    it("bet 10 on 2:0 (match 2: team 1)", async () => {
      const result = await betting.connect(account2).bet(2, 1, "1000");
      const receipt = await result.wait();
      contractHash21 = receipt.events[0].args.contractHash;
    });

    it("State Variables in Betting Contract before settle", async () => {
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const bettingKethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingKethbal ${bettingKethbal}`);

    });

    it("bumpTime", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86400);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
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

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("send result data to betting contract", async () => {
      const result3 = await oracle.settleProcess();
      const receipt = await result3.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on Settlement ${gasUsed}`);
    });

    it("State Variables in Betting Contract after settle", async () => {
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const bettingKethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingKethbal ${bettingKethbal}`);

    });

    it("fail: redeem attempt for bet on 0:1 from wrong account", async () => {
      console.log(`XXXXXXXXXXXXXXXXXXXXXX`);
     // const result = await betting.connect(account3).redeem(contractHash1);
    redeemCheck = await reader.checkRedeem(contractHash1);
    redeemCheckb = await reader.checkRedeem(contractHash1b);
     //const redeem1b = await redeemCheck.wait();
      await expect(betting.connect(account3).redeem(contractHash1)).to.be.reverted;
      console.log(`redeem should succeed ${redeemCheck}`);
      console.log(`redeem should fail ${redeemCheckb}`);
    });

    it("redeem  bet on 0:1 ", async () => {
      const redeem2 = reader.checkRedeem(contractHash1);
      const result = await betting.connect(account2).redeem(contractHash1);
      console.log(`redeem should succeed ${redeem2}`);
      const receipt = await result.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on redeem ${gasUsed}`);
    });

    it("fail: redeem attempt for losing bet on 0:0", async () => {
     // const result = await betting.connect(account3).redeem(contractHash0);
      await expect(betting.connect(account3).redeem(contractHash0)).to.be.reverted;
    });

    it("fail: redeem bet on 0:1 second time", async () => {
     // const result = await betting.connect(account2).redeem(contractHash1);
      await expect(betting.connect(account2).redeem(contractHash1)).to.be.reverted;
    });

    it("redeem  bet on 2:1 ", async () => {
      const result = await betting.connect(account2).redeem(contractHash21);
    });

    it("State Variables in Betting Contract after redemption from bettors", async () => {
      const bettingKethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      account2eo = ethers.utils.formatUnits(await ethers.provider.getBalance(account2.address), "finney");
      console.log(`user2 contract balance ${userBalanceAcct2}`);
      console.log(`bettingKethbal ${bettingKethbal}`);
      console.log(`User2EOaccount ${account2eo}`);

    });

    it("State Variables in Betting Contract after Acct2 withdrawal", async () => {
      const playerbalance = await betting.userBalance(account2.address);
      const result = await betting.connect(account2).withdrawBettor(playerbalance);
      const tx = await ethers.provider.getTransaction(result.hash);
      const gasPrice = ethers.utils.formatUnits(tx.gasPrice, "finney");
      const receipt = await result.wait()
      const gasUsed = receipt.gasUsed;
      console.log(`gas Price (should be 200) = ${gasPrice}`);
      console.log(`gas on Withdraw = ${gasUsed}`);
      const oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const bettingKethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const userBalanceAcct2 = await betting.userBalance(account2.address);
      const Acct2EOaccount = ethers.utils.formatUnits(await ethers.provider.getBalance(account2.address), "finney");
      const Acct2Increase = Acct2EOaccount - account2eo;
      console.log(`acct2 ${userBalanceAcct2}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingKethbal ${bettingKethbal}`);
      console.log(`ethbalAcct2 ${Acct2EOaccount}`);
      console.log(`Account2 increase in account value ${Acct2Increase}`);

    });
  });
});
