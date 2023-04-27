import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
dotenv.config();

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script`);

    // Initialize the wallet.
    //   const wallet = new Wallet("<WALLET-PRIVATE-KEY>");


    const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);
    console.log("account_0: " + account_0.address);


    const deployer = new Deployer(hre, account_0);
    
    console.log("Deploying contracts");

    // epoch 1
    const bbb_artifact = await deployer.loadArtifact("Bbb");
    const bbb_contract = await deployer.deploy(bbb_artifact, []);
    await bbb_contract.deployed();
    console.log(`${bbb_contract.contractName} was deployed to ${bbb_contract.address}`);
    console.log("Deployed bbb");


    // epoch 2
    const aaa_artifact = await deployer.loadArtifact("Aaa");
    const aaa_contract = await deployer.deploy(aaa_artifact, [bbb_contract.address]);
    await aaa_contract.deployed();
    console.log(`${aaa_artifact.contractName} was deployed to ${aaa_contract.address}`);
    console.log("Deployed aaa");


    let result = await bbb_contract.setAdmin(aaa_contract.address);
    let receipt = await result.wait();
    console.log("Done setting aaa Adress in bbb");


    let provider = new ethers.providers.JsonRpcProvider("https://testnet.era.zksync.dev");
    let _timestamp = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    var nextStart = _timestamp + 7 * 86400;

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
    receipt = await result.wait();
    gasUsed = receipt.gasUsed;
    console.log(`gas on initsend ${gasUsed}`);
    console.log("Done with init ", account_1.address);
    const options = {gasLimit: 8e7, gasPrice: 25e7};
    result = await oracle_contract.initProcess(options);
    receipt = await result.wait();
   
    
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