import json
import os

from dotenv import load_dotenv
from eth_account import Account
from web3 import Web3
from web3.middleware import geth_poa_middleware

# load all the environment variables
load_dotenv()

CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
RPC_URL = os.getenv("RPC_URL")
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")
# PRIVATE_KEY = "0xdc63c0436707975689036ad87b2dcbec81ac4ff488501115995ae84e7f9a1286"
# PRIVATE_KEY = "0x4765ce94f9ef7d4ea3f4023e9a1e2936f47fb2cbb8be104d3883b6ef721f5aa4"
PRIVATE_KEY = "0xdc63c0436707975689036ad87b2dcbec81ac4ff488501115995ae84e7f9a1286"

# initialize web3 provider
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# initialize account
account = Account.from_key(PRIVATE_KEY)

# initialize contracts
with open("AbiOracle.json", "r") as f:
    abi = json.load(f)

contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)
