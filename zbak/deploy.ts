import { Wallet, utils } from "zksync-web3";
const helper = require("../hardhat-helpers");
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";


export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script`);
    const gas1 = 1e9;
    const gas2 = 3e9;
    const gas3 = 3e9;

    //const mnemonic = process.env.GOERLI_WALLET_MNEMONIC || "";
    
    const mnemonic = "scatter also session industry awkward daring shuffle faint guitar subway language rally draw move mystery liberty swarm stadium prison lion modify able abandon wink";
    const account_0 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);
    const account_1 = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);
    console.log("account_0: " + account_0.address);
    console.log("account_1: " + account_1.address);

    const deployer = new Deployer(hre, account_0);
    console.log("Deploying contracts");

    const bbb_artifact = await deployer.loadArtifact("Bbb");
    const bbb_contract = await deployer.deploy(bbb_artifact, []);
    await bbb_contract.deployed();
    console.log(`${bbb_contract.contractName} was deployed to ${bbb_contract.address}`);

    const aaa_artifact = await deployer.loadArtifact("Aaa");
    const aaa_contract = await deployer.deploy(aaa_artifact, [bbb_contract.address, bbb_contract.address]);
    await aaa_contract.deployed();
    console.log(`${aaa_contract.contractName} was deployed to ${aaa_contract.address}`);

    let result = await aaa_contract.set([]);
    let receipt = await result.wait();
    console.log("Done setting data ");

    result = await bbb_contract.sendEth({value: 9999});
    receipt = await result.wait();
    console.log("Done sending ETH ");

    result = await aaa_contract.sendOnly(gas1);
    receipt = await result.wait();
    console.log("sendOnly ");
    

    result = await aaa_contract.set([]);
    receipt = await result.wait();
    console.log("set");

    result = await aaa_contract.sendPay(gas2);
    receipt = await result.wait();
    console.log("sendPay");

    result = await aaa_contract.set([]);
    receipt = await result.wait();
    console.log("set");

    result = await aaa_contract.sendGet(gas3);
    receipt = await result.wait();
    console.log("sendget");


}