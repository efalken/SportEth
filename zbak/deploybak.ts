import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
dotenv.config();

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {


    const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);


    const deployer = new Deployer(hre, account_0);

console.log("Deploying contracts");

    // epoch 1
    const token_artifact = await deployer.loadArtifact("Token");
    const token_contract = await deployer.deploy(token_artifact, []);
    await token_contract.deployed();
    console.log(`${token_contract.contractName} was deployed to ${token_contract.address}`);


    // epoch 2
    const betting_artifact = await deployer.loadArtifact("Betting");
    const betting_contract = await deployer.deploy(betting_artifact, [token_contract.address]);
    await betting_contract.deployed();
    console.log(`${betting_artifact.contractName} was deployed to ${betting_contract.address}`);

    // epoch 3
    const oracle_artifact = await deployer.loadArtifact("Oracle");
    const oracle_contract = await deployer.deploy(oracle_artifact, [betting_contract.address, token_contract.address]);
    console.log(`${oracle_contract.contractName} was deployed to ${oracle_contract.address}`);

    console.log("Deployed all contracts and setting up initial state");
    let result = await token_contract.approve(oracle_contract.address, 56e7);
    let receipt = await result.wait();
    console.log("Done setting approve");

    // epoch 7
    result = await oracle_contract.depositTokens(56e7);
    receipt = await result.wait();
    console.log("Done depositing ");

    let provider = new ethers.providers.JsonRpcProvider("https://testnet.era.zksync.dev");

    var _timestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;

        
    var nextStart = 1682698899 + 7 * 86400;

    // epoch 8
    result = await oracle_contract.initPost([
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
      ]);
    receipt = await result.wait();
    console.log("Done setting up init");

    result = await oracle_contract.initProcess([]);
    receipt = await result.wait();
    console.log("Done processing init");

    console.log("Done prepping the contracts!!!");
    // OPTIONAL: Deposit funds to L2
    // Comment this block if you already have funds on zkSync.
    // const depositHandle = await deployer.zkWallet.deposit({
    //     to: deployer.zkWallet.address,
    //     token: utils.ETH_ADDRESS,
    //     amount: deploymentFee.mul(2),
    // });
    // // Wait until the deposit is processed on zkSync
    // await depositHandle.wait();
    
}