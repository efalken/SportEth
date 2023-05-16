
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
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
  let betting, oracle, token, reader, owner, account1, account2, account3;

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

  describe("Preliminaries", async () => {
    it("Get Oracle Contract Address", async () => {
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }

      var nextStart = _timestamp + 7 * 86400;
      console.log(`start time: ${nextStart}`);
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
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Send Initial Data", async () => {
      result = await oracle.initProcess();
      const betdata0 = await betting.betData(0);
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

  it("checkTime", async () => {
    await betting.connect(account2).fundBettor({
      value: 1n*eths,
    });
    let betdata0 = await reader.showBetData(0);
    console.log(`initBetData`);
    console.log(betdata0);

  });
});

  describe("Send Bets, update Odds, send more bets", async () => {
    let contractHash1;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      result = await betting.connect(account1).bet(0, 0, "1000");
      receipt = await result.wait();

    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    });

    it("send updated odds data", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      var nextStart = _timestamp + 86400;
      result = await oracle.updatePost(
          [
          1111,
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
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on updatePost0 = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      result = await oracle.updateProcess();
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on updateSend0 = ${gasUsed}`);
    });

    let contractHash2;
    it("bet on 0:0 after odds update", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      result12 = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result12.wait();

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
      await oracle.settleProcess();
    });


  });

  describe("setupBets2", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }

      var nextStart = _timestamp + 7 * 86400;
      result = await oracle.initPost(
        [
          "NFL:ARC:LAC",
          "NFL:AAA:LAR",
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
          0,
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
          1100,
          2100,
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
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initPost2 = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Send Initial Data", async () => {
      result = await oracle.initProcess();
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend2 = ${gasUsed}`);
    });

    it("send updated odds data", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      var nextStart = _timestamp + 86400;
      result = await oracle.updatePost(
          [
          1112,
          2001,
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
          0,
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
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on updatePost2 = ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      result = await oracle.updateProcess();
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on updateSend2 = ${gasUsed}`);
    });


  });

});
