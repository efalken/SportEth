import { ethers } from "hardhat";
import fs from "fs";

var nextStart = 1690656253;
var receipt, _timestamp, result;
const eths = BigInt("100000000000000");
const million = BigInt("1000000");

const confirmationBlocks = 2;

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

async function waitFor(tx: Promise<any>) {
  return await (await tx).wait(confirmationBlocks);
}

async function main() {
  const signers = await ethers.getSigners();
  const accounts: string[] = [];
  for (const signer of signers) accounts.push(await signer.getAddress());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await waitFor(token.deployTransaction);
  console.log(`Token contract was deployed to ${token.address}`);

  const Betting = await ethers.getContractFactory("BettingFuji");
  const betting = await Betting.deploy(token.address);
  await waitFor(betting.deployTransaction);
  console.log(`Betting contract was deployed to ${betting.address}`);

  const Oracle = await ethers.getContractFactory("OracleFuji");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await waitFor(oracle.deployTransaction);
  console.log(`Oracle contract was deployed to ${oracle.address}`);

  await waitFor(betting.setOracleAddress(oracle.address));
  await waitFor(token.approve(oracle.address, 140n * million));
  await oracle.depositTokens(140n * million);
  await waitFor(token.transfer(accounts[1], 130n * million));
  await waitFor(
    token.connect(signers[1]).approve(oracle.address, 130n * million)
  );
  await waitFor(oracle.connect(signers[1]).depositTokens(130n * million));
  await waitFor(token.transfer(accounts[2], 130n * million));
  await waitFor(
    token.connect(signers[2]).approve(oracle.address, 130n * million)
  );
  await waitFor(oracle.connect(signers[2]).depositTokens(130n * million));

  console.log(`got here2`);

  await waitFor(token.transfer(accounts[2], 130n * million));
  await waitFor(token.transfer(betting.address, 80n * million));

  console.log(`got here3`);
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart =
    _timestamp - ((_timestamp - 1687554000) % 604800) + 604800 + 1 * 86400;

  await waitFor(
    oracle.initPost(
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
    )
  );
  console.log("line149");
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  await waitFor(
    oracle
      .connect(signers[1])
      .oddsPost([
        999, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ])
  );

  await waitFor(oracle.vote(true));
  await waitFor(
    betting.fundBook({
      value: 20n * eths,
    })
  );

  await waitFor(oracle.processVote());

  await waitFor(
    betting.connect(signers[1]).fundBettor({
      value: 20n * eths,
    })
  );
  await waitFor(
    betting.connect(signers[2]).fundBettor({
      value: 20n * eths,
    })
  );
  await waitFor(betting.connect(signers[1]).bet(2, 1, 10000));
  console.log(`line 214`);
  await waitFor(betting.connect(signers[2]).bet(2, 0, 10000));
  console.log(`line 219`);
  await waitFor(
    oracle.settlePost([
      1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ])
  );
  console.log(`line 244`);
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  await waitFor(betting.tokenReward());
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart =
    _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
  await waitFor(
    oracle
      .connect(signers[1])
      .initPost(
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
          "AAA::",
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
      )
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());
  await waitFor(
    oracle.oddsPost([
      888, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730, 699,
      884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760, 919, 720,
      672, 800,
    ])
  );
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  console.log(`line 360`);
  await waitFor(betting.connect(signers[1]).bet(1, 0, 10000));
  console.log(`line 370`);
  await waitFor(betting.connect(signers[2]).bet(1, 1, 10000));
  console.log(`line 374`);

  await waitFor(
    oracle
      .connect(signers[1])
      .settlePost([
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ])
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart =
    _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;

  await waitFor(
    oracle.initPost(
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
        "AAA::",
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
    )
  );
  console.log(`line 492`);
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  await waitFor(
    oracle
      .connect(signers[1])
      .oddsPost([
        777, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ])
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());

  await waitFor(
    oracle.settlePost([
      1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ])
  );
  console.log(`line 244`);
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  await waitFor(betting.tokenReward());
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart =
    _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;
  await waitFor(
    oracle
      .connect(signers[1])
      .initPost(
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
          "AAA::",
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
      )
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());
  await waitFor(
    oracle.oddsPost([
      666, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730, 699,
      884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760, 919, 720,
      672, 800,
    ])
  );
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  console.log(`line 360`);
  await waitFor(betting.connect(signers[1]).bet(1, 0, 10000));
  console.log(`line 370`);
  await waitFor(betting.connect(signers[2]).bet(1, 1, 10000));
  console.log(`line 374`);

  await waitFor(
    oracle
      .connect(signers[1])
      .settlePost([
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ])
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());
  _timestamp = (
    await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
  ).timestamp;
  nextStart =
    _timestamp - ((_timestamp - 1687554000) % 604800) + 1 * 86400 + 604800;

  await waitFor(
    oracle.initPost(
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
        "AAA::",
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
    )
  );
  console.log(`line 492`);
  await waitFor(oracle.connect(signers[1]).vote(true));
  await waitFor(oracle.processVote());
  await waitFor(
    oracle
      .connect(signers[1])
      .oddsPost([
        555, 500, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ])
  );
  await waitFor(oracle.vote(true));
  await waitFor(oracle.processVote());
  //await waitFor(oracle.haltUnhaltMatch(1));

  /*
      await waitFor(betting.connect(signers[2]).bet(0, 0, 16000));
      let hash100 = receipt.events[0].args.contractHash;
      const betepoch = await betting.bettingStatus();
      
      await waitFor(betting.connect(signers[2]).bet(2, 0, 20000));
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
  saveABIFile(
    "Oracle.json",
    JSON.stringify(oracleABI),
    "../desktop_indexer/backend/src/abis"
  );

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
