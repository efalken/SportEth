import { ethers } from "hardhat";
const helper = require("../hardhat-helpers");
import fs from "fs";
var nextStart = 1690658739;
const secondsInHour = 3600;
var receipt, hash, _hourSolidity, hourOffset, result, betData0;


//var finney = "1000000000000000"
const finneys = BigInt('10000000000000');
const eths = BigInt('10000000000000');
const million = BigInt('1000000');

function saveABIFile(
  fileName: string,
  content: string,
  dirPath = "../dapp/src/abis"
) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = `${dirPath}/${fileName}`;

  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }

  fs.writeFileSync(filePath, content);
}

async function main() {
  const signers = await ethers.getSigners();
  const accounts: string[] = [];
  for (const signer of signers) accounts.push(await signer.getAddress());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Token contract was deployed to ${token.address}`);
  console.log(`acct0  was deployed to ${accounts[0]}`);

  const Betting = await ethers.getContractFactory("Betting");
  const betting = await Betting.deploy(token.address);
  await betting.deployed();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Betting contract was deployed to ${betting.address}`);

  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await oracle.deployed();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Oracle contract was deployed to ${oracle.address}`);
  result = await betting.setOracleAddress(oracle.address);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  result = await token.setAdmin(oracle.address);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  result = await token.transfer(betting.address, 600n*million);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  result = await oracle.depositTokens(140n * million);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`got here2`);
  const tokens = await token.balanceOf(accounts[0]);
  const tokens2 = await token.balanceOf(betting.address);
  await result.wait();
  console.log(`tokens in eoa ${tokens} in betting ${tokens2}`);
  
 const tokensInK = (await oracle.adminStruct(accounts[0])).tokens;
 console.log(`tokens in k ${tokensInK}`);

  

      // ***************************************

  const chainId = (await ethers.provider.getNetwork()).chainId;

  const oracleABI = {
    name: "OracleMain",
    address: oracle.address,
    abi: JSON.parse(
      oracle.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: oracle.address } },
  };
  saveABIFile("Oracle.json", JSON.stringify(oracleABI));

  const bettingABI = {
    name: "BettingMain",
    address: betting.address,
    abi: JSON.parse(
      betting.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: betting.address } },
  };
  saveABIFile("Betting.json", JSON.stringify(bettingABI));

  const tokenABI = {
    name: "TokenMain",
    address: token.address,
    abi: JSON.parse(
      token.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: token.address } },
  };
  saveABIFile("Token.json", JSON.stringify(tokenABI));

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
