import { ethers } from "hardhat";
const helper = require("../hardhat-helpers");
import fs from "fs";
var nextStart = 1692476615;
var margin0, margin1;
const secondsInHour = 3600;
var receipt, hash, _hourSolidity, hourOffset, result, betData0;


//var finney = "1000000000000000"
const finneys = BigInt('10000000000000');
const eths = BigInt('1000000000000000000');
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
  console.log(`Token contract was deployed to ${token.address}`);

  const Betting = await ethers.getContractFactory("Betting");
  const betting = await Betting.deploy(token.address);
  await betting.deployed();
  console.log(`Betting contract was deployed to ${betting.address}`); 

  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await oracle.deployed();
  console.log(`Oracle contract was deployed to ${oracle.address}`);
  result = await betting.setOracleAddress(oracle.address);
  await result.wait();
  result = await token.setAdmin(oracle.address);
  await result.wait();
  result = await oracle.depositTokens(560n*million);
  await result.wait();
  console.log(`got here2`);
  const tokens = await token.balanceOf(accounts[0]);
  await result.wait();
  console.log(`tokens in eoa ${tokens}`);
  
 const tokensInK = (await oracle.adminStruct(accounts[0])).tokens;
 console.log(`tokens in k ${tokensInK}`);

  
  // result = await oracle.tokenReward();
  // await result.wait();

  
  result = await oracle.initPost(
    [
      "NFL:Abc:Atlanta",
      "NFL:Iowa:Cincin",
      "NFL:Mexico:Indian",
      "NFL:TampaBay:Minnesota",
      "NFL:Tennessee:NewOrlns",
      "NFL:Pittsburgh:SanFrancisco",
      "NFL:Washington:Arizona",
      "NFL:Baltimore:Houston",
      "NFL:Chicago:GreenBay",
      "NFL:Denver:LasVegas",
      "NFL:NewEngland:Philadelphia",
      "NFL:LosAngelesChargers:Miami",
      "NFL:Seattle:LosAngelesRams",
      "NFL:NewYorkGiants:Dallas",
      "CFL:FresnoState:EasternWashington",
      "CFL:UtahState:IdahoState",
      "CFL:WakeForest:Vanderbilt",
      "CFL:Army:DelawareState",
      "CFL:Nebraska:Colorado",
      "CFL:Georgia:BallState",
      "CFL:YoungstownState:OhioState",
      "CFL:Delaware:PennState",
      "CFL:Purdue:VirginiaTech",
      "CFL:Utah:Baylor",
      "CFL:NotreDame:NCState",
      "MMA:Adensanya:Strickland",
      "MMA:Tuivasa:Volkov",
      "MMA:Kara-France:Kape",
      "0",
      "0",
      "0",
      "0"],
      [
      1692461441,
      1692461441,
      1692461441,
      1692461441,
      1692461441,
      1692461441,
      1692461441,
      1692461441,
      1692465041,
      1692465041,
      1692465041,
      1692465041,
      1692465041,
      1692465041,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1692551441,
      1694300400,
      1694300400,
      1694300400,
      0,
      0,
      0,
      0],
      [
      500,
      600,
      700,
      800,
      900,
      999,
      693,
      572,
      485,
      419,
      367,
      326,
      292,
      263,
      239,
      218,
      200,
      184,
      229,
      374,
      918,
      676,
      537,
      723,
      371,
      177,
      126,
      956,
      126,
      126,
      126,
      126]
  );
  receipt = await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const revstat = await oracle.reviewStatus();
  console.log(`revStatus0 ${revstat}`);

  
  result = await oracle.processVote();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  receipt = await result.wait();
  await result.wait();
  result = await betting.params(3);
  console.log(`start1 ${result}`);
  const _timestamp = (
  await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  console.log(`time is2 ${_timestamp}`);
  

   result = await betting.fundBook({
    value: 30n*eths,
  });
  await result.wait();

  // result = await betting.connect(signers[1]).fundBook({
  //   value: 10n*eths,
  // });
  // await result.wait();
   await new Promise((resolve) => setTimeout(resolve, 5000));
 // result = await oracle.connect(signers[1]).tokenReward();

  const ownershares0 = (await betting.lpStruct(accounts[0])).shares;
      console.log(`acct0 shares3 ${ownershares0}`);
      const margin00 = await betting.margin(0);
      console.log(`margin04 ${margin00}`);
  //    await new Promise((resolve) => setTimeout(resolve, 50000));
  result = await betting.connect(signers[1]).fundBettor({
    value: 30n*eths,
  });
  receipt = await result.wait();

  await new Promise((resolve) => setTimeout(resolve, 5000));
  // result = await betting.connect(signers[2]).fundBettor({
  //   value: 20n*eths,
  // });
  // receipt = await result.wait();

 // await new Promise((resolve) => setTimeout(resolve, 50000));
  // result = await betting.connect(signers[1]).bet(0, 1, 7010);
  //     receipt = await result.wait();
  //     console.log(`fundbettor1`);
      result = await betting.connect(signers[1]).bet(0, 0, 1000);
      receipt = await result.wait();
      console.log(`fundbettor2`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      result = await betting.connect(signers[1]).bet(1, 1, 2000);
      receipt = await result.wait();
      console.log(`fundbettor3`);
      // result = await betting.connect(signers[1]).bet(0, 1, 7010);
      // receipt = await result.wait();
      // console.log(`fundbettor4`);
      // result = await betting.connect(signers[1]).bet(0, 1, 7005);
      // receipt = await result.wait();
      // console.log(`fundbettor5`);
  //    hash1100 = receipt.events[0].args.contractHash;
      // result = await betting.connect(signers[2]).bet(0, 0, 10000);
      // receipt = await result.wait();

      margin0 = await betting.margin(0);
      margin1 = await betting.margin(1);
      console.log(`margin0: ${margin0} margin1: ${margin1}`);


 

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
