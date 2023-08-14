const web3 = require("web3-utils");
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var result;
var receipt;
var gasUsed;
var nextStart;
var gas0, gas1;

const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");
//const { expect } = require("chai");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

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
    it("New token balance", async () => {
      const tokBala = ethers.utils.formatUnits(
        await token.balanceOf(owner.address),
        "gwei"
      );
    });
  });

  describe("first epoch", async () => {
    it("transfer tokens to acct1", async () => {
      await token.transfer(account1.address, 450n * million);
      await oracle.depositTokens(400n * million);
      await oracle.connect(account1).depositTokens(450n * million);
      result = await betting.connect(owner).fundBook({
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas initBookFund ${gasUsed}`);
      result = await betting.connect(account1).fundBook({
        value: 3n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas initBokFund2 ${gasUsed}`);
      result = await betting.connect(account1).fundBettor({
        value: 1n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas initBettorFund ${gasUsed}`);
      result = await betting.connect(account2).fundBettor({
        value: 1n * eths,
      });
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas initBettorFund2 ${gasUsed}`);
    });

    it("New token balance", async () => {
      const tokBal10 = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "gwei"
      );
      const tokBal11 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account1.address)).tokens,
        "gwei"
      );
      const tokBal12 = ethers.utils.formatUnits(
        (await oracle.adminStruct(account2.address)).tokens,
        "gwei"
      );

      console.log(`tokBal owner ${tokBal10}`);
      console.log(`tokBal acct1 ${tokBal11}`);
      console.log(`tokBal12 ${tokBal12}`);
    });
  });
  /*
  describe("setupBets", async () => {
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
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on init ${gasUsed}`);
      result = await oracle.reviewStatus();
      console.log(`reviewStatus after init ${result}`);
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on vote ${gasUsed}`);
    });

    it("fail: try to send too soon", async () => {
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
    });

    it("fast forward 11 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      const result = await oracle.reviewStatus();
      console.log(`review2 ${result}`);
    });

    it("fail: try post odds to oracle", async () => {
      await expect(
        oracle.updatePost([
          900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ])
      ).to.be.reverted;
    });

    it("fail:try to send results, not initial data", async () => {
      await expect(oracle.processVote()).to.be.reverted;
    });

    it("approve and send correct data to betting contract", async () => {
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas processVote that loses ${gasUsed}`);
    });

    it("initSend2", async () => {
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
          998, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on init2 ${gasUsed}`);
      result = await oracle.reviewStatus();
      console.log(`reviewStatus after init2 ${result}`);
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on vote ${gasUsed}`);
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("approve and send init", async () => {
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas processVote that works ${gasUsed}`);
    });

    it("udatePost", async () => {
      _hourSolidity = await oracle.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
      if (_hourSolidity > 12) {
        hourOffset = 36 - _hourSolidity;
      } else if (_hourSolidity < 12) {
        hourOffset = 12 - _hourSolidity;
      }
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      //nextStart = _timestamp - ((_timestamp - 1690588800) % 604800) + 7 * 86400;
      result = await oracle.reviewStatus();
      console.log(`reviewStatus after init2 ${result}`);
      result = await oracle.updatePost([
        800, 600, 777, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      const gasInit = Number(receipt.gasUsed);
      console.log(`gas update ${gasInit}`);
    });

    it("fail: try to send too soon", async () => {
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
    });

    it("vote no on odds", async () => {
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on update Post ${gasUsed}`);
    });

    it("fast forward 12 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("fail: try post init", async () => {
      await expect(
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
            999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
            730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690,
            970, 760, 919, 720, 672, 800,
          ]
        )
      ).to.be.reverted;
    });

    it("process vote, should send odds", async () => {
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on update process fail ${gasUsed}`);
    });

    it("update odds", async () => {
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
      result = await oracle.updatePost([
        700, 700, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on update post2 ${gasUsed}`);
    });

    it("fast forward 11 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      const result = await oracle.reviewStatus();
      console.log(`review after updatePost ${result}`);
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas update that works ${gasUsed}`);
    });

    it("See updated odds, should be new 2000", async () => {
      result = await betting.connect(account1).bet(2, 1, "2000");
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on bet21 ${gasUsed}`);
      result = await betting.connect(account2).bet(2, 0, "2000");
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on bet20 ${gasUsed}`);
      result = await betting.connect(account1).bet(3, 1, "2000");
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on bet31 ${gasUsed}`);
      result = await betting.connect(account2).bet(3, 0, "2000");
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on bet30 ${gasUsed}`);
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
      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on init ${gasUsed}`);
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on vote ${gasUsed}`);
    });

    it("fail: processWrongdata", async () => {
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
      await expect(oracle.connect(owner).processVote()).to.be.reverted;
    });

    it("fast forward 11 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
      const result = await oracle.reviewStatus();
      console.log(`review2 ${result}`);
    });

    it("fail: try post odds to oracle", async () => {
      await expect(
        oracle.updatePost([
          900, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ])
      ).to.be.reverted;
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
      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on settle2 ${gasUsed}`);
      result = await oracle.connect(account1).vote(false);
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas on vote ${gasUsed}`);
    });

    it("fast forward 12 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 12);
    });

    it("approve and send correct data to betting contract", async () => {
      result = await oracle.processVote();
      receipt = await result.wait();
      gasUsed = Number(receipt.gasUsed);
      console.log(`gas processVote that goes through ${gasUsed}`);
    });
  });
  */
});
