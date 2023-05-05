
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var gasUsed;
var receipt;
var result;
var ethBalance;
//const { expect } = require("chai");
//const { ethers } = require("hardhat");
//const {assert} = require('chai');  

require("chai").use(require("chai-as-promised")).should();

describe("test1", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    [owner, account1, account2, account3, _] = await ethers.getSigners();
    ethBalance = ethers.utils.formatUnits(await ethers.provider.getBalance(owner.address), "finney");
    console.log(`gas1 ${ethBalance}`);
    const Betting = await ethers.getContractFactory('Betting')
    const Token = await ethers.getContractFactory('Token')
    const Oracle = await ethers.getContractFactory('Oracle')
    token = await Token.deploy(); 
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    
    
  })

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`Oracle Address is ${oracle.address}`);
      console.log(`betting Address is ${betting.address}`);
      console.log(`token Address is ${token.address}`);
      console.log(`first Address is ${owner.address}`);
    });

    it("Authorize Oracle Token", async () => {
      result = await token.connect(owner).approve(oracle.address, 56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
    });
    it("Deposit Tokens in Oracle Contract2", async () => {
      result = await oracle.connect(owner).depositTokens(56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
      const numTokens = ethers.utils.formatUnits(
        (await oracle.adminStruct(owner.address)).tokens,
        "wei"
      );
      console.log(`tokens ${numTokens}`);
    });
  });


  describe("send init", async () => {
    it("part1", async () => {
      ethBalance = ethers.utils.formatUnits(await ethers.provider.getBalance(owner.address), "finney");
    console.log(`gas2 ${ethBalance}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      var nextStart = _timestamp + 7 * 86400;
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
          1000,
          2000,
          500,
          1000,
          909,
          800,
          510,
          1240,
          1470,
          960,
          650,
          1330,
          970,
          730,
          1310,
          1040,
          520,
          1020,
          1470,
          1200,
          1080,
          820,
          770,
          790,
          730,
          690,
          970,
          760,
          1000,
          720,
          1360,
          800,
        ]
      );
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on initsend ${gasUsed}`);
    });

    it("approve and send to betting contract", async () => {
      result = await oracle.initProcess();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
      ethBalance = ethers.utils.formatUnits(await ethers.provider.getBalance(owner.address), "finney");
    console.log(`gas2 ${ethBalance}`);
    });
  });
  

});
