Indexer
===

## Steps to setup:
- First copy the .env.template file in the backend directory to .env and fill the environment variables
Note: you don't need to fill BETTING_CONTRACT_ADDRESS, ORACLE_CONTRACT_ADDRESS and TOKEN_CONTRACT_ADDRESS. And also you don't need to fill MIN_BLOCK for local blockchain, but you will need to fill the MIN_BLOCK for any other network, in that case, fill the block of deployment in it. For the PORT you need to fill 8000, RPC_URL should be websocket rpc endpoint of the network, for localhost it can be ws://localhost:8545, DATABASE_URL should be in the form "mysql://user:password@localhost:3306/database" 
- Then start terminal 1 and enter the following commands
```bash
cd smart_contracts
npm i
npx hardhat node
```
- Leave terminal 1 running and start terminal 2
```bash
cd smart_contracts
npx hardhat run ./deploy/deployAvax.ts --network localhost
cd ../backend
npm i 
npx prisma migrate dev 
npm start
```
- Leave terminal 1 and 2 running and start terminal 3
```bash
cd dapp
npm i
npm start
```

## How it works?

I have created a eventHandler file in src folder, which is a helper class where we can send the eventname, tablename and the arguments of the events as the class initializer args, then we can run the eventsync function of this class to start syncing the events in the db. 

I have used this class in the web3EventListeners folder in the src folder to fetch all the events in the betting, oracle and the token contract. 

The class also has a function `getAllRouteHandler` which returns a express get request handler and returns the requested events upon http request. I have used this function of all the event handler class objects in the routes folder in the src folder to define all the get routes.

## How to use the indexer to query events?

After starting the indexer, a user can fetch the events using a get request on url `http://${host}:${port}/events/${contractName}/${eventName}` where contractName can be `betting`, `oracle` or `token`. If user wants to fetch event in between certain blocks only then they can also send `fromBlock` and `toBlock` query params, as, `http://${host}:${port}/events/${contractName}/${eventName}?fromBlock=${fromBlock}&toBlock=${toBlock}`
  