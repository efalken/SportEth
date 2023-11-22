from helperOracle import send_function


def callVoteNo():
    tx_hash = send_function("vote", False, gas=150000)
    return tx_hash


if __name__ == "__main__":
    tx_hash = callVoteNo()
    print(f"The transaction hash: {tx_hash.hex()}")
