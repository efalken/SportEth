import { ethers } from "hardhat";
import fs from "fs";

var result;
var nextStart = ((new Date().getTime() / 1000) | 0) + 36 * 60 * 60;
//var finney = "1000000000000000"
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

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
  const Reader = await ethers.getContractFactory("Reader");
  const reader = await Reader.deploy(betting.address, token.address);
  await reader.deployed();
  console.log(`Reader contract was deployed to ${reader.address}`);
  console.log(`acct0 ${accounts[0]}`);
  console.log(`acct1 ${accounts[1]}`);
  console.log(`acct2 ${accounts[2]}`);
  result = await token.setAdmin(oracle.address);
  await result.wait();
  //result = await token.approve(oracle.address, 560n * million);
  console.log(`got here0`);
  result = await oracle.depositTokens(560n * million);
  await result.wait();
  result = await token.transfer(reader.address, 440n * million);
  await result.wait();
  console.log(`got here1`);
  nextStart = 2e9;
  result = await betting.fundBook({
    value: 300n * finneys,
  });
  await result.wait();
  console.log(`got here2`);
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
    [
      999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730, 699,
      884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760, 919, 720,
      672, 800,
    ]
  );
  await result.wait();
  result = await oracle.initProcess();
  await result.wait();
  result = await betting.connect(signers[1]).fundBettor({
    value: 300n * finneys,
  });
  await result.wait();
  const betdata0 = await betting.betData(0);
  console.log(`betdata ${betdata0}`);

  const betfunds = (await betting.userStruct(accounts[1])).userBalance;
  console.log(`funds ${betfunds}`);

  const bookiefunds = (await betting.lpStruct(accounts[0])).shares;
  console.log(`bookiefunds ${bookiefunds}`);

  const chainId = (await ethers.provider.getNetwork()).chainId;

  const readerABI = {
    name: "Reader",
    abi: JSON.parse(
      reader.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: reader.address } },
  };

  saveABIFile("Reader.json", JSON.stringify(readerABI));

  const oracleABI = {
    name: "Oracle",
    abi: JSON.parse(
      oracle.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: oracle.address } },
  };

  saveABIFile("Oracle.json", JSON.stringify(oracleABI));

  const bettingABI = {
    name: "Betting",
    abi: JSON.parse(
      betting.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: betting.address } },
  };

  saveABIFile("Betting.json", JSON.stringify(bettingABI));

  const tokenABI = {
    name: "Token",
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
