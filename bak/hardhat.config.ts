import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true
      }  
    },
  },
  mocha: {
    timeout: 100000000
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: `https://goerli.infura.io/v3/3e4616a1aed64da3b29e20c2970e23b7`,
      zksync: true,
    },
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
};