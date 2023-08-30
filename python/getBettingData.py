# from helpersBetting import send_function
# from rlp import decode
# from rlp.sedes import big_endian_int

# import os
import json

# from dotenv import load_dotenv
# from eth_account import Account
from web3 import Web3
from web3.middleware import geth_poa_middleware

CONTRACT_ADDRESS = "0xBe638524D4bCA056c2B2D3A75546bA3c4cF0E392"
RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
with open("AbiBetting.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)
# PRIVATE_KEY = "0xdc63c0436707975689036ad87b2dcbec81ac4ff488501115995ae84e7f9a1286"
# account = Account.from_key(PRIVATE_KEY)


def getOdds():
    tx_odds = contract.functions.showOdds().call()
    return tx_odds


def getResults():
    tx_odds = contract.functions.showBetData().call()
    return tx_odds


def getStartTimes():
    tx_odds = contract.functions.showStartTime().call()
    return tx_odds


def getUserBetData():
    tx_odds = contract.functions.showUserBetData().call()
    return tx_odds


if __name__ == "__main__":
    tx_odds = getOdds()
    print(tx_odds)
    tx_odds = getResults()
    print(tx_odds)
    tx_odds = getStartTimes()
    print(tx_odds)
    tx_odds = getUserBetData()
    print(tx_odds)
