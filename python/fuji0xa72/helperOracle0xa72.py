import json
import os
from eth_account import Account
from web3 import Web3
from web3.middleware import geth_poa_middleware


CONTRACT_ADDRESS = "0xB73Cb2696726b7356e03c697672e2Dcc751407D0"
PRIVATE_KEY = (
    "0x4765ce94f9ef7d4ea3f4023e9a1e2936f47fb2cbb8be104d3883b6ef721f5aa4"  # a72
)
RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
# RPC_URL = "http://127.0.0.1:8545/"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
account = Account.from_key(PRIVATE_KEY)
with open("../AbiOracle.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)


def send_transaction(data, gas):
    nonce = w3.eth.get_transaction_count(account.address)
    gas_price = w3.eth.gas_price
    txn = {
        "nonce": nonce,
        "gas": gas,
        "gasPrice": gas_price,
        "to": CONTRACT_ADDRESS,
        "value": 0,
        "data": data,
        "chainId": 43113,
    }
    signed_tx = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return tx_hash


def send_function(function_name, *args, gas):
    data = contract.encodeABI(fn_name=function_name, args=args)
    return send_transaction(data, gas=gas)
