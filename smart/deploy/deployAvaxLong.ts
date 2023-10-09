import { ethers } from "hardhat";
const helper = require("../hardhat-helpers");
import fs from "fs";
var nextStart = 1690656253;
var receipt, _timestamp, result;
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
  const Betting = await ethers.getContractFactory("BettingFuji");
  const betting = await Betting.deploy(token.address);
  await betting.deployed();
  console.log(`Betting contract was deployed to ${betting.address}`);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  const Oracle = await ethers.getContractFactory("OracleFuji");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await oracle.deployed();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log(`Oracle contract was deployed to ${oracle.address}`);
  await betting.setOracleAddress(oracle.address);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.approve(oracle.address, 140n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await oracle.depositTokens(140n*million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.transfer(accounts[1], 130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.connect(signers[1]).approve(oracle.address, 130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await oracle.connect(signers[1]).depositTokens(130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.transfer(accounts[2], 130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await token.connect(signers[2]).approve(oracle.address, 130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await oracle.connect(signers[2]).depositTokens(130n * million);
  await new Promise((resolve) => setTimeout(resolve, 20000));

  console.log(`got here2`);
  await new Promise((resolve) => setTimeout(resolve, 20000));

  result = await token.transfer(accounts[2], 130n * million);
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));

  await token.transfer(betting.address, 80n * million);
  console.log(`got here3`);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart = _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 1 * 86400;

  result = await oracle.settleRefreshPost(
    [
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
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
      "NCAAF:FresnoState:EasternWashington",
      "NCAAF:UtahState:IdahoState",
      "NCAAF:WakeForest:Vanderbilt",
      "NCAAF:Army:DelawareState",
      "NCAAF:Nebraska:Colorado",
      "NCAAF:Georgia:BallState",
      "NCAAF:YoungstownState:OhioState",
      "NCAAF:Delaware:PennState",
      "NCAAF:Purdue:VirginiaTech",
      "NCAAF:Utah:Baylor",
      "NCAAF:NotreDame:NCState",
      "MMA:Adensanya:Strickland",
      "MMA:Tuivasa:Volkov",
      "MMA:Kara-France:Kape",
      "NCAAF:NotreDame:NCState",
      "MMA:Adensanya:Strickland",
      "MMA:Tuivasa:Volkov",
      "MMA:Kara-France:Kape",
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
    ]
  );
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  console.log("line149");
  await oracle.connect(signers[1]).vote(true);
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await oracle.processVote();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await oracle.connect(signers[1]).oddsPost([
    999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
    699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
    919, 720, 672, 800,
  ]);
  receipt = await result.wait();
  
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await oracle.vote(true);
  await new Promise((resolve) => setTimeout(resolve, 20000));
   result = await betting.fundBook({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));


  
  result = await oracle.processVote();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  

  result = await betting.connect(signers[1]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await betting.connect(signers[2]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  await new Promise((resolve) => setTimeout(resolve, 20000));
  result = await betting.connect(signers[1]).bet(2, 1, 10000);
      receipt = await result.wait();
      console.log(`line 214`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[2]).bet(2, 0, 10000);
      receipt = await result.wait();
      console.log(`line 219`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.settlePost([
        1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      console.log(`line 244`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
    await oracle.connect(signers[1]).vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      receipt = result.wait();
      result = await betting.tokenReward();
      await new Promise((resolve) => setTimeout(resolve, 20000));
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
      result = await oracle.connect(signers[1]).initPost(
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
          "NCAAF:FresnoState:EasternWashington",
          "NCAAF:UtahState:IdahoState",
          "NCAAF:WakeForest:Vanderbilt",
          "NCAAF:Army:DelawareState",
          "NCAAF:Nebraska:Colorado",
          "NCAAF:Georgia:BallState",
          "NCAAF:YoungstownState:OhioState",
          "NCAAF:Delaware:PennState",
          "NCAAF:Purdue:VirginiaTech",
          "NCAAF:Utah:Baylor",
          "NCAAF:NotreDame:NCState",
          "MMA:Adensanya:Strickland",
          "MMA:Tuivasa:Volkov",
          "MMA:Kara-France:Kape",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::"],
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
          nextStart]
      );
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
    await oracle.vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.oddsPost([
        888, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.connect(signers[1]).vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      console.log(`line 360`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[1]).bet(1, 0, 10000);
      receipt = await result.wait();
      console.log(`line 370`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[2]).bet(1, 1, 10000);
      receipt = await result.wait();
      console.log(`line 374`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
 
      result = await oracle.connect(signers[1]).settlePost([
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
      
      result = await oracle.initPost(
        [
          "NFL:three:Atlanta",
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
          "NCAAF:FresnoState:EasternWashington",
          "NCAAF:UtahState:IdahoState",
          "NCAAF:WakeForest:Vanderbilt",
          "NCAAF:Army:DelawareState",
          "NCAAF:Nebraska:Colorado",
          "NCAAF:Georgia:BallState",
          "NCAAF:YoungstownState:OhioState",
          "NCAAF:Delaware:PennState",
          "NCAAF:Purdue:VirginiaTech",
          "NCAAF:Utah:Baylor",
          "MMA:Khabib:McGregor",
          "MMA:Adensanya:Strickland",
          "MMA:Tuivasa:Volkov",
          "MMA:Jones: Stipe",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::"],
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
          nextStart]
      );
      receipt = await result.wait();
      console.log(`line 492`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.connect(signers[1]).vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.connect(signers[1]).oddsPost([
        777, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));

      result = await oracle.settlePost([
        1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      console.log(`line 244`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
    await oracle.connect(signers[1]).vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      receipt = result.wait();
      result = await betting.tokenReward();
      await new Promise((resolve) => setTimeout(resolve, 20000));
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
      result = await oracle.connect(signers[1]).initPost(
        [
          "NFL:four:Atlanta",
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
          "NCAAF:FresnoState:EasternWashington",
          "NCAAF:UtahState:IdahoState",
          "NCAAF:WakeForest:Vanderbilt",
          "NCAAF:Army:DelawareState",
          "NCAAF:Nebraska:Colorado",
          "NCAAF:Georgia:BallState",
          "NCAAF:YoungstownState:OhioState",
          "NCAAF:Delaware:PennState",
          "NCAAF:Purdue:VirginiaTech",
          "NCAAF:Utah:Baylor",
          "NCAAF:NotreDame:NCState",
          "MMA:Adensanya:Strickland",
          "MMA:Tuivasa:Volkov",
          "MMA:Kara-France:Kape",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::"],
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
          nextStart]
      );
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
    await oracle.vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.oddsPost([
        666, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.connect(signers[1]).vote(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      console.log(`line 360`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[1]).bet(1, 0, 10000);
      receipt = await result.wait();
      console.log(`line 370`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await betting.connect(signers[2]).bet(1, 1, 10000);
      receipt = await result.wait();
      console.log(`line 374`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
 
      result = await oracle.connect(signers[1]).settlePost([
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      _timestamp = (
        await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      ).timestamp;
      nextStart = _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
      
      result = await oracle.initPost(
        [
          "NFL:five:Atlanta",
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
          "NCAAF:FresnoState:EasternWashington",
          "NCAAF:UtahState:IdahoState",
          "NCAAF:WakeForest:Vanderbilt",
          "NCAAF:Army:DelawareState",
          "NCAAF:Nebraska:Colorado",
          "NCAAF:Georgia:BallState",
          "NCAAF:YoungstownState:OhioState",
          "NCAAF:Delaware:PennState",
          "NCAAF:Purdue:VirginiaTech",
          "NCAAF:Utah:Baylor",
          "MMA:Khabib:McGregor",
          "MMA:Adensanya:Strickland",
          "MMA:Tuivasa:Volkov",
          "MMA:Jones: Stipe",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::",
          "AAA::"],
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
          nextStart]
      );
      receipt = await result.wait();
      console.log(`line 492`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.connect(signers[1]).vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.connect(signers[1]).oddsPost([
        555, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await oracle.vote(true);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      result = await oracle.processVote();
      await new Promise((resolve) => setTimeout(resolve, 20000));
      //result = await oracle.haltUnhaltMatch(1);
      


/*
      result = await betting.connect(signers[2]).bet(0, 0, 16000);
      receipt = await result.wait();
      let hash100 = receipt.events[0].args.contractHash;
      const betepoch = await betting.bettingStatus();
      receipt = await result.wait();
      result = await betting.connect(signers[2]).bet(2, 0, 20000);
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
