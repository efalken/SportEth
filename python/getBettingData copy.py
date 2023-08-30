from helpersg import send_function
from rlp import decode
from rlp.sedes import big_endian_int
import 
import os
import json
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware import geth_poa_middleware


def getOdds():
    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
    RPC_URL = os.getenv("RPC_URL")
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    with open("AbiBetting.json", "r") as f:
        abi = json.load(f)
    contract = w3.eth.contract(
        address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi
    )
    tx_odds = contract.functions.showOdds().call()
    return tx_odds


def getResults():
    tx_results = send_function(
        "showStartTime",
    )
    return tx_results


def getStartTimes():
    tx_startTimes = send_function("showStartTime", gas=50000)
    return tx_startTimes


if __name__ == "__main__":
    tx_odds = getOdds()
    print(tx_odds)
