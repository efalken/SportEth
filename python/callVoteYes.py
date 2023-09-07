from helpersOracle import send_function


def callVoteYes():
    tx_hash = send_function("vote", True, gas=150000)
    return tx_hash


if __name__ == "__main__":
    tx_hash = callVoteYes()
    print(f"The transaction hash: {tx_hash.hex()}")
