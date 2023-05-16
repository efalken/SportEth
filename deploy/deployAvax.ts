import { ethers } from "hardhat";

<<<<<<< HEAD
const finneys = BigInt('1000000000000000');
const millions = BigInt('1000000');
const helper = require("../hardhat-helpers");
const _dateo = new Date();
const secondsInHour = 3600;

const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var result;
var receipt;
var gasUsed;
var _timestamp;
var _date;
var _hour;
var contractHash20;
var contractHash31;

=======
>>>>>>> 144921c08d962027e527603a342aa4e3798d3654
async function main() {
  const signers = await ethers.getSigners();
  const accounts: string[] = [];
  for (const signer of signers) accounts.push(await signer.getAddress());

<<<<<<< HEAD
  console.log(`account[0] ${accounts[0]}`);
  console.log(`account[1] ${accounts[1]}`);

=======
>>>>>>> 144921c08d962027e527603a342aa4e3798d3654
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

  const Reader = await ethers.getContractFactory("ReadSportEth");
  const reader = await Reader.deploy(betting.address, token.address);
  await reader.deployed();
  console.log(`Reader contract was deployed to ${reader.address}`);
<<<<<<< HEAD

    result = await token.approve(oracle.address, 560n*millions);
    receipt = await result.wait()
    gasUsed = receipt.gasUsed;
      console.log(`gas on approve = ${gasUsed}`);

      result = await oracle.depositTokens(560n*millions);
          receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on deposit = ${gasUsed}`);

      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp + offset);
      console.log(`time is ${_timestamp}`);
      _hour = _date.getHours();
      if (_hour < 10) {
        await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
      }
        var nextStart = 1684688063; //_timestamp + 7 * 86400;
      console.log(`time is ${nextStart}`);
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
          998,
          800,
          500,
          999,
          909,
          800,
          510,
          780,
          829,
          960,
          650,
          979,
          970,
          730,
          930,
          940,
          520,
          920,
          870,
          800,
          880,
          820,
          770,
          790,
          730,
          690,
          970,
          760,
          901,
          720,
          760,
          800,
        ]
      );
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initProcess = ${gasUsed}`);

      result = await oracle.initProcess();
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on initProcess = ${gasUsed}`);


      result = await betting.fundBook({value: 200n*finneys,});
          receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbook = ${gasUsed}`);

      result = await betting.connect(signers[1]).fundBettor({value: 100n*finneys,});
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor = ${gasUsed}`);

      result = await betting.connect(signers[1]).bet(0, 0, 11);
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet ${gasUsed}`);

      result = await betting.connect(signers[2]).fundBettor({value: 100n*finneys,});
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on fundbettor2 = ${gasUsed}`);

      result = await betting.connect(signers[2]).bet(0, 1, 12);
      receipt = await result.wait()
      gasUsed = receipt.gasUsed;
      console.log(`gas on bet2 ${gasUsed}`);

      result = await betting.connect(signers[1]).postBigBet(2, 0, 500, 2111);
      receipt = await result.wait()
      contractHash20 = receipt.events[0].args.contractHash;
      gasUsed = receipt.gasUsed;
      console.log(`gas on bigbet0 ${gasUsed}`);
      console.log(`hash20 ${contractHash20}`);

      result = await betting.connect(signers[1]).postBigBet(3, 1, 500, 1234);
      receipt = await result.wait()
      contractHash31 = receipt.events[0].args.contractHash;
      gasUsed = receipt.gasUsed;
      console.log(`gas on bigbet1 ${gasUsed}`);
      console.log(`hash31 ${contractHash31}`);

      result = await betting.connect(signers[2]).takeBigBet(contractHash20);
      receipt = await result.wait();
      gasUsed = receipt.gasUsed;
      console.log(`gas on taking big bet ${gasUsed}`);



=======
>>>>>>> 144921c08d962027e527603a342aa4e3798d3654
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
