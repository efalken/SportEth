# Tools for interacting with the AvaxSportsBook contract on Avalanche C-chain.

This repo is archived, meaning it is read-only for all users and no longer maintained. 

```shell
Directories
dapp: the frontend for bettors and LPs. 
eventlogs: scipts for pulling ASB event logs.
docs: tools for oracles, explanations of hardhat tests.
python: Python tools, primarily for oracles. 
smart: hardhat tests, deployment script for the contracts.
```

## How to use

Download the repo by typing
- `git clone https://github.com:efalken/asb.git`
- Pull the solidity contracts into Remix via gist by clicking on `gist` in remix and pasting this URL into the input box (see pic below):
`https://gist.github.com/efalken/1f658d097963f0d8e690e871685d7fec`
<img src="/docs/remix1.png" alt="Solidity gist" style="height: 244px; width:400px;"/>

### Dapp

This frontend is currently accessible via [vercel](https://sporteth.vercel.app/), [spheron](https://sporteth-c66d8f.spheron.app/), and the IPFS, which all link to the dapp directory of this repo. The IPFS version is slow and not compatible with most browsers, so I put the dapp folder on a server at [avaxsportsbook.io](https://www.avaxsportsbook.io). If one is worried about the security on those sites, you can run this locally, and be able to see the code and know it is secure.

- cd into dapp directory
- type `npm i` to create node_modules folder
- create a `.env` file in dapp directory, add a Vite project ID
- type `yarn dev` and follow link into browser, and it will behave just like the frontend links listed above

If you want to use the fuji test net, or a local hardhat chain, specify this in the dapp/src/config.js file

### eventlogs

- must have mysql installed
- start a terminal and cd into the `eventlogs/backend` folder
- install the node dependencies using `npm i`
- open the .env.template file and fill the name of your mysql table and your websocket API key. Then save as `.env` 
- run `npm run start`
- create another terminal and cd to the `eventlogs/frontend`
- install the dependencies using `npm i`
- type `npm run dev` in the frontend directory
- follow link to browser, see four event log queries

### Python

Oracles should use Python as opposed to the frontend or Remix, as some amount of automation is necessary to avoid unintentional errors. The python files presented can be extended and customized. Users need to have the various python packages installed, which you can do using pip install.

reading contract state data
- getBettingData.py: Pulls betting contract state data.       
- getOracleData.py: pull data from the oracle contract
- getTokenData.py: pulls token and AVAX accounting data from contract

transactions
- helperOracle.py:  oracle must add their private key, which is needed for non-getter functions, as they require gas. I provide one, but it's an empty account, but it shows where to put it (open and see). It also has the oracle address
- processVote.py: evaluates vote and sends data to betting contract if majority true
- voteNo.py: sends no vote from oracle
- voteYes.py: sends yes vote from oracle
- settleRefresh.py: Sends the outcomes of the prior week and the upcoming schedule for the
next weekend.
- oddsPost.py: Sends weekly odds, formatted in the probability difference between the two teams multiplied by 1000

### Smart

There are several test scripts in smart/hardhat-testlibrary. You can put them into the smart/hardhat-test folder and this will execute those scripts.
cd into the smart directory
- type `npm i`
- put a seed phrase in `smart/.env.template` file (creates your fake accounts in tests) and save as `.env`
- type `yarn hardhat test` in the smart directory to execute tests in the `smart/hardhat-test` directory
- The tests are described in the ContractTests.xls and ContractTests.docx files in the docs directory. 

To deploy new contract instantiations using localhost you first must start a local chain 
- in the smart directory, type `npm hardhat node`
create a new terminal
- type `npx hardhat run ./deploy/deployAvaxShort.ts --network localhost`
- Once completed, cd over to the dapp folder
- make sure `localhost` is specified in the dapp/src/config.js file
- in the dapp directory, type `yarn dev` and you can interact to with the contract via your browser via http://localhost:5173/

Deploying a contract on external chains 
To deploy on Fuji
- in the smart directory, type `npx hardhat run ./deploy/deployAvax.ts --network avaxtest`
Chain info is in smart/hardhat.config.js. you can add others like Sepolia, etc., as these run th esame EVM as Avax's fuji and C-chain. It is configured for Avax C-chain, Fuji, and localhost. You will see avaxtest is set to Fuji in the hardhat.config.js file.
- cd over to the dapp folder
- specify  `avalancheFuji` in the dapp/src/config.js file
- in the dapp directory, type `yarn dev` and you can interact to with the contract via your browser via http://localhost:5173/

        
### Docs
Createjson.xlsm: Contains macros that create the input files needed to send the settle/newschedule and odds data to the oracle. It is meant to be used in conjunction with the ASB.accdb MSAccess database. A worksheet-embedded macros create the json files `odds.json` and `settleRefresh.json`, and puts them in the python directory. 

ASB.accdb: This database takes in raw data on schedules and decimal odds and generates the data in the format the contract requires. The end result are queries that are then pasted into the createjson.xlsm workbook, which the generates the json files. It averages the decimal odds for each team/event, puts the favorite into the first position, and translates the odds into the parochial input used in this contract. 

oddsTranslation.xls: Shows how to translate between decimal, moneyline,
fractional, and probability of winning. It gives an example of how raw
decimal odds are transformed into the probability of a win.
        
To create a set of data for a settle/refresh submission.

ContractTests.xls: Contains worksheets that correspond to the data in the hardhat tests.

ContractTests.docx: explains the tests. 

MaxBet.xlsx: shows how the maximum bet is calculated.





