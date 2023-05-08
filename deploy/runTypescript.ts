import { Wallet, utils } from "zksync-web3";
const helper = require("../hardhat-helpers");
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
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
    console.log("account_0: " + account_0.address);
    console.log("account_1: " + account_1.address);

    /*const account_0 = new Wallet("0xdc63c0436707975689036ad87b2dcbec81ac4ff488501115995ae84e7f9a1286");
    const account_1 = new Wallet("0x4765ce94f9ef7d4ea3f4023e9a1e2936f47fb2cbb8be104d3883b6ef721f5aa4");
    console.log("account_0: " + account_0.address);
    console.log("account_1: " + account_1.address);*/

    let provider = new ethers.providers.JsonRpcProvider("https://testnet.era.zksync.dev");

    const account_0_signer = await provider.getSigner(account_0.address)
    const account_1_signer = await provider.getSigner(account_1.address)

    const deployer = new Deployer(hre, account_0);

    const token_artifact = await deployer.loadArtifact("Token");
    const token_contract = await deployer.deploy(token_artifact, []);
    await token_contract.deployed();
    console.log(`${token_contract.contractName} was deployed to ${token_contract.address}`);

    const bbb_artifact = await deployer.loadArtifact("Bbb");
    const bbb_contract = await deployer.deploy(bbb_artifact, []);
    await bbb_contract.deployed();
    console.log(`${bbb_contract.contractName} was deployed to ${bbb_contract.address}`);

    const aaa_artifact = await deployer.loadArtifact("Aaa");
    const aaa_contract = await deployer.deploy(aaa_artifact, [bbb_contract.address, token_contract.address]);
    await aaa_contract.deployed();
    console.log(`${aaa_contract.contractName} was deployed to ${aaa_contract.address}`);


    let result = await token_contract.approve(aaa_contract.address, 56e7);
    let receipt = await result.wait();
    let gasUsed = receipt.gasUsed;
    console.log(`gas on authorize ${gasUsed}`);

    result = await aaa_contract.sendToken(account_0.address, account_1.address, 56e7);
    receipt = await result.wait();
    console.log("send22");
    const tokBal2 = await token_contract.balanceOf(account_1.address);
    console.log(`total 22 shares ${tokBal2}`);
/*
    result = await aaa_contract.set([]);
    receipt = await result.wait();
    console.log("Done setting data ");

    result = await bbb_contract.sendEth({value: 9999});
    receipt = await result.wait();
    console.log("Done sending ETH ");

    //const foo = await provider.aaa_contract(account_1.address);
    //result = await aaa_contract.connect(account_1_signer).sendOnly(gas1);
    //result = await aaa_contract.connect(account_1).sendOnly(gas1);
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
*/

}