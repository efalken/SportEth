# Tools for interacting with the AvaxSportsBook contract on Avalanche C-chain.

## Directories
### Dapp: the frontend for bettors and LPs. 
### eventlogs: Tools for pulling event logs.
### Docs: tools for oracles, explanations of hardhat tests.
### Python: Python tools, primarily for oracles. 
### Smart: hardhat tests, deployment script for the contracts.

## How to use

### Dapp

This is currently accessible on avaxsportsbook.io, and on vercel and spheron, as will as the IPFS. If one is worried about the security on those sites, you can run this locally, and be able to see the code and know it is secure.

- cd into dapp directory
- type `npm i` to create node_modules folder
- create a `.env` file in dapp directory, add a Vite project ID
- type `yarn dev` and follow link into browser, 

If you want to use the fuji test net, or a local hardhat chain, specify this in the dapp/src/config.js file

### eventlogs

- start a terminal and cd into the `eventlogs/backend` folder
- install the node dependencies using `npm i`
- copy the .env.template file to `.env` file, and fill the rpc url and the postgres database connection url
must have mysql installed
- run `npm run start`
- start another terminal and go to the `eventlogs/frontend`
- install the dependencies using `npm i`
- type `npm run dev`

### Python

Given the inputs needed for data submissions, these are best done via Python as opposed to Remix, as it is easy to miss a set of quotes or commas, and then one gets an error that is not explained. Further, this should be automated as much as possible, as this investment makes it easier to evaluate the data.

reading contract state data
- getBettingData.py: Pulls betting contract state data.       
- getOracleData.py: pull data from the oracle contract
- getTokenData.py: pulls token and AVAX accounting data from contract

Oracle executions

- helperOracle.py: contain user's private key, which is needed for non-getter functions. It also has the oracle address

- processVote.py: evaluates vote, sends data to betting contract if majority true
- voteNo.py: sends no vote from oracle
- voteYes.py: sends yes vote from oracle
- settleRefresh.py: Sends the outcomes of the prior week and the upcoming schedule for the
next weekend.
- oddsPost.py: Sends weekly odds, formatted in the probability difference between the two teams multiplied by 1000

### Smart

cd into the smart directory
- type `npm i`
put seed phrase in smart/.env file (creates your fake accounts in tests)
- type `yarn hardhat test`
Runs everything in hardhat-test folder. Various tests are in hardhat-testlibrary, and they are explained in the contract test files in the docs directory

To deploy new contract instantiations using local you first must start a local chain 
- type `npm hardhat node`
new terminal
- type `npx hardhat run ./deploy/deployAvax.ts --network localhost`
[network info is in smart/hardhat.config.js]

To deploy on Fuji
- type `npx hardhat run ./deploy/deployAvax.ts --network avaxtest`

To deploy on mainnet
- type `npx hardhat run ./deploy/deployAvax.ts --network avax`

        
### Docs
Createjson.xlsm: Contains macros that create. You can pull raw data to be pasted into the ASB.accdb database and then take the query from the final query and paste it back into this spreadsheet. A worksheet-embedded macros create the .json files used for sending odds and settleRefresh to the oracle contract using the Python files above.

ASB.accdb

This database takes in raw data on schedules and odds, which is in decimal odds, and generates the data in the format the contract requires

        Puts the favorite in the first position Translates decimal odds into the probability of winning for the favorite, which is the difference between the favorite's probability
of winning and the base probability of winning (51.2%).
        
oddsTranslation.xls: Contains functions for translating between decimal, moneyline,
fractional, and probability of winning. It gives an example of how raw
decimal odds are transformed into the probability of a win.
        
To create a set of data for a settle/refresh submission.

ContractTests.xls: Contains worksheets that match the testing scenarios in smart/testLib.



```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
