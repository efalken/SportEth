const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _timestamp0, diffTimeStamp, diffNextStart;
var nextStart;
var _date;
var _hour;
var result;
var receipt;
var tokensInBK;
const { assert } = require("chai");
const fujiAdj = 10000;
var fujiAdjn = BigInt(fujiAdj);
var eths = 1000000000000000000n;
//eths = eths / fujiAdjn;
const million = BigInt("1000000");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

describe("test rewards 0", function () {
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
    it("initial", async () => {
      await token.approve(oracle.address, 140n * million);
      await oracle.depositTokens(134n * million);
      await token.transfer(betting.address, 600n * million);
      await token.transfer(account1.address, 133n * million);
      await token.connect(account1).approve(oracle.address, 133n * million);
      await oracle.connect(account1).depositTokens(133n * million);
      await token.transfer(account2.address, 133n * million);
      await token.connect(account2).approve(oracle.address, 133n * million);
      await oracle.connect(account2).depositTokens(133n * million);
    });

    it("send init data", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
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
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();

      await betting.connect(owner).fundBook({
        value: 60n * eths,
      });
      await betting.connect(account1).fundBook({
        value: 40n * eths,
      });
      result = await betting.connect(account2).fundBettor({
        value: 50n * eths,
      });
    });

    it("send odds data", async () => {
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
      result = await betting.connect(account2).bet(0, 0, "50000");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;

      result = await oracle
        .connect(account2)
        .settleRefreshPost(
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
      result = await oracle.processVote();
      result = await betting.tokenReward();
      result = await betting.connect(account1).tokenReward();
    });
  });

  describe("Second Epoch", async () => {
    it("run week2", async () => {
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
      result = await betting.connect(account2).bet(0, 0, "50000");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account2)
        .settleRefreshPost(
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
      result = await betting.connect(account1).withdrawBook(50000);
      result = await betting.withdrawBook(100000);
    });
  });

  describe("Third Epoch", async () => {
    it("run week3", async () => {
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      result = await oracle
        .connect(account1)
        .oddsPost([
          999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]);
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      result = await betting.connect(account2).bet(0, 0, "50000");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account2)
        .settleRefreshPost(
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
      result = await betting.tokenReward();
      result = await betting.connect(account1).tokenReward();
    });
  });

  describe("Fourth Epoch", async () => {
    it("run week4", async () => {
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
      result = await betting.connect(account2).fundBook({
        value: 20n * eths,
      });
      await helper.advanceTimeAndBlock(secondsInHour * 15);
      result = await oracle.processVote();
      result = await betting.connect(account2).bet(0, 0, "50000");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      result = await oracle
        .connect(account2)
        .settleRefreshPost(
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
      result = await oracle.processVote();
      result = await betting.connect(account1).tokenReward();
      result = await betting.connect(account2).tokenReward();
    });

    it("checkData", async () => {
      const avax0 = (await betting.lpStruct(owner.address)).shares;
      const avax1 = (await betting.lpStruct(account1.address)).shares;
      const avax2 = (await betting.lpStruct(account2.address)).shares;
      const token0 = Number(await token.balanceOf(owner.address)) / 1000;
      const token1 = Number(await token.balanceOf(account1.address)) / 1000;
      const token2 = Number(await token.balanceOf(account2.address)) / 1000;
      console.log("avax0", avax0);
      console.log("avax1", avax1);
      console.log("avax2", avax2);
      console.log("token0", token0);
      console.log("token1", token1);
      console.log("token2", token2);
    });
  });

  describe("Fifth Epoch", async () => {
    it("run week5", async () => {
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
      result = await betting.connect(account2).bet(0, 0, "50000");
      _hourSolidity = Number(await oracle.hourOfDay());
      hourOffset = 24 - _hourSolidity;
      if (hourOffset > 21) hourOffset = 0;
      await helper.advanceTimeAndBlock((hourOffset + 7 * 24) * secondsInHour);
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart =
        _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 86400;
      await oracle
        .connect(account2)
        .settleRefreshPost(
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
      result = await betting.withdrawBook(500000);
      receipt1 = await result.wait();
      const avax0 = Number(receipt1.events[0].args.avax) / 10000;
      result = await betting.connect(account1).withdrawBook(350000);
      receipt1 = await result.wait();
      const avax1 = Number(receipt1.events[0].args.avax) / 10000;
      result = await betting.connect(account2).withdrawBook(172588);
      receipt1 = await result.wait();
      const avax2 = Number(receipt1.events[0].args.avax) / 10000;
      const token0 = Number(await token.balanceOf(owner.address)) / 1000;
      const token1 = Number(await token.balanceOf(account1.address)) / 1000;
      const token2 = Number(await token.balanceOf(account2.address)) / 1000;
      console.log("avax0", avax0);
      console.log("avax1", avax1);
      console.log("avax2", avax2);
      console.log("token0", token0);
      console.log("token1", token1);
      console.log("token2", token2);

      assert.equal(Number(avax0).toFixed(3), "62.831", "Must be equal");
      assert.equal(Number(avax1).toFixed(3), "43.981", "Must be equal");
      assert.equal(Number(avax2).toFixed(3), "21.688", "Must be equal");
      assert.equal(Number(token0).toFixed(0), "35647", "Must be equal");
      assert.equal(Number(token1).toFixed(0), "34621", "Must be equal");
      assert.equal(Number(token2).toFixed(0), "5063", "Must be equal");
    });
  });
});
