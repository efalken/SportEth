
const helper = require('../hardhat-helpers');
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
const {assert} = require('chai')
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');
require('chai').use(require('chai-as-promised')).should();

describe('Test2b', function () {
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
    it('Get Oracle Contract Address', async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    })

    it('Authorize Oracle Token', async () => {
      await token.approve(oracle.address, 560n*million);
    })
    it("Deposit Tokens in Oracle Contract2", async () => {
      await oracle.connect(owner).depositTokens(560n*million);
    })
  })

  describe("set up contract for taking bets", async () => {

    it('checkHour', async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      console.log(`time is ${_timestamp}`);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
      await oracle.initPost(["NFL:ARI:LAC", "NFL:ATL:LAR", "NFL:BAL:MIA", "NFL:BUF:MIN", "NFL:CAR:NE", "NFL:CHI:NO", "NFL:CIN:NYG", "NFL:CLE:NYJ", "NFL:DAL:OAK", "NFL:DEN:PHI", "NFL:DET:PIT", "NFL:GB:SEA", "NFL:HOU:SF", "NFL:IND:TB", "NFL:JAX:TEN", "NFL:KC:WSH", "UFC:Holloway:Kattar", "UFC:Ponzinibbio:Li", "UFC:Kelleher:Simon", "UFC:Hernandez:Vieria", "UFC:Akhemedov:Breese", "UFC:Memphis:Brooklyn", "UFC:Boston:Charlotte", "UFC:Milwaukee:Dallas", "UFC:miami:LALakers", "UFC:Atlanta:SanAntonia", "NHL:Colorado:Washington", "NHL:Vegas:StLouis", "NHL:TampaBay:Dallas", "NHL:Boston:Carolina", "NHL:Philadelphia:Edmonton", "NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
    })

    it("approve and send to betting contract", async () => {
      await oracle.initProcess();
      const startNow = await betting.betData(5);
      console.log(`startTime is ${startNow}`);
      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    })

    it("Fund Contract", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await betting.connect(owner).fundBook({ value: 3n*eths });
      await betting.connect(account2).fundBettor({ value: 800n*finneys });
      await betting.connect(account3).fundBettor({ value: 700n*finneys });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
    })


    it("bet 10 on 0:1", async () => {
      const result = await betting.connect(account2).bet(0, 0, "1000");
    });

    it("bet 20 on 0:1", async () => {
      await betting.connect(account3).bet(0, 1, "2000");
    })

    it("bet 10 on 0:1", async () => {
      await betting.connect(account2).bet(0, 0, "1000");
    })

    it("bet 10 on 1:0", async () => {
      await betting.connect(account2).bet(1, 0, "1000");
    })

    it("bet 20 on 1:1", async () => {
      await betting.connect(account3).bet(1, 1, "2000");
    })

    it("bet 10 on 1:0", async () => {
      await betting.connect(account2).bet(1, 0, "1000");
    })

    it("bet 10 on 2:0", async () => {
      await betting.connect(account2).bet(2, 0, "1000");
    })

    it("bet 20 on 2:1", async () => {
      await betting.connect(account3).bet(2, 1, "2000");
    })

    it("bet 10 on 2:0", async () => {
      await betting.connect(account2).bet(2, 0, "1000");
    })

    it("bet 10 on 3:0", async () => {
      await betting.connect(account2).bet(3, 0, "1000");
    })

    it("bet 10 on 3:0", async () => {
      await betting.connect(account2).bet(3, 0, "1000");
    })

    it("bet 10 on 3:1", async () => {
      await betting.connect(account3).bet(3, 1, "1000");
    })

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
      console.log(`ethbal ${ethbal}`);
      assert.equal(bookiePool, "30000", "mustBe equal");
      assert.equal(bettorLocked, "15000", "Must be equal");
      assert.equal(bookieLocked, "4614", "Must be equal");
      assert.equal(oracleBal, "0.0", "Must be equal");
      assert.equal(ethbal, "4500.0", "Must be equal");
    })

    it('checkHour', async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      console.log(`ts0 = ${_timestamp}`);
      _hour = _date.getHours();
      console.log(`hour = ${_hour}`);
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    })

    it("Send Event Results to oracle", async () => {
      await
        oracle.settlePost([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
      assert.equal(bookiePool, "25386", "mustBe equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(oracleBal, "58.07", "Must be equal");
      assert.equal(ethbal, "4441.93", "Must be equal");
    })
  })
})
