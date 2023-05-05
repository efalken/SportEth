import { Wallet, utils } from "zksync-web3";
const helper = require("../hardhat-helpers");
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deployVVV script`);
    var price;
    var liq;
    var _timestamp;
    const gas1 = 1850000;
    const gas2 = 5450000;
    const gas3 = 5450000;

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

    console.log("Deploying contracts V");

    const token_artifact = await deployer.loadArtifact("Token");
    const token_contract = await deployer.deploy(token_artifact, []);
    await token_contract.deployed();

    const bbb_artifact = await deployer.loadArtifact("Bbb");
    const bbb_contract = await deployer.deploy(bbb_artifact, []);
    await bbb_contract.deployed();
    console.log(`${bbb_contract.contractName} was deployed to ${bbb_contract.address}`);

    const aaa_artifact = await deployer.loadArtifact("Aaa");
    const aaa_contract = await deployer.deploy(aaa_artifact, [bbb_contract.address, token_contract.address]);
    await aaa_contract.deployed();
    console.log(`${aaa_contract.contractName} was deployed to ${aaa_contract.address}`);


    //let result = await aaa_contract.estimateGas.set([]);
    //let receipt = await result9.wait();
    //let gasUsed = result.gasUsed;
    //console.log(`gas used ${gasUsed}`);

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

   result = await aaa_contract.sendPay(gas2, {gasLimit: gas2});
    //result = await aaa_contract.sendPay(gas2);
    receipt = await result.wait();
    console.log("sendPay");

    result = await aaa_contract.set([]);
    receipt = await result.wait();
    console.log("set");

    result = await aaa_contract.sendGet(gas3);
    receipt = await result.wait();
    console.log("sendget");


}