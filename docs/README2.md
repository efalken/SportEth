This repo contains tools for interacting with the avaxsportsbook contract on Avalanche C-chain.

**Desktop_indexer_2**

Tools for pulling event logs.

**Docs**

Various documentation, examples, tools for oracles, explanations of hardhat tests.

**Python**

Python tools, primarily for oracles. There are also getter python files that allow one to read the contracts without using a browser.

**Smart**

This contains the contracts, including a fuji contract that disables some of the restrictions to make it possible to run simulations. This also contains hardhat tests, and a deployment script for the contracts.

.env

Desktop_indexer_2

Desktop_indexer_2/backend

Database url

Dapp: vite

Smart: seedphrase

git clone https://github.com/efalken/sporteth.git

**dapp**

cd dapp

type \`npm i\`

create a ".env" file, add a Vite project ID, and put it in the dapp directory

type \`yarn dev\`

**Smart**

cd smart

type \`npm i\`

put seed phrase in smart/.env file (creates your fake accounts in tests)

DEFAULT_WALLET_MNEMONIC = "scatter also session industry awkward daring shuffle faint guitar subway language rally draw move mystery liberty swarm stadium prison lion modify able abandon wink"

\`yarn hardhat test\`

runs everything in hardhat-test folder\`

typescript tests on local blockchain

npm hardhat node

new terminal

npx hardhat run ./deploy/deploy0.ts --network localhost

[network info is in smart/hardhat.config.js]

go to dapp folder

put "localhost" in dapp/src/config.js

Make sure 'localhost' is added to your browser wallet extension

url: "http://127.0.0.1:8545/",

blockConfirmations: 1,

chainId: 1337,

yarn dev

http://localhost:5173/ in browser URL

interact with contract

typescript tests on testnet

npx hardhat run ./deploy/deploy0.ts --network avaxtest

go to dapp folder

put "avaxtest" in dapp/src/config.js

Make sure 'Avax-Fuji testnet' is added to your browser wallet extension

url: "http://127.0.0.1:8545/",

blockConfirmations: 1,

chainId: 43113,

yarn dev

http://localhost:5173/ in browser URL

interact with contract

desktop_indexer_2

create mysql on machin

\- start a terminal and go to the \`desktop_indexer_2/backend folder\`

\- install the dependencies using \`npm i\`

\- copy the .env.template file to .env file, and fill the rpc url and the postgres database connection url

must install mysql

\- run \`npm run start\`

\- start another terminal and go to the \`desktop_indexer_2/frontend\`

\- install the dependencies using \`npm i\`

\- run \`npm run dev\`

.env

\#DEFAULT_WALLET_MNEMONIC = "scatter also session industry awkward daring shuffle faint guitar subway language rally draw move mystery liberty swarm stadium prison lion modify able abandon wink"

\#INFURA_GOERLI_PROJECT_ID = '83f0731415fc493db0dc5dab899c2ef0'

\#MORALIS_PROJECT_ID = '4eZPCfp4pJVUK6wTvhl7i1Mf3T18ZNomEVEHNbCrN8VOBgejZkNpw8WDaYZlO0NC'

VITE_PROJECT_ID = "4b183b404a1e804d377afa74c4f0d533"
