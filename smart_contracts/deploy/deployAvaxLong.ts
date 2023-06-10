import { ethers } from "hardhat";
import fs from "fs";
var result;
var nextStart = 1687254079;
var receipt;
var hash;

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
  await betting.setOracleAddress(oracle.address);

  await token.setAdmin(oracle.address);
 

  const Reader = await ethers.getContractFactory("Reader");
  const reader = await Reader.deploy(betting.address, token.address);
  const tx = await reader.deployed();
  console.log(`Reader contract was deployed to ${reader.address}`);


  result = await oracle.depositTokens(560n*million);
  await result.wait();
  console.log(`got here2`);
  result = await token.transfer(reader.address, 440n*million);
  await result.wait();
  nextStart = 1687254079;
  result = await betting.fundBook({
    value: 100n*finneys,
  });
  await result.wait();
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
    [999,448,500,919,909,800,510,739,620,960,650,688,970,730,699,884,520,901,620,764,851,820,770,790,730,690,970,760,919,720,672,800,]
  );
  await result.wait();
  result = await oracle.initProcess();
  await result.wait();

  result = await betting.connect(signers[1]).fundBettor({
    value: 200n*finneys,
  });
  await result.wait();

  result = await betting.connect(signers[2]).fundBettor({
    value: 200n*finneys,
  });
  await result.wait();

  result = await betting.connect(signers[1]).bet(0, 0, 20);
      receipt = await result.wait();

      result = await betting.connect(signers[2]).bet(0, 1, 20);
      receipt = await result.wait();
      //hash2 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(1, 0, 15);
      receipt = await result.wait();
     // hash3 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(1, 1, 25);
      receipt = await result.wait();
      //hash4 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).bet(3, 1, 13);
      receipt = await result.wait();
     // hash5 = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(3, 0, 21);
      receipt = await result.wait();

      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();

      result = await oracle.settleProcess();
      receipt = result.wait();

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
          825, 850, 875, 950, 999, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = result.wait();
      result = await oracle.initProcess();
      receipt = result.wait();

      result = await betting.connect(signers[1]).bet(4, 0, 13);
      receipt = await result.wait();
      hash = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).bet(4, 0, 20);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).postBigBet(6, 0, 220, 1972);
      receipt = await result.wait();
      hash = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[1]).postBigBet(7, 1, 201, 1999);
      receipt = await result.wait();
      hash = receipt.events[0].args.contractHash;
      result = await betting.connect(signers[2]).takeBigBet(hash);
      receipt = await result.wait();
 
      result = await oracle.settlePost([
        1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      receipt = result.wait();
      result = await oracle.settleProcess();
      receipt = result.wait();
      var nextStart = 1687254079;
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
          901, 902, 903, 904, 905, 800, 510, 739, 620, 960, 650, 688, 970, 730,
          699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
          919, 720, 672, 800,
        ]
      );
      receipt = await result.wait();
      result = await oracle.initProcess();
      receipt = await result.wait();

      const userBalanceAcct1 = await betting.userBalance(accounts[1]);
      const userBalanceAcct2 = await betting.userBalance(accounts[2]);
      const ownershares = (await betting.lpStruct(accounts[0])).shares;
      console.log(`add1 ${userBalanceAcct1}`);
      console.log(`add2 ${userBalanceAcct2}`);
      console.log(`owner ${ownershares}`);
      result = await betting.connect(signers[2]).postBigBet(0, 0, 200, 2000);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).postBigBet(0, 0, 200, 4000);
      receipt = await result.wait();
      result = await betting.connect(signers[2]).postBigBet(0, 0, 201, 1999);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(4, 0, 20);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).bet(6, 0, 20);
      receipt = await result.wait();
      result = await betting.connect(signers[1]).fundBook({
        value: 100n*finneys,
      });
      await result.wait();


  

  const betdata0 = await betting.betData(0);
      console.log(`betdata ${betdata0}`);

      const betfunds = await betting.userBalance(accounts[1]);
      console.log(`funds ${betfunds}`);

      const bookiefunds = (await betting.lpStruct(accounts[0])).shares;
      console.log(`bookiefunds ${bookiefunds}`);




  const chainId = (await ethers.provider.getNetwork()).chainId;

  const readerABI = {
    name: "ReaderMain",
    address: reader.address,
    abi: JSON.parse(
      reader.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: reader.address } },
  };

  saveABIFile("Reader.json", JSON.stringify(readerABI));

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
