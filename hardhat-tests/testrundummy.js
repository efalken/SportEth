
const helper = require("../hardhat-helpers");
var receipt;
var result;
const {assert} = require('chai');
const { expect } = require("chai");
require("chai").use(require("chai-as-promised")).should();

describe("test1", function () {
  let betting, oracle, token, owner, account_0, account2, account3;

  before(async () => {
    [owner, account_0, ] = await ethers.getSigners();
    const Test1 = await ethers.getContractFactory('Test')
    test1 = await Test1.deploy(); 
    console.log("owner: " + owner.address);
    console.log("account_0: " + account_0.address);
  })

  describe("test1", async () => {
    it("owner1", async () => {
      result = await test1.setData(888);
      receipt = await result.wait();
      result = await test1.seeBalance();
      console.log(`xxx ${result}`);
    });

      it("owneradj", async () => {
        result = await test1.connect(owner).setData(999);
        await result.wait();
        result = await test1.seeBalance();
        console.log(`xxx ${result}`);
      });
  });

});
