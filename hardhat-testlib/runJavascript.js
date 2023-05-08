const helper = require("../hardhat-helpers");
const gas1 = 1e9;
const gas2 = 3e9;
const gas3 = 3e9;
var oracleBal;
const { ethers } = require("hardhat");


describe("test1", function () {
  let token, aaa, bbb, account_0, account_1, account_2;

  before(async () => {
   [account_0, account_1, account_2, _] = await ethers.getSigners();


console.log("account_0: " + account_0.address);
console.log("account_1: " + account_1.address);
    const Token = await ethers.getContractFactory('Token')
    const Bbb = await ethers.getContractFactory('Bbb')
    const Aaa = await ethers.getContractFactory('Aaa')
    token_contract = await Token.deploy(); 
    bbb_contract = await Bbb.deploy(); 
    aaa_contract = await Aaa.deploy(bbb_contract.address, token_contract.address);
  })
  
  describe("set up contract", async () => {

  

    it("basic transactions", async () => {
      result = await token_contract.approve(aaa_contract.address, 56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);

      result = await token_contract.transfer(aaa_contract.address, 4e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`sendToken`);

      oracleBal = await token_contract.balanceOf(account_1.address);
      console.log(`acct1 tokens1 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(account_0.address);
      console.log(`acct0 tokens1 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(aaa_contract.address);
      console.log(`aaa tokens ${oracleBal}`);

      result = await aaa_contract.sendToken2(account_1.address,123);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`sendToken`);

      oracleBal = await token_contract.balanceOf(account_1.address);
      console.log(`acct1 tokens2 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(account_0.address);
      console.log(`acct0 tokens2 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(aaa_contract.address);
      console.log(`aaa tokens2 ${oracleBal}`);

      result = await aaa_contract.sendToken3(account_1.address,123000);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`sendToken2`);

      oracleBal = await token_contract.balanceOf(account_1.address);
      console.log(`acct1 tokens3 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(account_0.address);
      console.log(`acct0 tokens3 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(aaa_contract.address);
      console.log(`aaa tokens3 ${oracleBal}`);

      result = await token_contract.transfer(account_1.address, 321);
      receipt = await result.wait();
      console.log(`transferToken`);


      oracleBal = await token_contract.balanceOf(account_1.address);
      console.log(`acct1 tokens4 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(account_0.address);
      console.log(`acct0 tokens4 ${oracleBal}`);
      oracleBal = await token_contract.balanceOf(aaa_contract.address);
      console.log(`aaa tokens4 ${oracleBal}`);

      result = await aaa_contract.set();
      receipt = await result.wait();

      result = await bbb_contract.sendEth({value: 9999});
      receipt = await result.wait();
      console.log("sendeth");

      result = await aaa_contract.connect(account_1).sendOnly(gas1);
      receipt = await result.wait();
      console.log("sendOnly");

      result = await aaa_contract.set();
      receipt = await result.wait();

      result = await aaa_contract.sendPay(gas2);
      receipt = await result.wait();
      console.log("sendPay");

      result = await aaa_contract.set();
      receipt = await result.wait();

      result = await aaa_contract.sendGet(gas3);
      receipt = await result.wait();
      console.log("sendGet");
    });

  });

});
