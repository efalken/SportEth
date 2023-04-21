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
    var price;
    var liq;
    const pHigh=1e12;
    const pLow=1e7;
    const eth0 = BigInt('100000000000000');
    const eth2 = BigInt('1000000000000');
    const oneExp11 = BigInt('100000000000');
    const one3 = BigInt('1000');
    const one9 = BigInt('1000000000');
    const one14 = BigInt('1000');
    const usdInK = BigInt('100');
    const ethInK = BigInt('100000');
    const usd0 = BigInt('1000000');
    const usd2 = BigInt('100000000');
    const usd3 = BigInt('1000000000');
    const sqrtp2 = BigInt('10000000');


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

    // Create deployer object and load the artifact of the contract you want to deploy.
    
    console.log("Deploying contracts");

    // epoch 1
    const token_artifact = await deployer.loadArtifact("Token");
    // let deploymentFee = await deployer.estimateDeployFee(token_artifact, [],);
    // let parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    // console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
    const token_contract = await deployer.deploy(token_artifact, []);
    await token_contract.deployed();
    console.log(`${token_contract.contractName} was deployed to ${token_contract.address}`);

    console.log("Deployed Token");


    // epoch 2
    const betting_artifact = await deployer.loadArtifact("Betting");
    const betting_contract = await deployer.deploy(betting_artifact, [token_contract.address]);
    await betting_contract.deployed();
    console.log(`${betting_artifact.contractName} was deployed to ${betting_contract.address}`);
    console.log("Deployed Betting");

    // epoch 3
    const oracle_artifact = await deployer.loadArtifact("Oracle");
    const oracle_contract = await deployer.deploy(oracle_artifact, [betting_contract.address, token_contract.address]);
    console.log(`${oracle_contract.contractName} was deployed to ${oracle_contract.address}`);

    console.log("Deployed Oracle");



    console.log("Deployed all contracts and setting up initial state");
    // epoch 6
    let result = await token_contract.approve(oracle_contract.address, 56e7);
    let receipt = await result.wait();
    console.log("Done setting approve");

    // epoch 7
    result = await oracle_contract.depositTokens(56e7);
    receipt = await result.wait();
    console.log("Done depositing ");

    let provider = new ethers.providers.JsonRpcProvider("https://zksync2-testnet.zksync.dev");
    let _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
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
    console.log("Done minting USDC to : ", account_1.address);

    // epoch 9
    result = await oracle_contract.initProcess([]);
    receipt = await result.wait();
    console.log("Done minting USDC to : ", account_2.address);

    // epoch 10
    let account_0_test = new ethers.Wallet(account_0.privateKey, provider);
    result = await betting_contract.connect(account_0_test).fundBook([{
        value: "3000000000000000000",
      }]);
    receipt = await result.wait();
    console.log("Done approving USDC for : ", account_0.address);

    // epoch 11
    let account_1_test = new ethers.Wallet(account_1.privateKey, provider);
    result = await betting_contract.connect(account_1_test).fundBettor({
        value: "1000000000000000000",
      });
    receipt = await result.wait();
    console.log("Done approving USDC for : ", account_1.address);
    let account_2_test = new ethers.Wallet(account_2.privateKey, provider);
    result = await betting_contract.connect(account_1_test).fundBettor({
        value: "1000000000000000000",
      });
    receipt = await result.wait();

    result = await betting_contract.connect(account_2_test).bet(0,0, "1000");
    receipt = await result.wait();

    result = await betting_contract.connect(account_1_test).bet(0,1, "2000");
    receipt = await result.wait();

    result = await betting_contract.connect(account_2_test).bet(1,1, "1500");
    receipt = await result.wait();
    
    // epoch 12
   
    let account_3_test = new ethers.Wallet(account_3.privateKey, provider);
    result = await betting_contract.connect(account_2_test).approve(stableperp_contract.address, 400n*usd3);
    receipt = await result.wait();
    console.log("Done approving USDC for : ", account_2.address);

    // epoch 13
    result = await stableperp_contract.connect(account_1_test).fundETH({value: 100n*eth0});
    receipt = await result.wait();
    console.log("Done funding ETH for : ", account_1.address);

    // epoch 14
    result = await stableperp_contract.connect(account_1_test).fundUSDC(100n*usd3);
    receipt = await result.wait();
    console.log("Done funding USDC for : ", account_1.address);
    
    // epoch 14
    result = await stableperp_contract.connect(account_0_test).addLiquidity({value: 30n*eth0});
    receipt = await result.wait();
    console.log("Done adding liquidity for : ", account_0.address);

    // epoch 15
    result = await stableperp_contract.connect(account_2_test).addLiquidity({value: 30n*eth0});
    receipt = await result.wait();
    console.log("Done adding liquidity for : ", account_2.address);

    // epoch 16
    result = await stableperp_contract.connect(account_2_test).updateTrader(account_1_test.address);
    receipt = await result.wait();
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);

    // epoch 17
    let vEth0 = (await stableperp_contract.tradeAccount(account_0_test.address)).vETH;
    let vUsd0 = (await stableperp_contract.tradeAccount(account_0_test.address)).vUSD;
    console.log(`eth for ${account_0_test.address} is ${(vEth0) / 1e5}`);
    console.log(`usd for ${account_0_test.address} is ${(vUsd0) / 1e2}`);
    vEth0 = (await stableperp_contract.tradeAccount(account_1_test.address)).vETH;
    vUsd0 = (await stableperp_contract.tradeAccount(account_1_test.address)).vUSD;
    console.log(`eth for ${account_1_test.address} is ${(vEth0) / 1e5}`);
    console.log(`usd for ${account_1_test.address} is ${(vUsd0) / 1e2}`);
    vEth0 = (await stableperp_contract.tradeAccount(account_2_test.address)).vETH;
    vUsd0 = (await stableperp_contract.tradeAccount(account_2_test.address)).vUSD;
    console.log(`eth for ${account_2_test.address} is ${(vEth0) / 1e5}`);
    console.log(`usd for ${account_2_test.address} is ${(vUsd0) / 1e2}`);

    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    result = await stableperp_contract.connect(account_1_test).swap(-"1.5e2", pLow, account_2_test.address);
    receipt = await result.wait();
    console.log(account_1.address, "swapped tokens");

    // epoch 18
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);

    result = await stableperp_contract.connect(account_1_test).swap(+"1.0e6", pHigh, account_2_test.address);
    receipt = await result.wait();

    let [mktval0, reqm0] = await pullaccount_contract.mktValReqMargin2(account_0_test.address);
    console.log(`mktval account 0 is ${mktval0/1e2} reqm is ${reqm0/1e2}`);

    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);

    // epoch 19
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    result = await stableperp_contract.connect(account_2_test).swap(-"1.2e6", pLow, account_2_test.address);
    receipt = await result.wait();

    // epoch 20
    result = await stableperp_contract.connect(account_0_test).updateTrader(account_1_test.address);
    receipt = await result.wait();

    // epoch 21
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    result = await stableperp_contract.connect(account_1_test).swap(-"1.2e6", pLow, account_1_test.address);
    vEth0 = (await stableperp_contract.tradeAccount(account_0_test.address)).vETH;
    vUsd0 = (await stableperp_contract.tradeAccount(account_0_test.address)).vUSD;
    console.log(`eth  is ${(vEth0) / 1e5}`);
    console.log(`usd  is ${(vUsd0) / 1e2}`);

    // epoch 22
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    result = await stableperp_contract.connect(account_2_test).swap(-"1.2e6", pLow, account_2_test.address);
    vEth0 = (await stableperp_contract.tradeAccount(account_2_test.address)).vETH;
    vUsd0 = (await stableperp_contract.tradeAccount(account_2_test.address)).vUSD;
    console.log(`eth  is ${(vEth0) / 1e5}`);
    console.log(`usd  is ${(vUsd0) / 1e2}`);

    // epoch 23
    try {
        result = await stableperp_contract.connect(account_3_test).swap(-"1.2e6", pLow, account_2_test.address);
        receipt = await result.wait();
    } catch (error) {
        console.log("account 3 failed to swap. Good thing.");
    }

    // epoch 24
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    result = await stableperp_contract.connect(account_1_test).swap(+"1.2e6", pHigh, account_1_test.address);
    receipt = await result.wait();
    console.log(`stableperp acct  is ${stableperp_contract.address}`);
    console.log(`equitytoken  is ${oracle_contract.address}`);
    console.log(`usdXtoken is ${token_contract.address}`);
    console.log(`USDCtoken is ${betting_contract.address}`);

    // epoch 25
    result = await stableperp_contract.connect(account_0_test).sellLP(-"1.0e6", pLow, account_0_test.address);
    result = await stableperp_contract.connect(account_2_test).buyLP(+"1.0e6", pHigh, account_2_test.address);
    receipt = await result.wait();
    price = (await stableperp_contract.tradeParams()).sqrtPrice;
    liq = (await stableperp_contract.tradeParams()).totLiquidity;
    console.log(`currPrice, liq is ${price / 1e9}, ${liq / 1e3}`);
    
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