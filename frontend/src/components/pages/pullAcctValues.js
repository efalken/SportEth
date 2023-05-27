//import web3 from "web3-utils";
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/ws/v3/3e4616a1aed64da3b29e20c2970e23b7')

const web3 = new Web3(provider)

web3.eth.getBalance('').the(balance >
cosole.log(balance))
