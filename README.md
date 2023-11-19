# This repo contains tools for interacting with the avaxsportsbook contract on Avalanche C-chain.


## Directories
### Dapp: the frontend for bettors and LPs. 
### eventlogs: Tools for pulling event logs.
### Docs: tools for oracles, explanations of hardhat tests.
### Python: Python tools, primarily for oracles. 
### Smart: hardhat tests, deployment script for the contracts.

## How to use

### Dapp

This is currently accessible on avaxsportsbook.io, and on vercel and spheron, as will as the IPFS. If one is worried about the security on those sites, you can run this locally, and be able to see the code and know it is secure.

cd into dapp directory
type `npm i` to create node_modules folder
type \`npm i\` to create nodes
create a ".env" file in dapp directory, add a Vite project ID
type `yarn dev` and follow link into browser, 

If you want to use the fuji test net, or a local hardhat chain, specify this in the dapp/src/config.js file

### eventlogs

- start a terminal and cd into the `eventlogs/backend` folder
- install the dependencies using `npm i`
- copy the .env.template file to .env file, and fill the rpc url and the postgres database connection url
must have mysql installed
- run `npm run start`
- start another terminal and go to the `desktop_indexer_2/frontend`
- install the dependencies using `npm i`
- type `npm run dev`

### Python


.env


```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
