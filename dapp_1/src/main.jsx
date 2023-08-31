import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "@rainbow-me/rainbowkit/styles.css";

import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  metaMaskWallet,
  coreWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defaultNetwork } from "./config.js";

const { chains, publicClient } = configureChains(
  [defaultNetwork],
  [publicProvider()]
);

const projectId = import.meta.env.VITE_PROJECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      coreWallet({ chains, projectId }),
      walletConnectWallet({
        chains,
        projectId,
      }),
    ],
  },
]);

// const connectors = () => {
//   return [...connectors1(), ...connectors2()];
// };

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
