const helper = require("../hardhat-helpers");
const gas1 = 1e9;
const gas2 = 3e9;
const gas3 = 3e9;
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

      result = await aaa_contract.sendToken(account_0.address, account_1.address, 56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);

      const tokBal2 = await token_contract.balanceOf(account_1.address);
      console.log(`total 2 shares ${tokBal2}`);

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
