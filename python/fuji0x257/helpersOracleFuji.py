import json
import os
from eth_account import Account
from web3 import Web3
from web3.middleware import geth_poa_middleware


CONTRACT_ADDRESS = "0x5488052397f14a44A974369dCbF09A6C28386900"
PRIVATE_KEY = "0xdc63c0436707975689036ad87b2dcbec81ac4ff488501115995ae84e7f9a1286" #257
RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
#RPC_URL = "http://127.0.0.1:8545/"
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