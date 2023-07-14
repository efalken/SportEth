import { ethers } from "hardhat";
const helper = require("../hardhat-helpers");
import fs from "fs";
var nextStart = 1690063475;
const secondsInHour = 3600;
var receipt, hash, _hourSolidity, hourOffset, result, betData0;
var hash001, hash011, hash010, hash031, hash230, hash240, hash230, hash231, hash230b;
var hash1100, hash1201, hash1110, hash1131, hash2130, hash2140, hash2130, hash2131, hash2241, hash2240, hash2230, hash2131b, hash2130b, hash2231, hash1230;

//var finney = "1000000000000000"
const finneys = BigInt('1000000000000000');
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

  
  // result = await oracle.tokenReward();
  // await result.wait();

  
  result = await oracle.initPost(
    [
      "NFL:ARI:LAC",
      "NFL:ATL:LAR",
      "NFL:BAL:MIA",
      "NFL:BUF:MIN",
      "NFL:CAR:NE",
      "NFL:CHI:NO",
      "NFL:CIN:NYG",
      "NFL:CLE:NYJ",
      "NFL:DAL:OAK",
      "NFL:DEN:PHI",
      "NFL:DET:PIT",
      "NFL:GB:SEA",
      "NFL:HOU:SF",
      "NFL:IND:TB",
      "NFL:JAX:TEN",
      "NFL:KC:WSH",
      "UFC:Holloway:Kattar",
      "UFC:Ponzinibbio:Li",
      "UFC:Kelleher:Simon",
      "UFC:Hernandez:Vieria",
      "UFC:Akhemedov:Breese",
      "UFC:Memphis:Brooklyn",
      "UFC:Boston:Charlotte",
      "UFC:Milwaukee:Dallas",
      "UFC:miami:LALakers",
      "UFC:Atlanta:SanAntonia",
      "NHL:Colorado:Washington",
      "NHL:Vegas:StLouis",
      "NHL:TampaBay:Dallas",
      "NHL:Boston:Carolina",
      "NHL:Philadelphia:Edmonton",
      "NHL:Pittsburgh:NYIslanders",
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
    ],
    [999,500,600,999,999,999,999,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800]
  );
  await result.wait();
 

  
  result = await oracle.initProcess();
  await result.wait();
  result = await betting.params(3);
  console.log(`start ${result}`);
  const _timestamp = (
  await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  console.log(`time is ${_timestamp}`);
  

   result = await betting.fundBook({
    value: 100n*finneys,
  });
  await result.wait();

  const ownershares0 = (await betting.lpStruct(accounts[0])).shares;
      console.log(`acct0 shares ${ownershares0}`);
      const margin00 = await betting.margin(0);
      console.log(`margin0 ${margin00}`);

  result = await betting.connect(signers[1]).fundBettor({
    value: 200n*finneys,
  });
  await result.wait();
  console.log(`fundbettor`);

  result = await betting.connect(signers[2]).fundBettor({
    value: 200n*finneys,
  });
  await result.wait();
  console.log(`fundbettor`);

  result = await betting.connect(signers[1]).bet(0, 1, 1000);
      receipt = await result.wait();
      console.log(`bet01`);
  //    hash1100 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(0, 0, 1100);
      receipt = await result.wait();
 //     hash1201 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(1, 0, 1200);
      receipt = await result.wait();
   //   hash1110 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(1, 1, 1300);
      receipt = await result.wait();
      //hash4 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(3, 1, 1400);
      receipt = await result.wait();
   //   hash1131 = receipt.events[0].args.contractHash;
     // hash5 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(3, 0, 1500);
      receipt = await result.wait();
  //    hash1230 = receipt.events[0].args.contractHash;

      result = await oracle.settlePost([
        1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      console.log(`settlepost`);
     // await helper.advanceTimeAndBlock(48 * secondsInHour);
      result = await oracle.settleProcess();
      receipt = result.wait();
      console.log(`settleprocess`);
      //nextStart = nextStart + 7 * 24 * secondsInHour;
      result = await oracle.initPost(
        [
          "NFL:CLE:NYJ",
          "NFL:GB:SEA",
          "NFL:HOU:SF",
          "NFL:IND:TB",
          "NFL:JAX:TEN",
          "NFL:KC:WSH",
          "NFL:DAL:OAK",
          "NFL:DEN:PHI",
          "NFL:DET:PIT",
          "NFL:ARI:LAC",
          "NFL:ATL:LAR",
          "NFL:BAL:MIA",
          "NFL:BUF:MIN",
          "NFL:CAR:NE",
          "NFL:CHI:NO",
          "NFL:CIN:NYG",
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
          "NHL:Colorado:Washington",
          "NHL:Vegas:StLouis",
          "NHL:TampaBay:Dallas",
          "NHL:Boston:Carolina",
          "NHL:Philadelphia:Edmonton",
          "NHL:Pittsburgh:NYIslanders",
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
        ],
        [
          999, 500, 666, 777, 888, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = result.wait();
      console.log(`initpost`);
     
      result = await oracle.initProcess();
      receipt = result.wait();
      console.log(`initprocess`);

      result = await betting.connect(signers[1]).bet(0, 1, 1300);
      receipt = await result.wait();
      console.log(`bet process`);
   //   let hash101 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(0, 0, 1400);
      receipt = await result.wait();
   //   let hash200 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(1, 0, 1500);
      receipt = await result.wait();
   //   let hash110 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(1, 1, 1600);
      receipt = await result.wait();
    //  let hash211 = receipt.events[0].args.contractHash;
 
      result = await oracle.settlePost([
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      //await helper.advanceTimeAndBlock(48 * secondsInHour);
      result = await oracle.settleProcess();
      receipt = result.wait();

      //nextStart = nextStart + 7 * 24 * secondsInHour;
      
      /*
      result = await oracle.initPost(
        [
          "NHL:Colorado:Washington",
          "NHL:Vegas:StLouis",
          "NHL:TampaBay:Dallas",
          "NHL:Boston:Carolina",
          "NHL:Philadelphia:Edmonton",
          "NHL:Pittsburgh:NYIslanders",
          "NFL:ARI:LAC",
          "NFL:ATL:LAR",
          "NFL:BAL:MIA",
          "NFL:BUF:MIN",
          "NFL:CAR:NE",
          "NFL:CHI:NO",
          "NFL:CIN:NYG",
          "NFL:CLE:NYJ",
          "NFL:DAL:OAK",
          "NFL:DEN:PHI",
          "NFL:DET:PIT",
          "NFL:GB:SEA",
          "NFL:HOU:SF",
          "NFL:IND:TB",
          "NFL:JAX:TEN",
          "NFL:KC:WSH",
          "UFC:Holloway:Kattar",
          "UFC:Ponzinibbio:Li",
          "UFC:Kelleher:Simon",
          "UFC:Hernandez:Vieria",
          "UFC:Akhemedov:Breese",
          "UFC:Memphis:Brooklyn",
          "UFC:Boston:Charlotte",
          "UFC:Milwaukee:Dallas",
          "UFC:miami:LALakers",
          "UFC:Atlanta:SanAntonia",
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
        ],
        [
          555, 902, 903, 904, 905, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      result = await oracle.initProcess();
      receipt = await result.wait();

      const userBalanceAcct1 = (await betting.userStruct(accounts[1])).userBalance;
      const userBalanceAcct2 = (await betting.userStruct(accounts[2])).userBalance;
      const ownershares = (await betting.lpStruct(accounts[0])).shares;
      console.log(`acct1 balance ${userBalanceAcct1}`);
      console.log(`acct2 balance ${userBalanceAcct2}`);
      console.log(`acct0 shares ${ownershares}`);
      const margin0 = await betting.margin(0);
      console.log(`margin0 ${margin0}`);

      result = await betting.connect(signers[1]).bet(0, 0, 21000);
      receipt = await result.wait();
      let hash100 = receipt.events[0].args.contractHash;
      receipt = await result.wait();
      result = await betting.connect(signers[2]).bet(0, 1, 22000);
      receipt = await result.wait();
      let hash201 = receipt.events[0].args.contractHash;
      receipt = await result.wait();

      const userbets1 =  (await betting.betContracts(hash1100)).betAmount;
      console.log(`betsAcct hash ${hash1100}`);
      console.log(`betsAcct hash betAmount=10k ${userbets1}`);
      const userbets1b =  (await betting.betContracts(hash1100));
      console.log(`array ${userbets1b}`);
      console.log(`element in array ${userbets1b[0]}`);
      const userbets2 =  await betting.connect(signers[1]).showUserBetData();
      console.log(`acct1 hash ${userbets2[0]}`);
      const userbets3 =  await betting.connect(signers[1]).checkRedeem(hash1100);
      console.log(`redeem info ${userbets3}`);

      const userbets1c =  (await betting.betContracts(hash1201)).betAmount;
      console.log(`betsAcct hash ${hash1201}`);
      console.log(`betsAcct hash betAmount=10k ${userbets1c}`);
      const userbets1bc =  (await betting.betContracts(hash1201));
      console.log(`array ${userbets1bc}`);
      console.log(`element in array ${userbets1b[0]}`);
      const userbets2c =  await betting.connect(signers[1]).showUserBetData();
      console.log(`acct1 hash ${userbets2c[0]}`);
      const userbets3c =  await betting.connect(signers[1]).checkRedeem(hash1201);
      console.log(`redeem info ${userbets3c}`);


      const betParams0 = (await betting.betContracts(hash1100)).betAmount;
      console.log(`acct1 Amt 10000 ${betParams0}`);

      console.log(`betsAcct12 hash ${hash1201}`);
      console.log(`betsAcct 2 ${userbets2(0)}`);
  
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
