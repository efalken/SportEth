from helpersOracleFuji import send_function


def callProcessVote():
    tx_hash = send_function("processVote", gas=500000)
    return tx_hash


if __name__ == "__main__":
    tx_hash = callProcessVote()
    print(f"The transaction hash: {tx_hash.hex()}")
