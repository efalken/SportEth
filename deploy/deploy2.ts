import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
//import { ethers } from "hardhat";
//const stableperpabi = require('./stableperp.json');
const usd3 = BigInt('1000000000');
const eth0 = BigInt('100000000000000');
var result;

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  // Initialize the wallet.
  const account1 = new Wallet("0x1211c5bc2de20b2ac26444bc20653b64886a4d525209b872d8e00b0c8384bfdc");
  const account2 = new Wallet("0x2cac726f5a3ae12bae8c944af950bfcd282d84561fb78793b8e83f1219728dec");
  const account3 = new Wallet("0x70d8a5167f410e0e857218a57f930a2c1f04a1ab4bc8f1808a3502086abd90e5");

  //let accounts = await ethers.getSigners();

  const deployer = new Deployer(hre, account1);
  const ethprc = 40254804075;

  let artifact = await deployer.loadArtifact("UsdcReplicator");
  let USDCtoken = await deployer.deploy(artifact, []);
  console.log(`${artifact.contractName} was deployed to ${USDCtoken.address}`);

  artifact = await deployer.loadArtifact("UsdXToken");
  let usdXtoken = await deployer.deploy(artifact, []);
  console.log(`${artifact.contractName} was deployed to ${usdXtoken.address}`);

  artifact = await deployer.loadArtifact("EquityToken");
  let equitytoken = await deployer.deploy(artifact, [usdXtoken.address]);
  console.log("constructor args:" + equitytoken.interface.encodeDeploy([usdXtoken.address]));
  console.log(`${artifact.contractName} was deployed to ${equitytoken.address}`);

  artifact = await deployer.loadArtifact("StablePerp");
  let stableperp = await deployer.deploy(artifact, [ethprc, usdXtoken.address, equitytoken.address, USDCtoken.address]);
  console.log("constructor args:" + stableperp.interface.encodeDeploy([ethprc, usdXtoken.address, equitytoken.address, USDCtoken.address]));
  console.log(`${artifact.contractName} was deployed to ${stableperp.address}`);

  result = await usdXtoken.setSpecial(stableperp.address, equitytoken.address);
  result = await USDCtoken.mint(account1.address, 400n*usd3);
  result = await USDCtoken.mint(account2.address, 400n*usd3);
  result = await USDCtoken.mint(account3.address, 400n*usd3);
  result = await USDCtoken.connect(account1).approve(stableperp.address, 400n*usd3);
  result = await USDCtoken.connect(account2).approve(stableperp.address, 400n*usd3);
  result = await USDCtoken.connect(account3).approve(stableperp.address, 400n*usd3);
  result = await stableperp.connect(account2).fundETH({value: 100n*eth0});
  result = await stableperp.connect(account2).fundUSDC(100n*usd3);
  result = await stableperp.connect(account1).addLiquidity({value: 30n*eth0});
  result = await stableperp.connect(account3).addLiquidity({value: 30n*eth0});
  result = await stableperp.connect(account3).updateTrader(account2.address);
  let price = (await stableperp.tradeParams()).sqrtPrice;
  let liq = (await stableperp.tradeParams()).totLiquidity;
  console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
  result = await stableperp.connect(account2).swap(-"1.5e2", "100", account2.address);

/*
  let result = await usdXtoken.myFunction([88]);
  let receipt = await result.wait();
  console.log(`see if 88: ${account1.address}`);
  let amount1 = 400n*usd3;
  console.log(`see if 88: ${amount1}`);
  result = await USDCtoken.mint(account1.address, amount1);*/

}