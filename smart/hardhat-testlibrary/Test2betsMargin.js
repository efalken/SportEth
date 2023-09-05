const helper = require("../hardhat-helpers");
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

    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    await token.setAdmin(oracle.address);
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
      nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
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
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas on secondSend = ${gasUsed}`);

      const bookpool = await betting.margin(0);
      console.log(`startTime is ${bookpool}`);
    });

    it("Fund Contract", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      console.log(`currTime is ${_timestamp}`);
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      console.log(`gas ${gasUsed}`);

      result = await betting.connect(account2).fundBettor({
        value: 10n * eths,
      });
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).fundBettor({
        value: 10n * eths,
      });
      const excessCapital = await betting.margin(0);
      console.log(`margin0 is ${excessCapital} szabo`);
      console.log(`acct1 is ${account1.address}`);
    });

    it("bets", async () => {
      result = await betting.connect(account2).bet(0, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash1 = receipt.events[0].args.contractHash;

      result = await betting.connect(account3).bet(0, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash2 = receipt.events[0].args.contractHash;

      result = await betting.connect(account2).bet(0, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash3 = receipt.events[0].args.contractHash;
      console.log(`gas on simple bet ${receipt.gasUsed}`);

      result = await betting.connect(account2).bet(1, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash4 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(1, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash5 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(1, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash6 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash7 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(2, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash8 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(2, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash9 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash10 = receipt.events[0].args.contractHash;
      result = await betting.connect(account2).bet(3, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash11 = receipt.events[0].args.contractHash;
      result = await betting.connect(account3).bet(3, 1, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      hash12 = receipt.events[0].args.contractHash;
      console.log(`gas ${gasUsed}`);
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
    });

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        0, 0, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      await oracle.processVote();
    });

    it("PostSettle", async () => {
      const bookiePool = Number(await betting.margin(0)) / 10000;
      const bettorLocked = Number(await betting.margin(2)) / 10000;
      const bookieLocked = Number(await betting.margin(1)) / 10000;
      const oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "ether"
      );
      const ethbal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(betting.address),
        "ether"
      );
      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingk balance ${ethbal}`);

      await betting.connect(account3).redeem();
      await betting.connect(account2).redeem();

      const userBalanceAcct2 =
        Number((await betting.userStruct(account2.address)).userBalance) /
        10000;

      const userBalanceAcct3 =
        Number((await betting.userStruct(account3.address)).userBalance) /
        10000;

      console.log(`bookiePool ${bookiePool}`);
      console.log(`bettorLocked ${bettorLocked}`);
      console.log(`bookieLocked ${bookieLocked}`);
      console.log(`oracleBal ${oracleBal}`);
      console.log(`ethbal in finney ${ethbal}`);
      console.log(`acct2 Bal ${userBalanceAcct2}`);
      console.log(`acct3 Bal ${userBalanceAcct3}`);

      assert.equal(Number(bookiePool).toFixed(2), "32.01", "mustBe equal");
      assert.equal(bettorLocked, "0", "Must be equal");
      assert.equal(bookieLocked, "0", "Must be equal");
      assert.equal(Number(oracleBal).toFixed(2), "0.20", "Must be equal");
      assert.equal(Number(ethbal).toFixed(2), "49.80", "Must be equal");
      assert.equal(
        Number(userBalanceAcct2).toFixed(2),
        "10.85",
        "Must be equal"
      );
      assert.equal(
        Number(userBalanceAcct3).toFixed(2),
        "6.94",
        "Must be equal"
      );
    });
  });
});
