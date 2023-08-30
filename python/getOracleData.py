import json
from web3 import Web3
from web3.middleware import geth_poa_middleware

CONTRACT_ADDRESS = "0xB0340B2F8B2660F71dFEB139c171a9e4ED8b1250"
RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
with open("AbiOracle.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)


def getOdds():
    tx_odds = contract.functions.showPropOdds().call()
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


def getAdminStruct(x):
    tx_adminstruct = contract.functions.adminStruct(x).call()
    return tx_adminstruct


if __name__ == "__main__":
    tx_odds = getOdds()
    print(tx_odds)
    tx_odds = getResults()
    print(tx_odds)
    tx_odds = getScheduleString()
    print(tx_odds)
    # tx_odds = getStartTimes()
    # print(tx_odds)
    (
        propnum,
        epoch,
        votelast,
        totvote,
        tokens,
    ) = getAdminStruct("0x2572eE2A871fCC586722C3E57d43831d78E7219c")
    print(propnum)
    print(tokens)
