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
  const revstat = await oracle.reviewStatus();
  console.log(`revStatus ${revstat}`);

  
  result = await oracle.initProcess();
  receipt = await result.wait();
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
  receipt = await result.wait();
  console.log(`fundbettor`);

  result = await betting.connect(signers[2]).fundBettor({
    value: 20n*eths,
  });
  receipt = await result.wait();
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
      // await new Promise((resolve) => setTimeout(resolve, 50000));
      const rs = await oracle.reviewStatus();
      console.log(`revStatusPre ${rs}`);
      result = await oracle.settleProcess();
      receipt = result.wait();
      console.log(`settleprocess`);
      const rsa = await oracle.reviewStatus();
      console.log(`revStatusafter ${rsa}`);
      // const vote0 = await oracle.votes(0);
      // console.log(`vote0 ${vote0}`);
      // const vote1 = await oracle.votes(1);
      // console.log(`vote1 ${vote1}`);
      // const ethdiv = await betting.moose();
      // console.log(`ethdiv ${ethdiv}`);
      // const ethbal1 = await ethers.provider.getBalance(betting.address);
      // console.log(`ethbal1 ${ethbal1}`);
      nextStart = 1691263539;
      // await new Promise((resolve) => setTimeout(resolve, 50000));

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
      console.log(`initpost`);
      // await new Promise((resolve) => setTimeout(resolve, 50000));
     
      result = await oracle.initProcess();
      receipt = result.wait();
      console.log(`initprocess`);
      // await new Promise((resolve) => setTimeout(resolve, 50000));

      result = await betting.connect(signers[1]).bet(0, 1, 1300);
      receipt = await result.wait();
      console.log(`bet process`);
      result = await betting.connect(signers[2]).bet(0, 0, 1400);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(1, 0, 1500);
      receipt = await result.wait();
      result = await betting.connect(signers[2]).bet(1, 1, 1600);
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
