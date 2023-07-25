CHAIN_ID = 97  # Testnet
GAS_AMOUNT = 65000
GAS_PRICE = 10  # gwei
SC_ADDRESS = '0x5b53b798dc019B790f87068A628964b61190aD8D'
SC_OWNER_ADDR = '0xa72D870f07b757B9Dc69b2dE123814Ce8f227e51'
SC_OWNER_ADDR_PRIV_KEY_FILE_PATH = '0x4765ce94f9ef7d4ea3f4023e9a1e2936f47fb2cbb8be104d3883b6ef721f5aa4'

def change_contract_state(wallet):
    nonce = w3.eth.getTransactionCount(SC_OWNER_ADDR)
    private_key = read_private_key_from_file(SC_OWNER_ADDR_PRIV_KEY_FILE_PATH)
    nonce = w3.eth.getTransactionCount(SC_OWNER_ADDR)
    private_key = read_private_key_from_file(SC_OWNER_ADDR_PRIV_KEY_FILE_PATH)
    transaction = contract.functions.bet(0, 1, 1200);
    
    wallet).buildTransaction({
        'chainId': CHAIN_ID,
        'gas': GAS_AMOUNT,
        'gasPrice': Web3.toWei(GAS_PRICE, 'gwei'),
        'from': SC_OWNER_ADDR,
        'nonce': nonce
    })
    # print(transaction)
    signed_txn = w3.eth.account.signTransaction(transaction, private_key=private_key)
    tx_hash = w3.toHex(w3.keccak(signed_txn.rawTransaction))
    print(tx_hash)