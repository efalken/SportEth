import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
// import useError from "../hooks/useError";
import { networkConfig } from "../config";
import bettingContractConfig from "../abis/Betting.json";
import tokenContractConfig from "../abis/Token.json";
import oracleContractConfig from "../abis/Oracle.json";

export const AuthContext = createContext({
  account: "",
  signer: null,
  provider: null,
  setSigner(newSigner) {},
  async connect() {},
  bettingContractReadOnly: null,
  oracleContractReadOnly: null,
  tokenContractReadOnly: null,
  bettingContract: null,
  oracleContract: null,
  tokenContract: null,
});

export function AuthContextProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [bettingContractReadOnly, setBettingContractReadOnly] = useState(null);
  const [oracleContractReadOnly, setOracleContractReadOnly] = useState(null);
  const [tokenContractReadOnly, setTokenContractReadOnly] = useState(null);
  const [bettingContract, setBettingContract] = useState(null);
  const [oracleContract, setOracleContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [showSwitchNetworkPage, setShowSwitchNetworkPage] = useState(false);
  const [account, setAccount] = useState("");
  // const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      // throwErr("Please install/upgrade Metamask");
      return;
    }

    const _provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(_provider);

    window.ethereum.on("chainChanged", (_chain) => {
      window.location.reload();
    });

    // reload if logged in and account changed
    //window.ethereum?.on('accountsChanged', accountChangedHandler)

    // window.ethereum.on("accountsChanged", (_account) => {
    //   if (signer) window.location.reload(true);
    //   setLoad(false);
    // });

    // window.onload = function pageLoad() {
    //   if (load) {
    //     window.location.reload(true);
    //     setLoad(false);
    //   }
    // };

    (async () => {
      const { chainId } = await _provider.getNetwork();
      if (chainId !== parseInt(networkConfig.chainId)) {
        setShowSwitchNetworkPage(true);
      }
    })();
  }, [signer]);

  useEffect(() => {
    if (!provider) return;

    (async () => {
      const chainId = (await provider.getNetwork()).chainId.toString();
      if (chainId !== parseInt(networkConfig.chainId).toString()) return;

      const _bettingContractReadOnly = new ethers.Contract(
        bettingContractConfig.networks[chainId].address,
        bettingContractConfig.abi,
        provider
      );
      setBettingContractReadOnly(_bettingContractReadOnly);
      const _oracleContractReadOnly = new ethers.Contract(
        oracleContractConfig.networks[chainId].address,
        oracleContractConfig.abi,
        provider
      );
      setOracleContractReadOnly(_oracleContractReadOnly);
      const _tokenContractReadOnly = new ethers.Contract(
        tokenContractConfig.networks[chainId].address,
        tokenContractConfig.abi,
        provider
      );
      setTokenContractReadOnly(_tokenContractReadOnly);
    })();
  }, [provider]);

  useEffect(() => {
    if (!provider) return;
    if (!signer) {
      setBettingContract(null);
      setOracleContract(null);
      setTokenContract(null);
      return;
    }

    (async () => {
      const _address = await signer.getAddress();
      setAccount(_address);

      const chainId = (await provider.getNetwork()).chainId.toString();
      if (chainId !== parseInt(networkConfig.chainId).toString()) return;

      const _bettingContract = new ethers.Contract(
        bettingContractConfig.networks[chainId].address,
        bettingContractConfig.abi,
        signer
      );
      setBettingContract(_bettingContract);
      const _oracleContract = new ethers.Contract(
        oracleContractConfig.networks[chainId].address,
        oracleContractConfig.abi,
        signer
      );
      setOracleContract(_oracleContract);
      const _tokenContract = new ethers.Contract(
        tokenContractConfig.networks[chainId].address,
        tokenContractConfig.abi,
        signer
      );
      setTokenContract(_tokenContract);
    })();
  }, [provider, signer]);

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log(signer);
    setSigner(signer);
  }

  return (
    <AuthContext.Provider
      value={{
        signer,
        setSigner,
        connect,
        provider,
        account,
        bettingContractReadOnly,
        oracleContractReadOnly,
        tokenContractReadOnly,
        bettingContract,
        oracleContract,
        tokenContract,
      }}
    >
      {children}
      {/* {showSwitchNetworkPage ? <SwitchNetworkPage /> : children} */}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
