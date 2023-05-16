
const web3 = require("web3-utils");
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
const { assert } = require('chai');
//const { expect } = require("chai");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

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
    it("New token balance", async () => {
      const tokBala = ethers.utils.formatUnits(
        await token.balanceOf(owner.address),
        "wei"
      );
      console.log(`tokenBal is ${tokBala} 1e18`);
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    });
  });

  describe("TokenTransfer", async () => {
    it("New token balance 0", async () => {
      const tokBala = await token.balanceOf(owner.address);
      console.log(`tokenBal is ${tokBala}`);
    });

    it("transfer tokens to acct1", async () => {
      await token.transfer(account1.address, "250");
      await token.transfer(account2.address, "150");
      await token.approve(oracle.address, "400");
      await token.connect(account1).approve(oracle.address, "250");
      await token.connect(account2).approve(oracle.address, "150");
      await oracle.depositTokens("400");
      await oracle.connect(account1).depositTokens("250");
      await oracle.connect(account2).depositTokens("150");
    });

    it("New token balance", async () => {
      const tokBal10 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "wei"
      );
      const tokBal11 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account1.address)).tokens,
        "wei"
      );
      const tokBal12 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account2.address)).tokens,
        "wei"
      );
      const tokBal13 = ethers.utils.formatUnits(
        await token.balanceOf(oracle.address),
        "wei"
      );
      console.log(`tokBal10 ${tokBal10}`);
      console.log(`tokBal11 ${tokBal11}`);
      console.log(`tokBal12 ${tokBal12}`);
      console.log(`tokBal13 ${tokBal13}`);
      /*
          assert.equal(tokBal10, "40000", "Must be equal");
          assert.equal(tokBal11, "25000", "Must be equal");
          assert.equal(tokBal12, "15000", "Must be equal");
          assert.equal(tokBal13, "80000", "Must be equal");*/
    });
  });

  describe("setupBets", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      //  await helper.advanceTimeAndBlock(secondsInHour * 2.02);
      _date = new Date(1000 * _timestamp + offset);
      //  await helper.advanceTimeAndBlock(secondsInHour * 2);
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
          955,
          1000,
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
    });

    it("pull reviewData1 ", async () => {
      const result = await oracle.params(1);
      console.log(`review1 ${result}`);
      const result2 = await oracle.params(5);
      console.log(`voteYes ${result2}`);
      const _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`blocktime ${_timestamp}`);
      const result3 = await oracle.params(3);
      console.log(`timer ${result3}`);
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
      const result = await oracle.params(1);
      console.log(`review3 ${result}`);
    });

    it("fail: try post odds to oracle", async () => {
      const _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      var nextStart = _timestamp + 86400;
      await expect(oracle.updatePost(
        [
          800,
          999,
          600,
          1200,
          1000,
          800,
          580,
          900,
          1120,
          1010,
          1340,
          610,
          1320,
          1400,
          1240,
          610,
          740,
          560,
          1450,
          830,
          590,
          870,
          750,
          1430,
          1370,
          930,
          570,
          1420,
          510,
          820,
          1050,
          1310,
        ]
      )).to.be.reverted;
    });

    it("fail:try to send results, not initial data", async () => {
      await expect(oracle.settleProcess()).to.be.reverted;
      //await timeout(5000);
      //await web3.utils.advanceBlockAtTime(now.toNumber());

    });

    it("fast forward 3 days", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 192);
    });

    it("approve and send correct data to betting contract", async () => {
      await oracle.initProcess();
    });

    it("send updated odds data: 2000 for match 1, team 0", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 14 * 86400;
      await oracle.updatePost(
        [
          800,
          2000,
          600,
          1200,
          1000,
          800,
          580,
          900,
          1120,
          1010,
          1340,
          610,
          1320,
          1400,
          1240,
          610,
          740,
          560,
          1450,
          830,
          590,
          870,
          750,
          1430,
          1370,
          930,
          570,
          1420,
          510,
          820,
          1050,
          1310,
        ]
      );
    });

    it("vote yes on odds", async () => {
      await oracle.connect(account2).vote(true);
    });

    it("vote no on odds", async () => {
      await oracle.connect(account1).vote(false);
    });

    it("show votes", async () => {
      const yesvote = await oracle.params(5);
      const novote = await oracle.params(6);
      console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);
      assert.equal(yesvote, "550", "Must be equal");
      assert.equal(novote, "250", "Must be equal");
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("process vote, should send odds", async () => {
      await oracle.updateProcess();
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
      assert.equal(ints[6], "2000", "Must be equal");
      console.log(`tokBal ${ints[6]}`);
    });

    it("New token balance", async () => {
      const tokBal1 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "wei"
      );
      console.log(`tokBal ${tokBal1}`);
      assert.equal(tokBal1, "400", "Must be equal");
    });

    it("update odds", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 14 * 86400;
      await oracle.updatePost(
        [
          3000,
          999,
          600,
          1200,
          1000,
          800,
          580,
          900,
          1120,
          1010,
          1340,
          610,
          1320,
          1400,
          1240,
          610,
          740,
          560,
          1450,
          830,
          590,
          870,
          750,
          1430,
          1370,
          930,
          570,
          1420,
          510,
          820,
          1050,
          1310,
        ]
      );
    });

    it("vote no on proposed odds", async () => {
      await oracle.connect(account1).vote(false);
    });

    it("vote no on proposed odds", async () => {
      await oracle.connect(account2).vote(false);
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("show votes", async () => {
      const yesvote = await oracle.params(5);
      const novote = await oracle.params(6);
      console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);

      assert.equal(yesvote, "400", "Must be equal");
      assert.equal(novote, "400", "Must be equal");
    });

    it("process should not send", async () => {
      await oracle.updateProcess();
    });

    it("should be old 2000, not new 3000", async () => {
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
      assert.equal(ints[6], "2000", "Must be equal");
    });
  });
});
