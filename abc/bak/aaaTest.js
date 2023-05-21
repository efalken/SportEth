
const helper = require("../../hardhat-helpers");
const web3 = require('web3');
const { ethers } = require("hardhat");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;
var hourOffset;
var _hourSolidity;
var nextStart;
var _timestamp;
var _date;
var _hour;
var tokens0;
var tokens1;
var tokens1;
var tokens2;
var tokens3;
var tokenstot;
var feepool;
var oracleBal;
var betEpoc;
var ethout8;
var ethout;
var tokensout;
var result;
var receipt;
var gasUsed;
const {assert} = require('chai');
const finneys = BigInt('1000000000000000');
const eths = BigInt('1000000000000000000');
const million = BigInt('1000000');

require("chai").use(require("chai-as-promised")).should();

describe("Betting", function () {
  let betting, oracle, token, owner, account1, account2, account3, account4, account5, account6;

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
    [owner, account1, account2, account3, account4, account5, account6, _] = await ethers.getSigners();
  })

  describe("initial contract with one token owner", async () => {
    it("Authorize Oracle Token", async () => {
      await token.approve(oracle.address, 250n*million);
    });

    it("Deposit Tokens in Oracle Contract0", async () => {
      await oracle.depositTokens(250n*million);
    });

    it("transfer tokens to betting account", async () => {
      await token.transfer(betting.address, 250n*million);
    });
  });

  describe("initial contract with one token owner", async () => {
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
          800,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
    });

    it("Send  Bet #1", async () => {
      await betting.connect(account4).fundBook({
        value: 5n*eths,
      });
      await betting.connect(account5).fundBettor({
        value: 5n*eths,
      });
      result = await betting.connect(account5).bet(0, 0, "2500");
      receipt = await result.wait()
      contractHash1 = receipt.events[0].args.contractHash;
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
      await oracle.settlePost([
        0,
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

      it("bump1", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 1", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      const feePool = await oracle.params2(3);
      const totTokens = await oracle.params2(0);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
      console.log(`tot tokens ${totTokens}`);
     // await betting.connect(account5).redeem(contractHash1);
      const tokens5 = await token.balanceOf(account5.address);
      console.log(`tot tokens acct5 ${tokens5}`);
    });
  });

  describe("Second epoch with two oracles", async () => {
    it("acct 1 send tokens to oracle", async () => {
      await token.transfer(account1.address, 150n*million);
      await token.connect(account1).approve(oracle.address, 150n*million);
      await oracle.connect(account1).depositTokens(150n*million);
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
          800,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
    });

    it("Send  Bet #2", async () => {
      result = await betting.connect(account5).bet(0, 0, "2500");
      receipt = await result.wait()
      const odds = ethers.utils.formatUnits(receipt.events[0].args.payoff, "finney");
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
      await oracle.settlePost([
        0,
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

    it("bump and process", async () => {
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });

    it("check 2", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params2(3);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
    });
  });

  describe("third epoch with three oracles", async () => {
    it("transfer tokens from account 2", async () => {
      result0 = await token.transfer(account2.address, 100n*million);
      receipt0 = await result0.wait();
      result1 = await token.connect(account2).approve(oracle.address, 100n*million);
      receipt1 = await result1.wait();
      result2 = await oracle.connect(account2).depositTokens(100n*million);
      receipt2 = await result2.wait();
      const gasUsed0 = receipt0.gasUsed;
      console.log(`gas on tokenTransfer0 ${gasUsed0}`);
      const gasUsed1 = receipt1.gasUsed;
      console.log(`gas on tokenTransfer1 ${gasUsed1}`);
      const gasUsed2 = receipt2.gasUsed;
      console.log(`gas on tokenTransfer2 ${gasUsed2}`);
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
          800,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,
        ]
      );
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.initProcess();
      result = await betting.connect(account5).bet(0, 0, "2500");
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
      await oracle.settlePost([
        0,
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

    it("bump settle", async () => {
      await helper.advanceTimeAndBlock(secondsInHour * 6);
      await oracle.settleProcess();
    });
      it("checkfees", async () => {
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      feePool = await oracle.params2(3);
      console.log(`eth in Oracle Contract ${oracleBal}`);
      console.log(`feePool Tracker ${feePool}`);
    });

    it("newfunds", async () => {
      tokens0 = (await oracle.adminStruct(owner.address)).tokens;
      tokens1 = await token.balanceOf(owner.address);
      tokens2 = await token.balanceOf(oracle.address);
      console.log(`acct0 tokens in userAcct, ${tokens0}`);
      console.log(`acct0 tokens in EOA, ${tokens1}`);
      console.log(`acct0 tokens in K, ${tokens2}`);
      //console.log(`tokens Tracker ${tokens0}`);
      //await token.approve(oracle.address, 50n*million);
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      console.log(`oracle ETH, ${oracleBal}`);
      const feepuul = await oracle.params2(3);
      console.log(`feepool, ${feepuul}`);

      result = await oracle.withdrawTokens(50n*million);

      receipt = await result.wait();
      tokens0 = (await oracle.adminStruct(owner.address)).tokens;
      tokens1 = await token.balanceOf(owner.address);
      tokens2 = await token.balanceOf(oracle.address);
      console.log(`acct0 tokens in userAcct, ${tokens0}`);
      console.log(`acct0 tokens in EOA, ${tokens1}`);
      console.log(`acct0 tokens in K, ${tokens2}`);


      ethout = ethers.utils.formatUnits(receipt.events[1].args.etherChange, "finney");
      console.log(`ether Out ${ethout}`);
      tokensout = receipt.events[1].args.tokensChange;
      oracleBal = ethers.utils.formatUnits(await ethers.provider.getBalance(oracle.address), "finney");
      //assert.equal(ethout, "21.25", "Must be equal");

        const moosey = ethers.utils.formatUnits(await oracle.moose(), "finney");
        console.log(`moose, ${moosey}`);
        const moosey2 = await oracle.moose();
        console.log(`moose, ${moosey2}`);
      });
  });

});
