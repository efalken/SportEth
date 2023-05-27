
const web3 = require("web3-utils");
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var _date;
var _hour;
var nextStart;
const {assert} = require('chai');
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');

require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory('Betting')
    const Token = await ethers.getContractFactory('Token')
    const Oracle = await ethers.getContractFactory('Oracle')
    const Reader = await ethers.getContractFactory('ReadSportEth')
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    reader = await Reader.deploy(betting.address, token.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  })

  describe("Preliminaries", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
    });

    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 560n*million);
    });

    it("Deposit Tokens in Oracle Contract", async () => {
      await oracle.connect(owner).depositTokens(560n*million);
    });
  });

  describe("setupBets", async () => {
    it("checkHour", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    nextStart = _timestamp + 7 * 86400;


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
          999,448,500,919,909,800,510,807,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
    });

    it("fast forward 4 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
    });

    it("Send Initial Data", async () => {
      await oracle.initProcess();
      const betdata0 = await betting.betData(0);
      console.log(`betdata0 ${betdata0}`);
    });

    it("approve and send to betting contract", async () => {
       await betting.connect(owner).fundBook({
        value: 3n*eths,
      });
      await betting.connect(account1).fundBettor({
        value: "2000000000000000000",
      });
      await betting.connect(account1).bet(7, 0, "1000");
      await betting.connect(account1).bet(7, 1, "500");
      const betData7 = await betting.betData(7);
      //const str = bn.toString(16);
      const str = betData7.toHexString(16).slice(2).padStart(64, "0");
      const pieces = str
        .match(/.{1,2}/g)
        .reverse()
        .join("")
        .match(/.{1,8}/g)
        .map((s) =>
          s
            .match(/.{1,2}/g)
            .reverse()
            .join("")
        );
      const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
      console.log("data7", ints);
      assert.equal(ints[0], "1000", "Must be equal");
      assert.equal(ints[1], "500", "Must be equal");
      assert.equal(ints[2], "807", "Must be equal");
      assert.equal(ints[3], "569", "Must be equal");
      assert.equal(ints[5], nextStart, "Must be equal");
      assert.equal(ints[6], "807", "Must be equal");
      assert.equal(ints[7], "1138", "Must be equal");
      console.log("0", ints[0]);
      console.log("0", ints[1]);
      console.log("0", ints[2]);
      console.log("0", ints[3]);
      console.log("0", ints[4]);
      console.log("0", ints[5]);
      console.log("0", ints[6]);
      console.log("0", ints[7]);
    });


    it("send updated odds data", async () => {
      _hourSolidity = await reader.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      hourOffset = 0;
     if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
     } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);

      await oracle.updatePost(
        [
          900,
          901,
          902,
          903,
          904,
          905,
          906,907,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
          ]
      );
    });

    it("fast forward 6 hours", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.updateProcess();
      const betData7b = await betting.betData(7);
      //const str = bn.toString(16);
      const strb = betData7b.toHexString(16).slice(2).padStart(64, "0");
      const piecesb = strb
        .match(/.{1,2}/g)
        .reverse()
        .join("")
        .match(/.{1,8}/g)
        .map((s) =>
          s
            .match(/.{1,2}/g)
            .reverse()
            .join("")
        );
      const intsb = piecesb.map((s) => parseInt("0x" + s)).reverse();
      console.log("data7b", intsb);
      console.log("0", intsb[0]);
      console.log("0", intsb[1]);
      console.log("0", intsb[2]);
      console.log("0", intsb[3]);
      console.log("0", intsb[4]);
      console.log("0", intsb[5]);
      console.log("0", intsb[6]);
      console.log("0", intsb[7]);
      
      console.log("data7b", intsb);
      assert.equal(intsb[0], "1000", "Must be equal");
      assert.equal(intsb[1], "500", "Must be equal");
      assert.equal(intsb[2], "807", "Must be equal");
      assert.equal(intsb[3], "569", "Must be equal");
      assert.equal(intsb[5], nextStart, "Must be equal");
      assert.equal(intsb[6], "907", "Must be equal");
      assert.equal(intsb[7], "1013", "Must be equal");
    });
  });
});
