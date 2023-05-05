import { Wallet, utils } from "zksync-web3";
const helper = require("../hardhat-helpers");
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
require("chai").use(require("chai-as-promised")).should();
dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script`);
    var price;
    var liq;
    var _timestamp;
    const gas1 = 5650000;
    const gas2 = 8650000;
    const gas3 = 9650000;

    const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);
    const account_1 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);
    const account_2 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/2`);
    const account_3 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/3`);
    console.log("account_0: " + account_0.address);
    console.log("account_1: " + account_1.address);
    console.log("account_2: " + account_2.address);
    console.log("account_3: " + account_3.address);

    const deployer = new Deployer(hre, account_0);

    console.log("Deploying contracts");

    const token_artifact = await deployer.loadArtifact("Token");
    const token_contract = await deployer.deploy(token_artifact, []);
    await token_contract.deployed();
    console.log(`${token_contract.contractName} was deployed to ${token_contract.address}`);

    const betting_artifact = await deployer.loadArtifact("Betting");
    const betting_contract = await deployer.deploy(betting_artifact, [token_contract.address]);
    await betting_contract.deployed();
    console.log(`${betting_contract.contractName} was deployed to ${betting_contract.address}`);

    const oracle_artifact = await deployer.loadArtifact("Oracle");
    const oracle_contract = await deployer.deploy(oracle_artifact, [betting_contract.address, token_contract.address]);
    await oracle_contract.deployed();
    console.log(`${oracle_contract.contractName} was deployed to ${oracle_contract.address}`);

    let result = await betting_contract.setOracleAddress(oracle_contract.address);
    let receipt = await result.wait();
    console.log("set Oracle address on betting k");

    result = await token_contract.approve(oracle_contract.address, 56e7, {gasLimit: 99900000});
    receipt = await result.wait();
    console.log("approve");

    result = await oracle_contract.depositTokens(56e7, {gasLimit: 9990000});
    receipt = await result.wait();
    const tokBal2 = await token_contract.balanceOf(oracle_contract.address);
    console.log(`token balance ${tokBal2}`);

    let provider = new ethers.providers.JsonRpcProvider("https://testnet.era.zksync.dev");

    _timestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    var nextStart = _timestamp + 7 * 86400;

    result = await oracle_contract.initPost(
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
          1000,
          2000,
          500,
          1000,
          909,
          800,
          510,
          1240,
          1470,
          960,
          650,
          1330,
          970,
          730,
          1310,
          1040,
          520,
          1020,
          1470,
          1200,
          1080,
          820,
          770,
          790,
          730,
          690,
          970,
          760,
          1000,
          720,
          1360,
          800,
        ]
      );
    receipt = await result.wait();
    const gasUsed0 = receipt.gasUsed;
    console.log(`gas on initPost ${gasUsed0}`);
    console.log("Done sending init ");

    result = await oracle_contract.initProcess();
    receipt = await result.wait();
    console.log("sendinit ");

    const acc0 = await provider.getBalance(account_0.address);
    receipt = await result.wait();
    console.log(`balance ${acc0}`);

    result = await betting_contract.fundBook({
       value: "30000000000000000"
     });
     receipt = await result.wait();
    console.log("fund ");

     result = await betting_contract.account_1.fundBettor({
       value: "30000000000000000", gasLimit: 99909990
     });
     receipt = await result.wait();
    console.log("fundbettor ");

    result = await betting_contract.connect(account_0).bet(0, 0, "100");
    receipt = await result.wait();
    const contractHash1 = receipt.events[0].args.contractHash;

    result = await oracle_contract.settlePost([
      1,
      1,
      1,
      2,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]);

    result = await oracle_contract.settleProcess();
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    console.log(`gas on Settlement ${gasUsed}`);

    result = await betting_contract.connect(account_0).redeem(contractHash1);

    const ethout0 = await betting_contract.withdrawBook("290000000000000000");
    const receipt0 = await ethout0.wait();
/*
    */

}