const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var nextStart;
var result;
const fujiAdj = 1;
var fujiAdjn = BigInt(fujiAdj);
var eths = 1000000000000000000n;
eths = eths / fujiAdjn;
const million = BigInt("1000000");
const gwei = BigInt("1000000000");
const { assert } = require("chai");
const { expect } = require("chai");
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
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("run trans", async () => {
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
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await oracle.processVote();
    });

    it("Fund Betting Contract", async () => {
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      await betting.connect(account2).fundBettor({
        value: 2n * eths,
      });
      await betting.connect(account3).fundBettor({
        value: 3n * eths,
      });
      receipt = await result.wait();
    });

    it("post odds", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      result = await oracle
        .connect(account1)
        .oddsPost([
          250, 500, 200, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
    });
  });

  describe("Send  Bets", async () => {
    let contractHash0;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      const result = await betting.connect(account3).bet(0, 0, "10000");
      const receipt = await result.wait();
      const result2 = await betting.connect(account3).bet(1, 0, "10000");
      const result3 = await betting.connect(account3).bet(3, 1, "10000");
    });

    let contractHash1;
    let contractHash1b;
    it("bet 10 on 0:1", async () => {
      const result2 = await betting.connect(account2).bet(0, 1, "10000");
      const userBalanceAcct2 = (await betting.userStruct(account2.address))
        .userBalance;
      console.log(`acct2 balance after bet ${userBalanceAcct2}`);
    });

    let contractHash21;
    it("bet 10 on 2:0 (match 2: team 1)", async () => {
      const result = await betting.connect(account2).bet(2, 1, "10000");
      const receipt = await result.wait();
      contractHash21 = receipt.events[0].args.contractHash;
    });

    it("Send Event Results to oracle", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle.settleRefreshPost(
        [
          1, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

    it("fail: redeem attempt for account with active bets", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      await expect(betting.connect(account2).redeem()).to.be.reverted;
    });

    it("redeem works once active bets settled", async () => {
      await oracle.processVote();
      await betting.connect(account2).redeem();
    });

    it("fail: redeem attempt for account with no bets", async () => {
      await expect(betting.connect(account2).redeem()).to.be.reverted;
    });

    it("redeem attempt for losing bet on 0:0", async () => {
      await betting.connect(account3).redeem();
    });

    it("State Variables in Betting Contract after Acct2 withdrawal", async () => {
      const userBalanceAcct2 = (await betting.userStruct(account2.address))
        .userBalance;
      const account2onK = ethers.utils.formatUnits(
        await ethers.provider.getBalance(account2.address),
        "ether"
      );
      const result = await betting
        .connect(account2)
        .withdrawBettor(userBalanceAcct2, { gasPrice: 200n * gwei });
      const tx = await ethers.provider.getTransaction(result.hash);
      const gasPrice = ethers.utils.formatUnits(tx.gasPrice, "gwei");
      const receipt = await result.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas Price (should be 200) = ${gasPrice}`);
      console.log(`gas on Withdraw = ${gasUsed}`);
      const oracleBal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(oracle.address),
        "ether"
      );
      const bettingKethbal = ethers.utils.formatUnits(
        await ethers.provider.getBalance(betting.address),
        "ether"
      );

      const Acct2EOaccount = ethers.utils.formatUnits(
        await ethers.provider.getBalance(account2.address),
        "ether"
      );
      const Acct2Increase = Number(Acct2EOaccount - account2onK).toFixed(3);

      console.log(`oracleBal ${Number(oracleBal).toFixed(3)}`);
      console.log(
        `bettingKethbal post Settle ${Number(bettingKethbal).toFixed(3)}`
      );
      console.log(`Account2 bal preWD ${Number(userBalanceAcct2)}`);
      console.log(
        `Account2 increase in account value ${Number(Acct2Increase).toFixed(3)}`
      );
      assert.equal(Number(oracleBal).toFixed(3), "0.394", "Must be equal");
      assert.equal(
        Number(bettingKethbal).toFixed(3),
        "25.594",
        "Must be equal"
      );
      assert.equal(Number(Acct2Increase).toFixed(3), "9.005", "Must be equal");
    });
  });
});
