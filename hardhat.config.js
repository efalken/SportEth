require("@nomiclabs/hardhat-waffle");
//require('hardhat-contract-sizer');
require('dotenv').config();

require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  paths: {
    sources: "./src/contracts/solidity",
    tests: "./hardhat-testlib",
    artifacts: "./artifacts"
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        runs: 2000,
        enabled: true
      } 
    }
  },
  mocha: {
    timeout: 100000000
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
      }
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_GOERLI_PROJECT_ID}`,
      accounts: {
        mnemonic: `${process.env.GOERLI_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      gas: 21000000, 
      gasPrice: 9000000000
     
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
      gasPrice: 9000000000
     
    },
    hardhat: {
     allowUnlimitedContractSize: true,
     throwOnCallFailures: true,
      accounts: {
        mnemonic: `${process.env.DEFAULT_WALLET_MNEMONIC}`,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      }, 
      gasPrice: 20e9,
      gas: 25e6
    },
  },
};
