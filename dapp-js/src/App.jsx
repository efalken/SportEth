import React, { useEffect, useState } from "react";
import "./App.css";
import AuthContext from "./contexts/AuthContext";
import { BrowserProvider, ethers } from "ethers";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Splash from "./components/pages/Splash";
import FAQ from "./components/pages/FAQ";
import BetPage from "./components/pages/BetPage";
import BigBetPage from "./components/pages/BigBetPage";
import BookiePage from "./components/pages/BookiePage";
import BettingContract from "./abis/Betting.json";
import TokenContract from "./abis/Token.json";
import OracleContract from "./abis/Oracle.json";
import EventBetRecord from "./components/pages/EventBetRecord";
import EventBigBetRecord from "./components/pages/EventBigBetRecord";
import EventOdds from "./components/pages/EventOdds";
import EventSchedule from "./components/pages/EventSchedule";
import EventStartTime from "./components/pages/EventStartTime";
import EventGameResults from "./components/pages/EventGameResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Splash />,
  },
  { path: "/faqs", element: <FAQ /> },
  { path: "/betpage", element: <BetPage /> },
  { path: "/bigbetpage", element: <BigBetPage /> },
  { path: "/bookiepage", element: <BookiePage /> },
  { path: "/bethistory", element: <EventBetRecord /> },
  { path: "/bigbethistory", element: <EventBigBetRecord /> },
  { path: "/oddshistory", element: <EventOdds /> },
  { path: "/schedhistory", element: <EventSchedule /> },
  { path: "/starthistory", element: <EventStartTime /> },
  { path: "/resultshistory", element: <EventGameResults /> },
]);

function App() {
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState();
  const [bettingContractReadOnly, setBettingContractReadOnly] = useState(null);
  const [oracleContractReadOnly, setOracleContractReadOnly] = useState(null);
  const [tokenContractReadOnly, setTokenContractReadOnly] = useState(null);

  useEffect(() => {
    const ethereum = window.ethereum;

    if (!ethereum) return setError("Please install/update metamask");

    const _provider = new BrowserProvider(ethereum, "any");
    setProvider(_provider);

    ethereum.on("chainChanged", (_chain) => {
      window.location.reload();
    });

    // reload if logged in and account changed
    ethereum.on("accountsChanged", (_account) => {
      if (signer) window.location.reload();
    });

    (async () => {
      const chainId = (await _provider.getNetwork()).chainId.toString();

      const _bettingContract = new ethers.Contract(
        BettingContract.networks[chainId].address,
        BettingContract.abi,
        _provider
      );
      const _oracleContract = new ethers.Contract(
        OracleContract.networks[chainId].address,
        OracleContract.abi,
        _provider
      );
      const _tokenContract = new ethers.Contract(
        TokenContract.networks[chainId].address,
        TokenContract.abi,
        _provider
      );

      setBettingContractReadOnly(_bettingContract);
      setOracleContractReadOnly(_oracleContract);
      setTokenContractReadOnly(_tokenContract);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signer,
        provider,
        setSigner,
        bettingContractReadOnly,
        oracleContractReadOnly,
        tokenContractReadOnly,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
