
const web3 = require("web3-utils");
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
var gasUsed = 0;

const { assert } = require('chai');
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');
//const { expect } = require("chai");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

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
    it("New token balance", async () => {
      const tokBala = ethers.utils.formatUnits(
        await token.balanceOf(owner.address),
        "gwei"
      );
      console.log(`tokenBal is ${tokBala} 1e9`);
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
  });

  describe("TokenTransfer", async () => {
    it("New token balance 0", async () => {
      const tokBala = await token.balanceOf(owner.address);
      console.log(`tokenBal is ${tokBala}`);
    });

    it("transfer tokens to acct1", async () => {
      await token.transfer(account1.address, 250n*million);
      await token.transfer(account2.address, 150n*million);
      await token.approve(oracle.address, 400n*million);
      await token.connect(account1).approve(oracle.address, 250n*million);
      await token.connect(account2).approve(oracle.address, 150n*million);
      await oracle.depositTokens(400n*million);
      await oracle.connect(account1).depositTokens(250n*million);
      await oracle.connect(account2).depositTokens(150n*million);
    });

    it("New token balance", async () => {
      const tokBal10 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      console.log(`tokBal10 ${tokBal10}`);
      const tokBal11 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account1.address)).tokens,
        "gwei"
      );
      const tokBal12 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account2.address)).tokens,
        "gwei"
      );
      const tokBal13 = ethers.utils.formatUnits(
        await token.balanceOf(oracle.address),
        "gwei"
      );

      console.log(`tokBal11 ${tokBal11}`);
      console.log(`tokBal12 ${tokBal12}`);
      console.log(`tokBal13 ${tokBal13}`);

      
          assert.equal(tokBal10, "0.4", "Must be equal");
          assert.equal(tokBal11, "0.25", "Must be equal");
          assert.equal(tokBal12, "0.15", "Must be equal");
          assert.equal(tokBal13, "0.8", "Must be equal");
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
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("pull reviewData1 ", async () => {
      const result = await oracle.reviewStatus();
      console.log(`review1 ${result}`);
      const result2 = await oracle.votes(0);
      console.log(`voteYes ${result2}`);

    });

    it("fail: try to send too soon", async () => {
      //await oracle.initProcess();
      await expect(oracle.connect(owner).initProcess()).to.be.reverted;
      //const result = await oracle.underReview();
      //console.log(`review2 ${result}`);
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("pull reviewData3 ", async () => {
      const result = await oracle.reviewStatus();
      console.log(`review3 ${result}`);
    });

    it("fail: try post odds to oracle", async () => {
      const _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      var nextStart = _timestamp + 86400;
      await expect(oracle.updatePost(
        [
          900,500,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      )).to.be.reverted;
    });

    it("fail:try to send results, not initial data", async () => {
      await expect(oracle.settleProcess()).to.be.reverted;
    });

    it("fast forward 3 days", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 192);
    });

    it("approve and send correct data to betting contract", async () => {
      result = await oracle.initProcess();
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("send updated odds data: 2000 for match 1, team 0", async () => {
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
      result = await oracle.updatePost(
        [
          800,600,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("vote yes on odds", async () => {
      result = await oracle.connect(account2).vote(true);
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("vote no on odds", async () => {
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("show votes", async () => {
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Vote 1 ${yesvote}: No Vote 1 ${novote}`);
       assert.equal(yesvote, "550000000", "Must be equal");
       assert.equal(novote, "250000000", "Must be equal");
       const tokBal99 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "wei"
      );
      console.log(`tokBal10 ${tokBal99}`);
      const tokBal98 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      console.log(`tokBal10 ${tokBal98}`);
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("process vote, should send odds", async () => {
      result = await oracle.updateProcess();
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("See updated odds, should be new 2000", async () => {
      const result2 = await betting.betData(1);
      const str = result2.toHexString(16).slice(2).padStart(64, "0");
      const pieces = str
        .match(/.{1,2}/g)
        .reverse()
        .join("")
        .match(/.{1,8}/g)
        .map((s) =>
          s
            .match(/.{1,2}/g)
            .reverse()
            .join("")
        );
      const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
      console.log(ints)
      assert.equal(ints[6], "600", "Must be equal");
      console.log(`tokBal ${ints[6]}`);
    });

    it("New token balance", async () => {
      const tokBal1 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      console.log(`tokBal ${tokBal1}`);
      assert.equal(tokBal1, "0.4", "Must be equal");
    });

    it("update odds", async () => {
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
      result = await oracle.updatePost(
        [
          700,700,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("vote no on proposed odds", async () => {
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("vote no on proposed odds", async () => {
      result = await oracle.connect(account2).vote(false);
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("show votes", async () => {
      const yesvote = await oracle.votes(0);
      const novote = await oracle.votes(1);
      console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);

       assert.equal(yesvote, "400000000", "Must be equal");
       assert.equal(novote, "400000000", "Must be equal");

      
    });

    it("process should not send", async () => {
      result = await oracle.updateProcess();
      receipt = await result.wait()
      gasUsed = Number(receipt.gasUsed) + gasUsed;
      const tokBal98 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      console.log(`tokBal10 ${tokBal98}`);
      const tokBal97 = ethers.utils.formatUnits(
        (await token.totalSupply()),
        "mwei"
      );
      console.log(`totalSupply ${tokBal97}`);
      const tokBal96 = ethers.utils.formatUnits(
        (await token.balanceOf(oracle.address)),
        "mwei"
      );
      console.log(`oracleAddress takens ${tokBal97}`);
    });

    it("should be old 600, not new 700", async () => {
      const result3 = await betting.betData(1);
      console.log(`result3 ${result3}`);
      //const str = bn.toString(16);
      const str = result3.toHexString(16).slice(2).padStart(64, "0");
      const pieces = str
        .match(/.{1,2}/g)
        .reverse()
        .join("")
        .match(/.{1,8}/g)
        .map((s) =>
          s
            .match(/.{1,2}/g)
            .reverse()
            .join("")
        );
      const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
      assert.equal(ints[6], "600", "Must be equal");
    });

    it("totalGas", async () => {
      console.log(`totalGas ${gasUsed}`);
    });

  });



});
