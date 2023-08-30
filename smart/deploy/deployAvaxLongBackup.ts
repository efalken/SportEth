import { ethers } from "hardhat";
const helper = require("../hardhat-helpers");
import fs from "fs";
var nextStart = 1690656253;
const secondsInHour = 3600;
var receipt, hash, _hourSolidity, hourOffset, result, betData0;
var hash001, hash011, hash010, hash031, hash230, hash240, hash230, hash231, hash230b;
var hash1100, hash1201, hash1110, hash1131, hash2130, hash2140, hash2130, hash2131, hash2241, hash2240, hash2230, hash2131b, hash2130b, hash2231, hash1230;

//var finney = "1000000000000000"
const finneys = BigInt('1000000000000000');
const eths =    BigInt('100000000000000');
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
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log(`Token contract was deployed to ${token.address}`);

  const Betting = await ethers.getContractFactory("Betting");
  const betting = await Betting.deploy(token.address);
  await betting.deployed();
  console.log(`Betting contract was deployed to ${betting.address}`);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await oracle.deployed();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log(`Oracle contract was deployed to ${oracle.address}`);
  await betting.setOracleAddress(oracle.address);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.setAdmin(oracle.address);
  await new Promise((resolve) => setTimeout(resolve, 20000));

  result = await oracle.depositTokens(175n*million);
  await result.wait();
  console.log(`got here2`);
  await new Promise((resolve) => setTimeout(resolve, 20000));


  result = await token.transfer(accounts[1], 100n * million);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await token.transfer(accounts[2], 125n * million);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.transfer(betting.address, 600n * million);
  // result = await oracle.connect(signers[1]).depositTokens(250n*million);
  // await result.wait();
/*
  const _timestamp0 = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    console.log(`time is ${_timestamp0}`);
  */
  result = await oracle.initPost(
    [
      "NFL:one:Atlanta",
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
      "CFL:NotreDame:NCState",
      "MMA:Adensanya:Strickland",
      "MMA:Tuivasa:Volkov",
      "MMA:Kara-France:Kape",
    ],
      [
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1693086637,
      1694300400,
      1694300400,
      1694300400,
      1694300400,
      1694300400,
      1694300400,
      1694300400,
    ],
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
      126,]
  );
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 50000));
  console.log(`line 170`);
  
  result = await oracle.processVote();
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 50000));
  console.log(`line 184`);
  

   result = await betting.fundBook({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));

  result = await betting.tokenReward();
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));



  result = await betting.connect(signers[1]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log(`fundbettor ${margin00}`);

  result = await betting.connect(signers[2]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log(`fundbettor2 ${margin00}`);

  result = await betting.connect(signers[1]).bet(0, 1, 10000);
      receipt = await result.wait();
      console.log(`line 214`);
      await new Promise((resolve) => setTimeout(resolve, 20000));

      result = await betting.connect(signers[2]).bet(0, 0, 11000);
      receipt = await result.wait();
      console.log(`line 219`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      // console.log(`bet02 ${margin00}`);
      // hash1100 = receipt.events[0].args.contractHash;
      // hash1201 = receipt.events[0].args.contractHash;
      
      // result = await betting.connect(signers[1]).bet(1, 0, 12000);
      // receipt = await result.wait();
      // // await new Promise((resolve) => setTimeout(resolve, 20000));
      // hash1110 = receipt.events[0].args.contractHash;
      // result = await betting.connect(signers[2]).bet(1, 1, 13000);
      // receipt = await result.wait();
      // // await new Promise((resolve) => setTimeout(resolve, 20000));
      // result = await betting.connect(signers[1]).bet(3, 1, 14000);
      // receipt = await result.wait();
      // hash1131 = receipt.events[0].args.contractHash;
      // result = await betting.connect(signers[2]).bet(3, 0, 15000);
      // receipt = await result.wait();
      // hash1230 = receipt.events[0].args.contractHash;

      result = await oracle.settlePost([
        1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      console.log(`line 244`);
      await new Promise((resolve) => setTimeout(resolve, 25000));
  
      result = await oracle.processVote();
      
      receipt = result.wait();
      console.log(`line 250`);
      await new Promise((resolve) => setTimeout(resolve, 25000));
      result = await betting.tokenReward();
      await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
    // nextStart = nextStart + 7 * 24 * secondsInHour;
      result = await oracle.initPost(
        [
          "NFL:two:Atlanta",
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
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
          1693086637,
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
      receipt = result.wait();
      console.log(`line 355`);
      await new Promise((resolve) => setTimeout(resolve, 50000));
     
      result = await oracle.processVote();
      receipt = result.wait();
      console.log(`line 360`);
      await new Promise((resolve) => setTimeout(resolve, 50000));
      // result = await betting.connect(signers[1]).bet(0, 1, 13000);
      // receipt = await result.wait();
      // let hash101 = receipt.events[0].args.contractHash;
      // result = await betting.connect(signers[2]).bet(0, 0, 14000);
      // receipt = await result.wait();

      result = await betting.connect(signers[1]).bet(1, 0, 15000);
      receipt = await result.wait();
      console.log(`line 370`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[2]).bet(1, 1, 16000);
      receipt = await result.wait();
      console.log(`line 374`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
 
      result = await oracle.settlePost([
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      console.log(`line 382`);
      await new Promise((resolve) => setTimeout(resolve, 50000));

      result = await oracle.processVote();
      receipt = result.wait();
      console.log(`line 387`);
      await new Promise((resolve) => setTimeout(resolve, 50000));
      result = await betting.tokenReward();
      await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      
      result = await oracle.initPost(
        [
          "NFL:LAChargers:Atlanta",
          "NFL:KansasCity:Cincinnati",
          "NFL:LasVegas:Indianapolis",
          "NFL:TampaBay:Minnesota",
          "NFL:Tennessee:NewOrlns",
          "NFL:Pittsburgh:SanFrancisco",
          "NFL:Washington:Arizona",
          "NFL:Baltimore:Houston",
          "NFL:Chicago:GreenBay",
          "NFL:NewEngland:Philadelphia",
          "NFL:Denver:Miami",
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
          "MMA:Khabib:McGregor",
          "MMA:Adensanya:Strickland",
          "MMA:Tuivasa:Volkov",
          "MMA:Jones: Stipe",
          "0",
          "0",
          "0",
          "0",
          "0"],
          [
            1691859600,
            1691859600,
            1691859600,
            1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1691859600,
          1672531307,
          1672531307,
          1672531307,
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
      console.log(`line 492`);
      await new Promise((resolve) => setTimeout(resolve, 50000));
      result = await oracle.processVote();
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 15000));
      



      result = await betting.connect(signers[1]).bet(0, 0, 16000);
      receipt = await result.wait();
      console.log(`line 502`);
      let hash100 = receipt.events[0].args.contractHash;
      const moose = await betting.moose();
      console.log(`moose ${moose}`);
      const betepoch = await betting.params(0);
      console.log(`betepoch ${betepoch}`);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(2, 0, 20000);
      /*receipt = await result.wait();
      console.log(`bet ${betepoch}`);
      const bet2epoch = (await betting.userStruct(accounts[1]))
      .lastTransaction(1);
      receipt = await result.wait();
      console.log(`betepochArray ${bet2epoch}`);
      console.log(`betepoch2 ${bet2epoch[3]}`);*/

      /*
      const moose = await betting.moose();
      console.log(`moose ${moose}`);

      result = await oracle.connect(signers[0]).updatePost([
        800, 10448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      */
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
