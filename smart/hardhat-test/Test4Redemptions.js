const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var account2eo;
var redeemCheck;
var nextStart;
var result;
const finneys = BigInt("1000000000000000");
const gwei = BigInt("1000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

//boolean redeem2;

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
    await token.setAdmin(oracle.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  describe("Oracle", async () => {
    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 560n * million);
    });

    it("Deposit Tokens in Oracle Contract", async () => {
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
      await oracle.initPost(
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
          250, 500, 200, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );

      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("approve and send to betting contract", async () => {
      await oracle.processVote();
    });

    it("Fund Betting Contract", async () => {
      result = await betting.connect(owner).fundBook({
        value: 30n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on fundBook ${gasUsed}`);
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account2).fundBettor({
        value: 2n * eths,
      });
    });

    it("Fund Betting Contract with 200 finney", async () => {
      await betting.connect(account3).fundBettor({
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on fund ${gasUsed}`);
    });
  });

  describe("Send  Bets", async () => {
    let contractHash0;
    it("bet 10 on 0:0 (match 0: team 0)", async () => {
      const result = await betting.connect(account3).bet(0, 0, "10000");
      const receipt = await result.wait();
      contractHash0 = receipt.events[0].args.contractHash;
      const gasUsed = receipt.gasUsed;
      console.log(`gas on initial bet ${gasUsed}`);
      const result2 = await betting.connect(account3).bet(1, 0, "10000");
      const result3 = await betting.connect(account3).bet(3, 1, "10000");
    });

    let contractHash1;
    let contractHash1b;
    it("bet 10 on 0:1", async () => {
      const result2 = await betting.connect(account2).bet(0, 1, "10000");
      const receipt = await result2.wait();
      contractHash1 = receipt.events[0].args.contractHash;
      const gasUsed4 = receipt.gasUsed;
      console.log(`gas on fourth bet ${gasUsed4}`);
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
      var nextStart = _timestamp + 7 * 86400;
    });

    it("Send Event Results to oracle", async () => {
      await oracle.settlePost([
        1, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it("fast forward 12 hours", async () => {
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      _hour = _date.getHours();
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      it("fail: redeem attempt for account with active bets", async () => {
        await expect(betting.connect(account2).redeem()).to.be.reverted;
      });
    });

    it("send result data to betting contract", async () => {
      const result3 = await oracle.processVote();
      const receipt = await result3.wait();
      // const gasUsed = receipt.gasUsed;
      // console.log(`gas on Settlement ${gasUsed}`);
    });

    it("redeem  bet on 0:1 ", async () => {
      const result = await betting.connect(account2).redeem();
      const receipt = await result.wait();
      const gasUsed = receipt.gasUsed;
      console.log(`gas on redeem ${gasUsed}`);
    });

    it("fail: redeem attempt for account with no bets", async () => {
      await expect(betting.connect(account2).redeem()).to.be.reverted;
    });

    it("redeem attempt for losing bet on 0:0", async () => {
      await betting.connect(account3).redeem();
    });

    it("State Variables in Betting Contract after redemption from bettors", async () => {
      // const bettingKethbal = ethers.utils.formatUnits(
      //   await ethers.provider.getBalance(betting.address),
      //   "ether"
      // );
      // const userBalanceAcct2 =
      //   Number((await betting.userStruct(account2.address)).userBalance) /
      //   10000;
      // account2eo = ethers.utils.formatUnits(
      //   await ethers.provider.getBalance(account2.address),
      //   "ether"
      // );
      // console.log(`user2 contract balance ${userBalanceAcct2}`);
      // console.log(`bettingKethbal ${bettingKethbal}`);
      // console.log(`User2EOaccount ${account2eo}`);
      // assert.equal(bettingKethbal, "3486.365", "Must be equal");
      // assert.equal(userBalanceAcct2, "4590", "Must be equal");
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

      console.log(`oracleBal ${oracleBal}`);
      console.log(`bettingKethbal post Settle ${bettingKethbal}`);
      console.log(`Account2 bal preWD ${Number(userBalanceAcct2) / 10000}`);
      console.log(`Account2 increase in account value ${Acct2Increase}`);
      assert.equal(Number(oracleBal).toFixed(3), "0.394", "Must be equal");
      assert.equal(
        Number(bettingKethbal).toFixed(3),
        "25.595",
        "Must be equal"
      );
      assert.equal(Number(Acct2Increase).toFixed(3), "9.004", "Must be equal");
    });
  });
});
