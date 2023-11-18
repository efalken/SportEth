import json
from web3 import Web3
from web3.middleware import geth_poa_middleware

CONTRACT_ADDRESS = "0xD8Fc0B73066D090520428e4F6809be92af9fda95"
EOA_ADDRESS4 = "0xc67eB510b7e5CFB3304494166a1f96B6Fc7037CC"
EOA_ADDRESS5 = "0x8A0362aa49ce1AeAa4A2E95b8394b125159B1019"
EOA_ADDRESS6 = "0x63368Be2bC9D95e44B10EbaBeb29A62B8e4655B5"
RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
with open("AbiBetting.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)


def getOdds():
    tx_odds = contract.functions.showOdds().call()
    return tx_odds


def getBetData():
    tx_odds = contract.functions.showBetData().call()
    return tx_odds


def getStartTimes():
    tx_odds = contract.functions.showStartTime().call()
    return tx_odds


def getUserBetData():
    tx_odds = contract.functions.showUserBetData().call()
    return tx_odds


def showUserBetData0():
    tx_odds = contract.functions.showUserBetData(EOA_ADDRESS3).call()
    tx_odds = tx_odds[0]
    tx_odds = tx_odds.hex()
    # tx_odds = tx_odds.hex().rstrip("0")
    # if len(tx_odds) % 2 != 0: .rstrip("0")
    #     tx_odds = tx_odds + '0'
    # tx_odds = bytes.fromhex(tx_odds).decode('utf8')
    return tx_odds


def showUserBetData1():
    tx_odds = contract.functions.showUserBetData(EOA_ADDRESS3).call()
    tx_odds = tx_odds[1]
    tx_odds = tx_odds.hex()


def showBettingActive():
    tx_odds = contract.functions.bettingActive().call()
    return tx_odds


def bettingEpoch():
    tx_odds = contract.functions.bettingEpoch().call()
    return tx_odds


def showConcFactor():
    tx_odds = contract.functions.concFactor().call()
    return tx_odds


def showAvax():
    tx_odds = w3.eth.get_balance(contract.address)
    return tx_odds


def getBettingBalance():
    tx_adminstruct = contract.functions.userStruct(EOA_ADDRESS3).call()
    return tx_adminstruct[1]


def getCounter():
    tx_adminstruct = contract.functions.userStruct(EOA_ADDRESS3).call()
    return tx_adminstruct[0]


def getShares():
    tx_adminstruct = contract.functions.lpStruct(EOA_ADDRESS3).call()
    return tx_adminstruct[0]


if __name__ == "__main__":
    tx_odds = getOdds()
    print(tx_odds)
    tx_odds = getBetData()
    print(tx_odds)
    tx_odds = getStartTimes()
    print(tx_odds)
    tx_odds = showBettingActive()
    print("bettingActive: ", tx_odds)
    tx_odds = bettingEpoch()
    print("betting epoch: ", tx_odds)
    tx_odds = showConcFactor()
    print("conc factor: ", tx_odds)
    tx_odds = showAvax()
    print("getbal ", tx_odds)
    tx_odds = showUserBetData0()
    print("betHash0 ", tx_odds)
    tx_odds = showUserBetData1()
    print("betHash1 ", tx_odds)
    tx_odds = getShares()
    print("shares ", tx_odds)
    tx_odds = getCounter()
    print("counter ", tx_odds)
