import { ethers } from "hardhat";

const finneys = BigInt('1000000000000000');
var result;
var gasUsed;
var receipt;

async function main() {
  const signers = await ethers.getSigners();
  const accounts: string[] = [];
  for (const signer of signers) accounts.push(await signer.getAddress());
/*
  console.log(`Token contract was deployed to ${accounts[0]}`);
  console.log(`Token contract was deployed to ${accounts[1]}`);
*/
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Token contract was deployed to ${token.address}`);

  const Betting = await ethers.getContractFactory("Bbb");
  const betting = await Betting.deploy();
  await betting.deployed();
  console.log(`Betting contract was deployed to ${betting.address}`);

  const Oracle = await ethers.getContractFactory("Aaa");
  const aaa = await Oracle.deploy(betting.address, token.address);
  await aaa.deployed();
  console.log(`Oracle contract was deployed to ${aaa.address}`);
  ///await betting.setOracleAddress(aaa.address);

      result = await token.approve(token.address, 56e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on authorize ${gasUsed}`);

      result = await token.transfer(aaa.address, 4e7);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`sendToken`);

  /*
token.connect(acct_0??).approve(oracle.address, "560000000");
oracle.connect(acct_0??).depositTokens("560000000");
betting.connect(acct_0??).fundBook({value: 30n*finneys,});
betting.connect(acct_1??).fundBettor({value: 30n*finneys,});
betting.connect(acct_1??).bet(0, 0, 100);
*/

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
