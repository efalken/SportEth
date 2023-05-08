
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = 0; //_dateo.getTimezoneOffset() * 60  * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
const firstStart = 1635695609;
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

  describe("initial set up", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Get Oracle Contract Address", async () => {
      const tokBal = ethers.utils.formatUnits(
        await token.balanceOf(owner.address),
        "finney"
      );
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, "550");
    });

    it("Deposit Tokens in Oracle Contract1", async () => {
      await oracle.depositTokens("550");
    });

    it("transfer tokens to betting account", async () => {
      await token.transfer(betting.address, "100");
    });
  });

  describe("set up Betting contract", async () => {
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
          1000,
          500,
          1000,
          909,
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

    it("fast forward 6 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract", async () => {
      await oracle.initProcess();
    });

    it("Acct 0 Fund Betting Contract", async () => {
      await betting.fundBook({
        value: "6000000000000000000",
      });
    });

    it("Acct 1 Fund Betting Contract", async () => {
      await betting.connect(account1).fundBook({
        value: "4000000000000000000",
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: "10000000000000000000",
      });
    });
    /*
            it("Fund Betting Contract with 200 finney", async () => {
                await betting.fundBettor({ from: accounts[3], value: '4000000000000000000' });
            })*/

    it("bumpTime", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86404);
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    });

    it("Send Initial Event Results", async () => {
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

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Approve and send result data", async () => {
      const result2 = await oracle.settleProcess();
      const receipt = await result2.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on first settlement ${gasUsed}`);
    });

    it("state 0", async () => {
      const excessCapital = await betting.margin(0);
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const shares2 = await betting.margin(4);
      const sharesAcct0 = (await betting.lpStruct(owner.address)).shares;
      const sharesAcct1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`bookie capital ${excessCapital}`);
      console.log(`eth in betting contract ${ethbal}`);
      console.log(`total LP shares ${shares2}`);
      console.log(`sharesAcct0 ${sharesAcct0}`);
      console.log(`sharesAcct1 ${sharesAcct1}`);
      assert.equal(Math.floor(sharesAcct0), "60000", "Must be equal");
      assert.equal(Math.floor(sharesAcct1), "40000", "Must be equal");
      assert.equal(Math.floor(shares2), "100000", "Must be equal");
      assert.equal(Math.floor(ethbal), "20000", "Must be equal");
      assert.equal(Math.floor(excessCapital), "100000", "Must be equal");
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 14 * 86400;
      const result2 = await oracle.initPost(
        [
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
          "NFL:ARI:LAC",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Holloway:Kattar",
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
          1000,
          500,
          1000,
          909,
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
      const receipt = await result2.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on first post ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract #2", async () => {
      const result2 = await oracle.initProcess();
      const receipt = await result2.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on initial send ${gasUsed}`);
    });

    it("bumpTime", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86404);
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    });

    it("Send Event Results 2", async () => {
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

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Approve and send result data 2", async () => {
      const result2 = await oracle.settleProcess();
      const receipt = await result2.wait()
      const gasUsed = receipt.gasUsed;
      console.log(`gas on second settlement ${gasUsed}`);
    });

    it("withdraw 100 finney 'shares' for account 0", async () => {
      const ethout0 = await betting.withdrawBook("10000");
    });

    it("withdraw 50 finney shares for acct 1", async () => {
      const ethout1 = await betting.connect(account1).withdrawBook("5000");
    });

    it("state 1", async () => {
      const excessCapital = await betting.margin(0);
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const shares2 = await betting.margin(4);
      const sharesAcct0 = (await betting.lpStruct(owner.address)).shares;
      const sharesAcct1 = (await betting.lpStruct(account1.address)).shares;

      console.log(`bookie capital ${excessCapital}`);
      console.log(`eth in betting contract ${ethbal}`);
      console.log(`total LP shares ${shares2}`);
      console.log(`sharesAcct0 ${sharesAcct0}`);
      console.log(`sharesAcct1 ${sharesAcct1}`);

      assert.equal(Math.floor(sharesAcct0), "50000", "Must be equal");
      assert.equal(Math.floor(sharesAcct1), "35000", "Must be equal");
      assert.equal(Math.floor(excessCapital), "85000", "Must be equal");
      assert.equal(Math.floor(ethbal), "18500", "Must be equal");
      assert.equal(Math.floor(shares2), "85000", "Must be equal");
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
      var nextStart = _timestamp + 21 * 86400;
      const result2 = await oracle.initPost(
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
      const receipt = await result2.wait()
      const gasUsed = receipt.gasUsed;
      console.log(`gas on second post ${gasUsed}`);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("approve and send to betting contract #3", async () => {
      const result2 = await oracle.initProcess();
      const receipt = await result2.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on second send ${gasUsed}`);
    });

    it("Bet 50 finney on match 0: team 0", async () => {
      const bookpool = await betting.margin(0);
      console.log(`bookieCap is ${bookpool}`);
      await betting.connect(account2).bet(0, 0, "5000");
    });

    it("bumpTime", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(86404);
    });

    it("checkHour", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
    });

    it("Send Event Results 3", async () => {
      await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]);
    });

    it("fast forward 4 hours", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Approve and send result data 3", async () => {
      await oracle.settleProcess();
    });

    it("state 2", async () => {
      const excessCapital = await betting.margin(0);
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const shares2 = await betting.margin(4);
      const sharesAcct0 = (await betting.lpStruct(owner.address)).shares;
      const sharesAcct1 = (await betting.lpStruct(account1.address)).shares;
      console.log(`bookie capital ${excessCapital}`);
      console.log(`eth in betting contract ${ethbal}`);
      console.log(`total LP shares ${shares2}`);
      console.log(`sharesAcct0 ${sharesAcct0}`);
      console.log(`sharesAcct1 ${sharesAcct1}`);

      assert.equal(Math.floor(sharesAcct0), "50000", "Must be equal");
      assert.equal(Math.floor(sharesAcct1), "35000", "Must be equal");
      assert.equal(Math.floor(excessCapital), "90000", "Must be equal");
      assert.equal(Math.floor(ethbal), "18500", "Must be equal");
      assert.equal(Math.floor(shares2), "85000", "Must be equal");
    });

    it("withdraw 100 finney for account 0", async () => {
      const ethout0 = await betting.withdrawBook("10000");
      const receipt0 = await ethout0.wait();
      const ethout1 = await betting.connect(account1).withdrawBook("5000");
      const receipt1 = await ethout1.wait();
      const ethin0 = ethers.utils.formatUnits(receipt0.events[0].args.moveAmount, "finney");
      const ethin1 = ethers.utils.formatUnits(receipt1.events[0].args.moveAmount, "finney");
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      console.log(`eth to acct0 ${ethin0}`);
      console.log(`eth to acct1 ${ethin1}`);
      assert.equal(ethin0, "1058.8", "Must be equal");
      assert.equal(ethin1, "529.4", "Must be equal");
    });

    it("State 3", async () => {
      const excessCapital = await betting.margin(0);
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const shares2 = await betting.margin(4);
      const sharesAcct0 = (await betting.lpStruct(owner.address)).shares;
      const sharesAcct1 = (await betting.lpStruct(account1.address)).shares;
      const sharesAcct3 = (await betting.lpStruct(account3.address)).shares;

      console.log(`bookie capital ${excessCapital}`);
      console.log(`eth in betting contract ${ethbal}`);
      console.log(`total LP shares ${shares2}`);
      console.log(`sharesAcct0 ${sharesAcct0}`);
      console.log(`sharesAcct1 ${sharesAcct1}`);

      assert.equal(Math.floor(sharesAcct0), "40000", "Must be equal");
      assert.equal(Math.floor(sharesAcct1), "30000", "Must be equal");

      assert.equal(Math.floor(excessCapital), "74118", "Must be equal");
      assert.equal(Math.floor(shares2), "70000", "Must be equal");

    });

    it("Acct 3 Funds Betting Contract", async () => {
      await betting.connect(account3).fundBook({
        value: "1000000000000000000",
      });
    });

    it("State 4", async () => {
      const excessCapital = await betting.margin(0);
      const ethbal = ethers.utils.formatUnits(await ethers.provider.getBalance(betting.address), "finney");
      const shares2 = await betting.margin(4);
      const sharesAcct0 = (await betting.lpStruct(owner.address)).shares;
      const sharesAcct1 = (await betting.lpStruct(account1.address)).shares;
      const sharesAcct3 = (await betting.lpStruct(account3.address)).shares;

      console.log(`bookie capital ${excessCapital}`);
      console.log(`eth in betting contract ${ethbal}`);
      console.log(`total LP shares ${shares2}`);
      console.log(`sharesAcct0 ${sharesAcct0}`);
      console.log(`sharesAcct1 ${sharesAcct1}`);
      console.log(`sharesAcct3 ${sharesAcct3}`);
      assert.equal(Math.floor(sharesAcct0), "40000", "Must be equal");
      assert.equal(Math.floor(sharesAcct1), "30000", "Must be equal");
      assert.equal(Math.floor(sharesAcct3), "9444", "Must be equal");
      assert.equal(Math.floor(shares2), "79444", "Must be equal");
    });
  });
});
