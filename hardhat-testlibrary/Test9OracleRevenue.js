
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = 0; //_dateo.getTimezoneOffset() * 60  * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var tokens0;
var tokens1;
var tokens1;
var tokens2;
var tokens3;
var tokenstot;
var feepool;
var oracleBal;
var betEpoc;
var ethout8;
var ethout;
var tokensout;
const {assert} = require('chai');
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');

require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3, account4, account5, account6;

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
    [owner, account1, account2, account3, account4, account5, account6, _] = await ethers.getSigners();
  })

  describe("initial contract with one token owner", async () => {
    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, "250");
    });

    it("Deposit Tokens in Oracle Contract0", async () => {
      await oracle.depositTokens("250");
    });
/*
    it("transfer tokens to betting account", async () => {
      await token.transfer(betting.address, "250");
    });*/
  });

  describe("initial contract with one token owner", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;

      _date = new Date(_timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`currTimet ${_timestamp}`);
    });

    it("post initial data 1", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`currTimet ${_timestamp}`);
      var nextStart = _timestamp + 2 * 86400;
      console.log(`next start ${nextStart}`);
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`currTimet ${_timestamp}`);
      _date = new Date(_timestamp + offset);
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (12 - _hour));
      }

      await oracle.initProcess();
    });

    it("Send  Bet #1", async () => {
      await betting.connect(account4).fundBook({
        value: "5000000000000000000",
      });
      await betting.connect(account5).fundBettor({
        value: "5000000000000000000",
      });
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log(`currTimet ${_timestamp}`);
      const result = await betting.connect(account5).bet(0, 0, "2000");
      const receipt = await result.wait()
      contractHash1 = receipt.events[0].args.contractHash;
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      await oracle.settlePost([
        0,
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 1", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params(7);
      const totTokens = await oracle.params(4);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
      console.log(`tot tokens ${totTokens}`);
      await betting.connect(account5).redeem(contractHash1);
      const tokens5 = await token.balanceOf(account5.address);
      console.log(`tot tokens acct5 ${tokens5}`);
    });
  });

  describe("Second epoch with two oracles", async () => {
    it("acct 1 send tokens to oracle", async () => {
      await token.transfer(account1.address, "150");
      await token.connect(account1).approve(oracle.address, "150");
      await oracle.connect(account1).depositTokens("150");
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 14 * 86400;
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (12 - _hour));
      }
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
    });

    it("Send  Bet #2", async () => {
      const result = await betting.connect(account5).bet(0, 0, "2000");
      const receipt = await result.wait()
      const odds = ethers.utils.formatUnits(receipt.events[0].args.payoff, "finney");
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86400);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      await oracle.settlePost([
        0,
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 2", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params(7);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
    });
  });

  describe("third epoch with three oracles", async () => {
    it("transfer tokens from account 2", async () => {
      const result0 = await token.transfer(account2.address, "100");
      const receipt0 = await result0.wait();
      const result1 = await token.connect(account2).approve(oracle.address, "100");
      const receipt1 = await result1.wait();
      const result2 = await oracle.connect(account2).depositTokens("100");
      const receipt2 = await result2.wait();
      const gasUsed0 = receipt0.gasUsed;
      console.log(`gas on tokenTransfer0 ${gasUsed0}`);
      const gasUsed1 = receipt1.gasUsed;
      console.log(`gas on tokenTransfer1 ${gasUsed1}`);
      const gasUsed2 = receipt2.gasUsed;
      console.log(`gas on tokenTransfer2 ${gasUsed2}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 21 * 86400;
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (12 - _hour));
      }
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
      const result = await betting.connect(account5).bet(0, 0, "2000");
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(3600);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      await oracle.settlePost([
        0,
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 3", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params(7);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
    });

    it("newfunds", async () => {
      tokens0 = (await oracle.adminStruct(owner.address)).tokens;
      console.log(`tokens Tracker ${tokens0}`);
      await token.approve(oracle.address, "50");
      const tokensa0 = await token.balanceOf(owner.address);
      console.log(`acct0 tokens, ${tokensa0}`);
      const result = await oracle.depositTokens("50");
      const receipt = await result.wait()
      ethout = ethers.utils.formatUnits(receipt.events[1].args.etherChange, "finney");
      console.log(`finney Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      assert.equal(ethout, "21.25", "Must be equal");
        });

  });

  describe("fourth epoch with three oracles", async () => {
    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 28 * 86400;
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (12 - _hour));
      }
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.connect(account1).initProcess();
      const result = await betting.connect(account5).bet(0, 0, "2000");
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86400);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      await oracle.connect(account1).settlePost(
        [
          0,
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
        ]
      );
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.connect(account1).settleProcess();
    });

    it("check 4", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params(7);
      const oracleBal2 = await token.balanceOf(oracle.address);
      feePool = await oracle.params(7);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
      console.log(`feePool Tracker2 ${oracleBal2}`);
      });

      it("withdraw", async () => {
      const result = await oracle.connect(account1).withdrawTokens("150");
      const receipt = await result.wait();
      const oracleBal3 = await token.balanceOf(oracle.address);
      console.log(`feePool Tracker3 ${oracleBal3}`);
      /*ethout = ethers.utils.formatUnits(receipt.events[1].args.etherChange, "finney");
      console.log(`finney Out1 ${ethout}`);
      assert.equal(ethout, "9.45", "Must be equal");
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`tokens Out1 ${tokensout}`);*/
    });
  });

  describe("fifth epoch with 2 oracles", async () => {
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
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (12 - _hour));
      }
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
      const result = await betting.connect(account5).bet(0, 0, "2000");

      await helper.advanceTimeAndBlock(86400);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      await oracle.settlePost(
        [
          0,
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
        ]
      );
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 5", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params(7);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
        });

      it("final", async () => {
      const initfee = (await oracle.adminStruct(owner.address)).initFeePool;
      console.log(`initfee ${initfee}`);
      const result = await oracle.withdrawTokens("300");
      const receipt = await result.wait()
      ethout = ethers.utils.formatUnits(receipt.events[1].args.etherChange, "finney");
      console.log(`finney Out0 ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      console.log(`tokens Out0 ${tokensout}`);
      assert.equal(ethout, "12.9", "Must be equal");
      const result1 = await oracle.connect(account2).withdrawTokens("100");
      const receipt1 = await result1.wait()
      ethout = ethers.utils.formatUnits(receipt1.events[1].args.etherChange, "finney");
      console.log(`finney Out2 ${ethout}`);
      const tokensout1 = receipt1.events[1].args.tokensChange;
      console.log(`tokens Out2 ${tokensout1}`);
      assert.equal(ethout, "6.3", "Must be equal");

      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      console.log(`eth in Oracle Contract at end ${oracleBal}`);
    });
  });
});
