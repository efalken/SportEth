require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  paths: {
    sources: "./contracts",
    tests: "./hardhat-test",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        runs: 2000,
        enabled: true,
      },
    },
  },
  mocha: {
    timeout: 100000000,
  },
  networks: {
    zkSynctest: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: `https://goerli.infura.io/v3/${process.env.INFURA_GOERLI_PROJECT_ID}`,
      zksync: true,
      accounts: {
        mnemonic: `${process.env.GOERLI_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    hardhat: {
      //url: "http://127.0.0.1:8545/",
      chainId: 1337,
      blockConfirmations: 1,
      allowUnlimitedContractSize: true,
      throwOnCallFailures: true,
      accounts: {
        mnemonic: `${process.env.DEFAULT_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 9,
        passphrase: "",
      },
      gasPrice: 0, //10e9,
      initialBaseFeePerGas: 0,
      gas: "auto",
      gas: 21000000,
      // gasPrice: 9000000000,
      //initialBaseFeePerGas: 0,
      timeout: 800000,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      blockConfirmations: 1,
      chainId: 1337,
      accounts: {
        mnemonic: `${process.env.DEFAULT_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 9,
        passphrase: "",
      },
      gasPrice: 10e9,
      gas: "auto",
      timeout: 60000,
    },
    avaxtest: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      avaxtest: true,
      chainId: 43113,
      accounts: {
        mnemonic: `${process.env.GOERLI_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      //  gasPrice: 10e10,
      gas: "auto",
      timeout: 60000,
    },
    polygonMumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/ptA9qwLgM4-O_IFnlOxVa4Zt37nhYbqu",
      avaxtest: true,
      accounts: {
        mnemonic: `${process.env.GOERLI_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_GOERLI_PROJECT_ID}`,
      chainId: 5,
      accounts: {
        mnemonic: `${process.env.GOERLI_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      gas: "auto",
      timeout: 60000,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_RINKEBY_PROJECT_ID}`,
      accounts: {
        mnemonic: `${process.env.RINKEBY_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      gas: 21000000,
      gasPrice: 9000000000,
    },
  },
};
