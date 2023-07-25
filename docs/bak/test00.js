const helper = require("../../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset,
  _hourSolidity,
  _timestamp,
  nextStart,
  _date,
  _hour,
  hash1,
  hash2,
  hash3,
  hash4,
  hash5,
  hash6,
  hash7,
  hash8,
  hash9,
  hash10,
  hash11,
  hash12,
  result,
  receipt,
  gasUsed;
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");
    //const Reader = await ethers.getContractFactory("Reader");
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    await token.setAdmin(oracle.address);
    //reader = await Reader.deploy(betting.address, token.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 560n * million);
    });
    it("Deposit Tokens in Oracle Contract2", async () => {
      await oracle.connect(owner).depositTokens(560n * million);
    });
  });

  describe("set up contract for taking bets", async () => {
    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();

      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = 1688914859 + 7 * 86400;

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
          999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initSend = ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.initProcess();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas on secondSend = ${gasUsed}`);

      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("HHHHHHHHHHHHHHHHHHHHHHH", async () => {
      const tracker2 = await oracle.betEpochOracle();
      console.log(`tracker111 ${tracker2}`);
    });

    it("Fund Contract", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`currTime is ${_timestamp}`);
      result = await betting.connect(owner).fundBook({
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas ${gasUsed}`);

      result = await betting.connect(account2).fundBettor({
        value: 1n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).fundBettor({
        value: 1n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
      console.log(`acct1 is ${account1.address}`);
    });

    it("bets", async () => {
      result = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      //const ethw = await betting.moose();
      console.log(`gas0 is ${gasUsed} `);
      //console.log(`betAmt ${ethw}`);
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash1 = receipt.events[0].args.contractHash;
    });

    it("bets2", async () => {
      result = await betting.connect(account3).bet(0, 0, "1000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      //const ethw2 = await betting.moose();
      console.log(`gas1 is ${gasUsed} `);
      result = await betting.connect(account3).bet(1, 0, "1000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas2 is ${gasUsed} `);
      result = await betting.connect(account3).bet(1, 0, "1000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas3 is ${gasUsed} `);
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash2 = receipt.events[0].args.contractHash;

      result = await betting.connect(account2).bet(0, 1, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash3 = receipt.events[0].args.contractHash;

      console.log(`gas on simple bet ${receipt.gasUsed}`);
      result = await betting.connect(account2).bet(0, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash4 = receipt.events[0].args.contractHash;

      result = await betting.connect(account3).bet(1, 1, "2000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash5 = receipt.events[0].args.contractHash;

      result = await betting.connect(account2).bet(1, 0, "200");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash6 = receipt.events[0].args.contractHash;

      result = await betting.connect(account2).bet(2, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash7 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(2, 1, "2000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash8 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash9 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash10 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash11 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(3, 1, "1000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash12 = receipt.events[0].args.contractHash;
      console.log(`gas ${gasUsed}`);
    });

    it("PostBet-PreSettle", async () => {
      const bookiePool = await betting.margin(0);
      const bettorLocked = await betting.margin(2);
      const bookieLocked = await betting.margin(1);
      const oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "finney"
      );
      const ethbal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(betting.address),
        "finney"
      );
      const userBalanceAcct2 = (await betting.userStruct(account2.address))
        .userBalance;
      console.log(`acct2 ${userBalanceAcct2}`);
      const userBalanceAcct3 = (await betting.userStruct(account3.address))
        .userBalance;
      console.log(`acct3 ${userBalanceAcct3}`);
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal in finney ${ethbal}`);
      console.log(`acct2 Bal ${userBalanceAcct2}`);
      console.log(`acct3 Bal ${userBalanceAcct3}`);

      // assert.equal(bookiePool, "30000", "mustBe equal");
      // assert.equal(bettorLocked, "15000", "Must be equal");
      // assert.equal(bookieLocked, "4458", "Must be equal");
      // assert.equal(oracleBal, "0.0", "Must be equal");
      // assert.equal(ethbal, "5000.0", "Must be equal");
    });

    it("checkHour", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      console.log(`hourAdj ${hourOffset}`);
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      await helper.advanceTimeAndBlock(48 * secondsInHour);
    });

    it("Send Event Results to oracle", async () => {
      result = await oracle.settlePost([
        1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      result = await oracle.settleProcess();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
    });

    it("PostSettle", async () => {
      // const bookiePool = await betting.margin(0);
      // const bettorLocked = await betting.margin(2);
      // const bookieLocked = await betting.margin(1);
      // const oracleBal = ethers.utils.formatUnits(
      //   await ethers.provider.getBalance(oracle.address),
      //   "finney"
      // );
      // const ethbal = ethers.utils.formatUnits(
      //   await ethers.provider.getBalance(betting.address),
      //   "finney"
      // );
      // console.log(`bookiePool ${bookiePool}`);
      // console.log(`bettorLocked ${bettorLocked}`);
      // console.log(`bookieLocked ${bookieLocked}`);
      // console.log(`oracleBal ${oracleBal}`);
      // console.log(`bettingk balance ${ethbal}`);

      const redeemCheck1 = await betting.checkRedeem(hash3);
      const redeemCheck2 = await betting.checkRedeem(hash2);

      console.log(`redeem should succeed ${redeemCheck1}`);
      console.log(`redeem should succeed ${redeemCheck2}`);

      //const redeemCheck4 = await expect(await reader.checkSingleBet(hash2)).to
      // .be.reverted;
      // console.log(` ${redeemCheck4}`);

      let redeemCheck5 = await betting.outcomeMap(1001);
      console.log(` ${redeemCheck5}`);
      redeemCheck5 = await betting.outcomeMap(1000);
      console.log(` ${redeemCheck5}`);
      result = await betting.connect(account2).redeem();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`total gas ${gasUsed}`);

      /*
      result = await betting.connect(account2).redeem(hash10);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem(hash8);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).redeem(hash11);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);

      result = await betting.connect(account3).redeem(hash12);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem(hash5);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).redeem(hash3);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`total gas ${gasUsed}`);
*/
      /*
      result = await betting.connect(account2).redeem(hash3);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem(hash5);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem(hash8);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).redeem(hash12);
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`total gas ${gasUsed}`);
*/
      // const userBalanceAcct2 = (await betting.userStruct(account2.address)).userBalance;
      // console.log(`acct2 ${userBalanceAcct2}`);
      // const userBalanceAcct3 = (await betting.userStruct(account3.address)).userBalance;
      // console.log(`acct3 ${userBalanceAcct3}`);

      // console.log(`bookiePool ${bookiePool}`);
      // console.log(`bettorLocked ${bettorLocked}`);
      // console.log(`bookieLocked ${bookieLocked}`);
      // console.log(`oracleBal ${oracleBal}`);
      // console.log(`ethbal in finney ${ethbal}`);
      // console.log(`acct2 Bal ${userBalanceAcct2}`);
      // console.log(`acct3 Bal ${userBalanceAcct3}`);

      //   assert.equal(bookiePool, "29154", "mustBe equal");
      //   assert.equal(bettorLocked, "0", "Must be equal");
      //   assert.equal(bookieLocked, "0", "Must be equal");
      //   assert.equal(oracleBal, "34.23", "Must be equal");
      //   assert.equal(ethbal, "4965.77", "Must be equal");
      //   assert.equal(userBalanceAcct2, "6950", "Must be equal");
      //   assert.equal(userBalanceAcct3, "13553", "Must be equal");
      //
    });
  });
});
