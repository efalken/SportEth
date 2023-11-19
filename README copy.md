# This repo contains tools for interacting with the avaxsportsbook contract on Avalanche C-chain.

## Dapp

the frontend for bettors and LPs. This is currently accessible on avaxsportsbook.io, and on vercel and spheron, as will as the IPFS. If one is worried about the security on those sites, you can run this locally, and be able to see the code and know it is secure.

## Desktop_indexer_2
Tools for pulling event logs.
## Docs
Various documentation, examples, tools for oracles, explanations of hardhat tests.
## Python
Python tools, primarily for oracles. There are also getter python files that allow one to read the contracts without using a browser.
## Smart
This contains the contracts, including a fuji contract that disables some of the restrictions to make it possible to run simulations. This also contains hardhat tests, and a deployment script for the contracts.



# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
