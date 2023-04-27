import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
dotenv.config();

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script`);


    const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);


    const deployer = new Deployer(hre, account_0);

    
    console.log("Deploying contracts");

    const bbb_artifact = await deployer.loadArtifact("Bbb");
    const bbb_contract = await deployer.deploy(bbb_artifact, []);
    await bbb_contract.deployed();
    console.log(`${bbb_contract.contractName} was deployed to ${bbb_contract.address}`);

    const aaa_artifact = await deployer.loadArtifact("Aaa");
    const aaa_contract = await deployer.deploy(aaa_artifact, [bbb_contract.address]);
    await aaa_contract.deployed();
    console.log(`${aaa_contract.contractName} was deployed to ${aaa_contract.address}`);

    let result = await bbb_contract.setAdmin(aaa_contract.address);
    let receipt = await result.wait();
    console.log("Done setting aaa Adress in bbb");

    result = await bbb_contract.sendEth({value: 101});
    receipt = await result.wait();
    console.log("Done sending eth to bbb");

    result = await aaa_contract.setData([1,2,3,4,5,6,7,8]);
    receipt = await result.wait();
    console.log("Done setting data");

    result = await aaa_contract.sendData();
    receipt = await result.wait();
    console.log("Done sending data");

    
    result = await aaa_contract.sendData3();
    receipt = await result.wait();
    console.log("Done getting paid");
    
    result = await aaa_contract.sendData2();
    receipt = await result.wait();
    console.log("Done sending and receiving data");

    
    console.log("Done prepping the contracts!!!");
    
}