import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script`);


    const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);


    const deployer = new Deployer(hre, account_0);

    
    console.log("Deploying contracts");

    const test_artifact = await deployer.loadArtifact("Test");
    const test_contract = await deployer.deploy(test_artifact, []);
    await test_contract.deployed();
    console.log(`${test_contract.contractName} was deployed to ${test_contract.address}`);

    let result = await test_contract.setData(888);
    let receipt = await result.wait();
    console.log("Done setting");

    result = await test_contract.seeBalance();
    console.log(`this is xx ${result}`);

    
}