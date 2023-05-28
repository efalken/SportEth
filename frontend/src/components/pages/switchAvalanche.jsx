
import React from "react";
//import "./App.css";

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
  const parsedChainId = 43113;
  //const rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
  const rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
  const chainId = "0x" + parsedChainId.toString(16);
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      const params = [
        {
          chainId,
          rpcUrls: [rpcUrl],
          chainName: "Avalanche Network",
          nativeCurrency: {
            symbol: "AVAX",
            name: "Avalanche",
            decimals: 18,
          },
          blockExplorerUrls: ["https://testnet.snowtrace.io/"],
        },
      ];
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

// function App() {
//   const chainId = useChainId();
//   console.log("I got back a chainId of", chainId);
//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>You are using Chain ID {chainId}.</p>
//         {<p>{chainId}</p>}
//         {chainId === 43113 && <p>You're all set on AVAX!</p>}
//         {chainId !== 43113 && (
//           <button disabled={chainId === 43113} onClick={switchToAvalanche}>
//             Switch to AVAX
//           </button>
//         )}
//       </header>
//     </div>
//   );
// }
