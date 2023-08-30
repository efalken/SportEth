from helpersOracle import send_function
import json


def callUpdatePost():
    with open("update.json", "r") as f:
        args = json.load(f)
    tx_hash = send_function("updatePost", args["_decimalOdds"], gas=150000)
    return tx_hash


if __name__ == "__main__":
    tx_hash = callUpdatePost()
    print(f"The transaction hash: {tx_hash.hex()}")
