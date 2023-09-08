from helpersOracle import send_function
import json


def callInitPost():
    with open("init.json", "r") as f:
        args = json.load(f)
    tx_hash = send_function(
        "initPost",
        args["_teamsched"],
        args["_starts"],
        args["_decimalOdds"],
        gas=1600000,
    )
    return tx_hash


if __name__ == "__main__":
    tx_hash = callInitPost()
    print(f"The transaction hash: {tx_hash.hex()}")
