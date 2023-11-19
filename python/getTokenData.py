import json
from web3 import Web3
from web3.middleware import geth_poa_middleware

TOKEN_ADDRESS = "0x43B8B88f5f0193B2dc86723D6BC515ACF424F917"
BETTING_ADDRESS = "0xD8Fc0B73066D090520428e4F6809be92af9fda95"
ORACLE_ADDRESS = "0xB73Cb2696726b7356e03c697672e2Dcc751407D0"
EOA_ADDRESS4 = "0x2572eE2A871fCC586722C3E57d43831d78E7219c"
RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
with open("AbiToken.json", "r") as f:
    abi = json.load(f)
contract = w3.eth.contract(address=w3.to_checksum_address(TOKEN_ADDRESS), abi=abi)


def getTokenDeposits(x):
    tx_odds = contract.functions.balanceOf(x).call()
    return tx_odds


def getETH(x):
    tx_results = w3.eth.get_balance(x)
    eth_amount = w3.from_wei(tx_results, "ether")
    return eth_amount


if __name__ == "__main__":
    tx_odds = getTokenDeposits(EOA_ADDRESS4)
    print("tokens in EOA")
    print(tx_odds)
    tx_odds = getTokenDeposits(BETTING_ADDRESS)
    print("reward tokens remaining in Betting contract")
    print(tx_odds)
    tx_odds = getETH(BETTING_ADDRESS)
    print("avax in betting contract")
    print(tx_odds)
    tx_odds = getETH(ORACLE_ADDRESS)
    print("avax in oracle contract")
    print(tx_odds)
