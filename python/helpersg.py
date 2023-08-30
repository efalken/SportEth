from config import CONTRACT_ADDRESS, PRIVATE_KEY, account, contract, w3


def send_transaction(data, gas):
    tx_hash = contract.functions.odds(1).call()
    return tx_hash


def send_function(function_name, *args, gas):
    data = contract.encodeABI(fn_name=function_name, args=args)
    return send_transaction(data, gas=gas)
