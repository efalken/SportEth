from helpersOracle import send_function
import json


def callSettlePost():
    with open("results.json", "r") as f:
        args = json.load(f)
    tx_hash = send_function("settlePost", args["_results"])
    return tx_hash


if __name__ == "__main__":
    tx_hash = callSettlePost()
    print(f"The transaction hash: {tx_hash.hex()}")
