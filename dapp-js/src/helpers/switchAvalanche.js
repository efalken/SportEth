import React from "react";
import { networkConfig } from "../config";

export function useChainId() {
  const [chainId, setChainId] = React.useState(0);

  React.useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;
    const getChainId = async () => {
      if (!ethereum.request)
        throw new Error("This wallet provider does not support request method");
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(chainId));
    };
    ethereum.on("chainChanged", getChainId);
    getChainId();
  }, []);

  return chainId;
}

export async function switchToAvalanche() {
  const { ethereum } = window;

  if (!ethereum.request)
    throw new Error("This wallet provider does not support request method");
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      const params = [networkConfig];
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params,
        });
      } catch (addError) {
        throw new Error("Could not add chain to MetaMask: " + addError.message);
      }
    }
    throw switchError;
  }
}
