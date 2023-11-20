# Tools for interacting with the AvaxSportsBook contract on Avalanche C-chain.

```shell
Directories
Dapp: the frontend for bettors and LPs. 
eventlogs: scipts for pulling ASB event logs.
Docs: tools for oracles, explanations of hardhat tests.
Python: Python tools, primarily for oracles. 
Smart: hardhat tests, deployment script for the contracts.
```

## How to use

Download the repo by typing
- `git clone https://github.com:efalken/asb.git`
Pull the solidity contracts into Remix via gist by clicking on `gist` in remix and pasting this URL into the input box (see pic below):
`https://gist.github.com/efalken/1f658d097963f0d8e690e871685d7fec`
<img src="/docs/remix1.png" alt="Solidity gist" style="height: 400px; width:400px;"/>

### Dapp

This frontend is currently accessible via vercel, spheron, and the IPFS, which all link to the github repo. The IPFS version is slow and not compatible with most browsers, so I put the dapp folder on a server at avaxsportsbook.io. If one is worried about the security on those sites, you can run this locally, and be able to see the code and know it is secure.

- cd into dapp directory
- type `npm i` to create node_modules folder
- create a `.env` file in dapp directory, add a Vite project ID
- type `yarn dev` and follow link into browser, 

If you want to use the fuji test net, or a local hardhat chain, specify this in the dapp/src/config.js file

### eventlogs

- start a terminal and cd into the `eventlogs/backend` folder
- install the node dependencies using `npm i`
- copy the .env.template file to `.env` file, and fill the name of your mysql table
must have mysql installed
- run `npm run start`
- create another terminal and cd to the `eventlogs/frontend`
- install the dependencies using `npm i`
- type `npm run dev` in the frontend director

### Python

Given the inputs needed for data submissions, these are best done via Python as opposed to Remix, as it is easy to miss a set of quotes or commas, and then one gets an error that is not explained. Further, this should be automated as much as possible, as this investment makes it easier to evaluate the data.

reading contract state data
- getBettingData.py: Pulls betting contract state data.       
- getOracleData.py: pull data from the oracle contract
- getTokenData.py: pulls token and AVAX accounting data from contract

Oracle transactions
Oracles should automate their tasks as much as possible. The python files cover the main oracle functions, except depositing and withdrawing. 

- helperOracle.py: contain user's private key, which is needed for non-getter functions, as they require gas. It also has the oracle address
- processVote.py: evaluates vote, sends data to betting contract if majority true
- voteNo.py: sends no vote from oracle
- voteYes.py: sends yes vote from oracle
- settleRefresh.py: Sends the outcomes of the prior week and the upcoming schedule for the
next weekend.
- oddsPost.py: Sends weekly odds, formatted in the probability difference between the two teams multiplied by 1000

### Smart

There are several test scripts in smart/hardhat-testlibrary. You can put them into the smart/hardhat-test folder and this will execute those scripts.
cd into the smart directory
- type `npm i`
put seed phrase in `smart/.env` file (creates your fake accounts in tests)
- type `yarn hardhat test`
The tests are described in the ContractTests.xls and ContractTests.docx files in the docs directory. 

To deploy new contract instantiations using localhost you first must start a local chain 
- in the smart directory, type `npm hardhat node`
create a new terminal
- type `npx hardhat run ./deploy/deployAvaxShort.ts --network localhost`
Once completed, cd over to the dapp folder
- make sure `localhost` is specified in the dapp/src/config.js file
- in the dapp directory, type `yarn dev` and you can interact to with the contract via your browser via http://localhost:5173/

Deploying on a external chains 
To deploy on Fuji
- in the smart directory, type `npx hardhat run ./deploy/deployAvax.ts --network avaxtest`
[chain info is in smart/hardhat.config.js, you can add others like Sepolia, etc., but I'm not sure how to interact with them in the dapp folder, which is only configured for Avax C-chain, Fuji, and localhost.]
Once completed, cd over to the dapp folder
- make sure `avalancheFuji` is specified in the dapp/src/config.js file
- in the dapp directory, type `yarn dev` and you can interact to with the contract via your browser via http://localhost:5173/


To deploy on Avax C-chain
- type `npx hardhat run ./deploy/deployAvax.ts --network avax`
- make sure `avalanche` is specified in the dapp/src/config.js file
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





