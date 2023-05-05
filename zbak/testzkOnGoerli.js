
const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var gas1 = 25000;
var result ;
var receipt;
var gasUsed;
//const { expect } = require("chai");
//const { ethers } = require("hardhat");
const {assert} = require('chai');

require("chai").use(require("chai-as-promised")).should();

describe("test1", function () {
  let bbb, aaa, owner, account1, account2, account3;

  before(async () => {
    [owner, account1, account2, account3, _] = await ethers.getSigners();
    ethBalance = ethers.utils.formatUnits(await ethers.provider.getBalance(owner.address), "finney");
    console.log(`gas1 ${ethBalance}`);
    const Bbb = await ethers.getContractFactory('Bbb')
    const Aaa = await ethers.getContractFactory('Aaa')
    bbb = await Bbb.deploy();
    aaa = await Aaa.deploy(bbb.address, bbb.address);

  })

  describe("set up contract", async () => {
    it("Get Oracle Contract Address", async () => {
      console.log(`bbb Address is ${bbb.address}`);
      console.log(`aaa Address is ${aaa.address}`);
    });

    it("A1", async () => {
      result = await aaa.set();
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);
    });
    it("2", async () => {
      result = await aaa.connect(owner).sendOnly(gas1);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas  ${gasUsed}`);
    });
  });
  


});
