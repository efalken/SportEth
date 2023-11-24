import json
from web3 import Web3
from web3.middleware import geth_poa_middleware

CONTRACT_ADDRESS = "0xB73Cb2696726b7356e03c697672e2Dcc751407D0"
EOA_ADDRESS = "0x2572eE2A871fCC586722C3E57d43831d78E7219c"
RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
with open("AbiOracle.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)


def getOdds():
    tx_odds = contract.functions.showprobSpreadDiv2().call()
    return tx_odds


def getResults():
    tx_results = contract.functions.showPropResults().call()
    return tx_results


def getStartTimes():
    tx_startTimes = contract.functions.showPropStartTimes().call()
    return tx_startTimes


def getScheduleString():
    tx_scheduleString = contract.functions.showSchedString().call()
    return tx_scheduleString


def getStartTimes():
    tx_scheduleString = contract.functions.showPropStartTimes().call()
    return tx_scheduleString


def getReviewStatus():
    tx_adminstruct = contract.functions.reviewStatus().call()
    return tx_adminstruct


def getSubNumber():
    tx_adminstruct = contract.functions.subNumber().call()
    return tx_adminstruct


def getPropNumber():
    tx_adminstruct = contract.functions.propNumber().call()
    return tx_adminstruct


def getEpoch():
    tx_adminstruct = contract.functions.oracleEpoch().call()
    return tx_adminstruct


def getProposer():
    tx_adminstruct = contract.functions.proposer().call()
    return tx_adminstruct


def getTokenBalance():
    tx_adminstruct = contract.functions.adminStruct(EOA_ADDRESS).call()
    return tx_adminstruct[5]


def getInitFeePool():
    tx_adminstruct = contract.functions.adminStruct(EOA_ADDRESS).call()
    return tx_adminstruct[6]


def getTotalVotes():
    tx_adminstruct = contract.functions.adminStruct(EOA_ADDRESS).call()
    return tx_adminstruct[4]


def getBasePropNumber():
    tx_adminstruct = contract.functions.adminStruct(EOA_ADDRESS).call()
    return tx_adminstruct[0]


def getTotalTokens():
    tx_adminstruct = contract.functions.totalTokens().call()
    return tx_adminstruct


def getTokenRevTracker():
    tx_adminstruct = contract.functions.tokenRevTracker().call()
    return tx_adminstruct


def getYesVotes():
    tx_adminstruct = contract.functions.votes(0).call()
    return tx_adminstruct


def getNoVotes():
    tx_adminstruct = contract.functions.votes(1).call()
    return tx_adminstruct


if __name__ == "__main__":
    tx_odds = getOdds()
    print("odds")
    print(tx_odds)
    tx_odds = getResults()
    print("outcome")
    print(tx_odds)
    tx_odds = getScheduleString()
    print("schedule")
    print(tx_odds)
    tx_odds = getStartTimes()
    print("startTimes")
    print(tx_odds)
    tx_odds = getReviewStatus()
    print("reviewStatus:", tx_odds)
    tx_odds = getSubNumber()
    print("subNumber:", tx_odds)
    tx_odds = getEpoch()
    print("Epoch:", tx_odds)
    tx_odds = getPropNumber()
    print("propNumber:", tx_odds)
    tx_odds = getInitFeePool()
    print("initFeePool:", tx_odds)
    tx_odds = getBasePropNumber()
    print("basePropNumber:", tx_odds)
    tx_odds = getTotalVotes()
    print("getTotalVotes:", tx_odds)
    tx_odds = getProposer()
    print("lastProposer:", tx_odds)
    tx_odds = getTokenBalance()
    print("tokens:", tx_odds)
    tx_odds = getTokenRevTracker()
    print("tokenTracker:", tx_odds)
    tx_odds = getTotalTokens()
    print("totalTokens:", tx_odds)
    tx_odds = getYesVotes()
    print("Yes votes:", tx_odds)
    tx_odds = getNoVotes()
    print("No votes:", tx_odds)
