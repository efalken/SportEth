from config import CONTRACT_ADDRESS, PRIVATE_KEY, account, contract, w3


def send_transaction(data, gas):
    nonce = w3.eth.get_transaction_count(account.address)
    gas_price = w3.eth.gas_price
    txn = {
        "nonce": nonce,
        "gas": gas,
        "gasPrice": gas_price,
        "to": CONTRACT_ADDRESS,
        "value": 0,
        "data": data,
        "chainId": 43113,
    }
    signed_tx = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return tx_hash


def send_function(function_name, *args, gas):
    data = contract.encodeABI(fn_name=function_name, args=args)
    return send_transaction(data, gas=gas)
