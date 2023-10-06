from python.fuji0x257.helperOracle0x257 import send_function
import json


def oddsPost():
    with open("../odds.json", "r") as f:
        args = json.load(f)
    tx_hash = send_function("oddsPost", args["_decimalOdds"], gas=150000)
    return tx_hash


if __name__ == "__main__":
    tx_hash = oddsPost()
    print(f"The transaction hash: {tx_hash.hex()}")
