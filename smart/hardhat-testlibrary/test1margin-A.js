const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset, _hourSolidity, _timestamp, nextStart, result, receipt, gasUsed;

const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const fujiAdj = 1;
var fujiAdjn = BigInt(fujiAdj);
var eths = 1000000000000000000n;
eths = eths / fujiAdjn;
const million = BigInt("1000000");

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
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("run transactions", async () => {
    it("create oracle accounts", async () => {
      await token.approve(oracle.address, 140n * million);
      await oracle.connect(owner).depositTokens(140n * million);
      result = await token.transfer(account1.address, 140n * million);
      result = await token
        .connect(account1)
        .approve(oracle.address, 140n * million);
      result = await oracle.connect(account1).depositTokens(140n * million);
    });

    it("send init", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      const revStat = await oracle.reviewStatus();
      console.log(revStat, "revStat");
      result = await oracle.settleRefreshPost(
        [
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
          "NFL:ARI:LAC",
          "MMA:Holloway:Kattar",
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
          "MMA:Holloway:Kattar",
          "MMA:Ponzinibbio:Li",
          "MMA:Kelleher:Simon",
          "MMA:Hernandez:Vieria",
          "MMA:Akhemedov:Breese",
          "NCAAF: Mich: OhioState",
          "NCAAF: Minn : Illinois",
          "NCAAF: MiamiU: Florida",
          "NCAAF: USC: UCLA",
          "NCAAF: Alabama: Auburn",
          "NCAAF: ArizonaSt: UofAriz",
          "NCAAF: Georgia: Clemson",
          "NCAAF: PennState: Indiana",
          "NCAAF: Texas: TexasA&M",
          "NCAAF: Utah: BYU",
          "NCAAF: Rutgers: VirgTech",
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
        ]
      );
      receipt = await result.wait();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("Fund Contract", async () => {
      const betactive0 = await betting.bettingActive();
      console.log(betactive0, "betactive");
      const revStat = await oracle.reviewStatus();
      console.log(revStat, "revStat");
      const ethcheck = 30n * eths;
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });

      result = await betting.connect(account2).fundBettor({
        value: 10n * eths,
      });
      result = await betting.connect(account3).fundBettor({
        value: 10n * eths,
      });
    });

    it("send odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });

    it("bets", async () => {
      result = await betting.connect(account2).bet(0, 0, "10000");
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      result = await betting.connect(account3).bet(0, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).bet(0, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).bet(1, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).bet(1, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).bet(1, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account2).bet(2, 0, "10000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
      result = await betting.connect(account3).bet(2, 1, "20000");
      receipt = await result.wait();
      gasUsed = gasUsed.add(receipt.gasUsed);
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
      console.log(`gas ${gasUsed / 12}`);
    });

    it("PreSettle", async () => {
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
      console.log(`eth in bettingK ${ethbal}`);
      console.log(`acct2 Bal ${userBalanceAcct2}`);
      console.log(`acct3 Bal ${userBalanceAcct3}`);
    });

    it("Send Event Results to oracle", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 6 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
          "NFL:ARI:LAC",
          "MMA:Holloway:Kattar",
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
          "MMA:Holloway:Kattar",
          "MMA:Ponzinibbio:Li",
          "MMA:Kelleher:Simon",
          "MMA:Hernandez:Vieria",
          "MMA:Akhemedov:Breese",
          "NCAAF: Mich: OhioState",
          "NCAAF: Minn : Illinois",
          "NCAAF: MiamiU: Florida",
          "NCAAF: USC: UCLA",
          "NCAAF: Alabama: Auburn",
          "NCAAF: ArizonaSt: UofAriz",
          "NCAAF: Georgia: Clemson",
          "NCAAF: PennState: Indiana",
          "NCAAF: Texas: TexasA&M",
          "NCAAF: Utah: BYU",
          "NCAAF: Rutgers: VirgTech",
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
        ]
      );
    });

    it("send result data to betting contract", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 15);
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
      console.log(`eth in bettingK ${ethbal}`);
      console.log(`acct2 Bal ${userBalanceAcct2}`);
      console.log(`acct3 Bal ${userBalanceAcct3}`);

      assert.equal(Number(bookiePool).toFixed(2), "29.59", "mustBe equal");
      assert.equal(Number(bettorLocked).toFixed(0), "0", "Must be equal");
      assert.equal(Number(bookieLocked).toFixed(0), "0", "Must be equal");
      assert.equal(
        Number(oracleBal * fujiAdj).toFixed(2),
        "0.32",
        "Must be equal"
      );
      assert.equal(
        Number(ethbal * fujiAdj).toFixed(2),
        "49.68",
        "Must be equal"
      );
      assert.equal(
        Number(userBalanceAcct2).toFixed(2),
        "6.95",
        "Must be equal"
      );
      assert.equal(
        Number(userBalanceAcct3).toFixed(2),
        "13.13",
        "Must be equal"
      );
    });
  });
});
