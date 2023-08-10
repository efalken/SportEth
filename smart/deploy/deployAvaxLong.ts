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
const eths =    BigInt('1000000000000000000');
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
  await betting.setOracleAddress(oracle.address);

  await token.setAdmin(oracle.address);

  result = await oracle.depositTokens(500n*million);
  await result.wait();
  console.log(`got here2`);

  result = await token.transfer(accounts[1], 250n * million);
  await result.wait();
  result = await oracle.connect(signers[1]).depositTokens(250n*million);
  await result.wait();

  const _timestamp0 = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    console.log(`time is ${_timestamp0}`);
  
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
 

  
  result = await oracle.processVote();
  await result.wait();
  result = await betting.params(3);
  console.log(`start ${result}`);
  const _timestamp = (
  await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  console.log(`time is ${_timestamp}`);
  

   result = await betting.fundBook({
    value: 10n*eths,
  });
  await result.wait();

  const ownershares0 = (await betting.lpStruct(accounts[0])).shares;
      console.log(`acct0 shares ${ownershares0}`);
      const margin00 = await betting.margin(0);
      console.log(`margin0 ${margin00}`);

  result = await betting.connect(signers[1]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  console.log(`fundbettor ${margin00}`);

  result = await betting.connect(signers[2]).fundBettor({
    value: 20n*eths,
  });
  await result.wait();
  console.log(`fundbettor2 ${margin00}`);

  result = await betting.connect(signers[1]).bet(0, 1, 10000);
      receipt = await result.wait();

      
      console.log(`bet01 ${margin00}`);
      hash1100 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(0, 0, 11000);
      receipt = await result.wait();
      console.log(`bet02 ${margin00}`);
      hash1100 = receipt.events[0].args.contractHash;
      hash1201 = receipt.events[0].args.contractHash;
      
      result = await betting.connect(signers[1]).bet(1, 0, 12000);
      receipt = await result.wait();
      hash1110 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(1, 1, 13000);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(3, 1, 14000);
      receipt = await result.wait();
      hash1131 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(3, 0, 15000);
      receipt = await result.wait();
      hash1230 = receipt.events[0].args.contractHash;

      result = await oracle.settlePost([
        1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      await helper.advanceTimeAndBlock(48 * secondsInHour);
      result = await oracle.processVote();
      receipt = result.wait();
      nextStart = nextStart + 7 * 24 * secondsInHour;
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 10500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
          730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970,
          760, 919, 720, 672, 800,
        ]
      );
      receipt = result.wait();
     
      result = await oracle.processVote();
      receipt = result.wait();

      result = await betting.connect(signers[1]).bet(0, 1, 13000);
      receipt = await result.wait();
      let hash101 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(0, 0, 14000);
      receipt = await result.wait();
      let hash200 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(1, 0, 15000);
      receipt = await result.wait();
      let hash110 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(1, 1, 16000);
      receipt = await result.wait();
      let hash211 = receipt.events[0].args.contractHash;
 
      result = await oracle.settlePost([
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      await helper.advanceTimeAndBlock(48 * secondsInHour);
      result = await oracle.processVote();
      receipt = result.wait();
      
      
      result = await oracle.initPost(
        [
          "NFL:ARI:LAC",
          "UFC:Holloway:Kattar",
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
          "CFL: Mich: OhioState",
          "CFL: Minn : Illinois",
          "CFL: MiamiU: Florida",
          "CFL: USC: UCLA",
          "CFL: Alabama: Auburn",
          "CFL: ArizonaSt: UofAriz",
          "CFL: Georgia: Clemson",
          "CFL: PennState: Indiana",
          "CFL: Texas: TexasA&M",
          "CFL: Utah: BYU",
          "CFL: Rutgers: VirgTech",
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
          999, 10500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970,
          730, 699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970,
          760, 919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      result = await oracle.processVote();
      receipt = await result.wait();

      const userBalanceAcct1 = (await betting.userStruct(accounts[1])).userBalance;
      const userBalanceAcct2 = (await betting.userStruct(accounts[2])).userBalance;
      const ownershares = (await betting.lpStruct(accounts[0])).shares;
      console.log(`acct1 balance ${userBalanceAcct1}`);
      console.log(`acct2 balance ${userBalanceAcct2}`);
      console.log(`acct0 shares ${ownershares}`);
      const margin0 = await betting.margin(0);
      console.log(`margin0 ${margin0}`);
      const cf0 = await betting.params(1);
      console.log(`concFactor ${cf0}`);

      result = await betting.connect(signers[1]).bet(0, 0, 16000);
      receipt = await result.wait();
      let hash100 = receipt.events[0].args.contractHash;
      const margin0b = await betting.margin(0);
      console.log(`margin0b ${margin0b}`);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(2, 0, 30000);
      receipt = await result.wait();
      const moose = await betting.moose();
      console.log(`moose ${moose}`);

      result = await oracle.connect(signers[0]).updatePost([
        800, 10448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]);
      receipt = await result.wait();
      
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
