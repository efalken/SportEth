const helper = require("../../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var hash1;
var hash2;
var hash3;
var hash4;
var hash5;
var hash6;
var hash7;
var hash8;
var hash9;
var hash10;
var hash11;
var hash12;
var result;
var receipt;
var check13;
var gasUsed;
const finneys = BigInt("1000000000000000");
const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");
    const Reader = await ethers.getContractFactory("Reader");
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    await token.setAdmin(oracle.address);
    reader = await Reader.deploy(betting.address, oracle.address);
    [owner, account1, account2, _] = await ethers.getSigners();
  });

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`owner Address is ${owner.address}`);
      console.log(`acct1 Address is ${account1.address}`);
      console.log(`acct2 Address is ${account2.address}`);
      console.log(`Betting Address is ${betting.address}`);
      console.log(`Oracle Address is ${oracle.address}`);
      console.log(`Token Address is ${token.address}`);
      console.log(`Reader Address is ${reader.address}`);
    });

    // it("Authorize Oracle Token", async () => {
    //   await token.approve(oracle.address, "560000000");
    // });
    it("Deposit Tokens in Oracle Contract2", async () => {
      await oracle.connect(owner).depositTokens("560000000");
    });
  });

  describe("set up contract for taking bets", async () => {
    it("checkHour0", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
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
          999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initProcess = ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      result = await oracle.initProcess();
    });

    it("Fund Contract", async () => {
      //  console.log(`startTime is ${nextStart}`);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`currTime is ${_timestamp}`);
      result = await betting.connect(owner).fundBook({
        value: 30n * finneys,
      });
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);
      result = await betting.connect(account1).fundBettor({
        value: 90n * finneys,
      });
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);
      result = await betting.connect(account2).fundBettor({
        value: 90n * finneys,
      });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
      console.log(`owner is ${owner.address}`);
      console.log(`acct1 is ${account1.address}`);
    });

    it("bets", async () => {
      result = await betting.connect(account1).bet(0, 0, 20);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on betting = ${gasUsed}`);
      var receipt = await result.wait();
      hash1 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).bet(0, 1, 25);
      receipt = await result.wait();
      hash2 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).bet(0, 0, 35);
      receipt = await result.wait();
      hash3 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 0, "45");
      receipt = await result.wait();
      hash4 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 1, "25");
      receipt = await result.wait();
      hash5 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 0, "15");
      receipt = await result.wait();
      hash6 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "22");
      receipt = await result.wait();
      hash7 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).bet(2, 1, "17");
      receipt = await result.wait();
      hash8 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "23");
      receipt = await result.wait();
      hash9 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "18");
      receipt = await result.wait();
      hash10 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "13");
      receipt = await result.wait();
      hash11 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 1, "32");
      receipt = await result.wait();
      hash12 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).postBigBet(0, 0, 201, 1998);
      receipt = await result.wait();
      hash13 = receipt.events[0].args.contractHash;
      result = await betting.connect(account1).postBigBet(0, 0, 201, 1999);
      receipt = await result.wait();
      hash13b = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).takeBigBet(hash13);
    });

    it("get betData", async () => {
      const check4 = await betting.connect(account1).betData(3);
      console.log(`bd betting ${check4}`);
      const check5 = await reader.connect(account1).showBetData(3);
      console.log(`bd reader ${check5}`);
      const check2 = await betting.connect(account1).checkOffer(hash13);
      const check3 = await reader.connect(account1).checkOffer(hash13b);
      console.log(`is not open ${check2}`);
      console.log(`is open ${check3}`);
    });

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.settleProcess();
    });

    it("Test 2", async () => {
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
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingk balance ${ethbal}`);
      const check0 = await betting.connect(account1).checkRedeem(hash2);

      await betting.connect(account1).redeem(hash2);
      console.log(`was Redeemable ${check0}`);

      const check1 = await betting.connect(account1).checkRedeem(hash2);
      console.log(`is Redeemable ${check1}`);

      const check2 = await betting.connect(account1).checkOffer(hash13);
      const check3 = await reader.connect(account1).checkOffer(hash13b);
      console.log(`is not open ${check2}`);
      console.log(`is not open ${check3}`);
    });
  });
});
