import React from "react";
import { Box, Flex } from "@rebass/grid";
import { Radius } from "../basics/Style";
import { useChainId } from "../../helpers/switchAvalanche.js";
import { useAuthContext } from "../../contexts/AuthContext";
import { networkConfig } from "../../config";
import { useNavigate } from "react-router-dom";

function SplashDrizzleContract({ showActions }) {
  return (
    <Flex
      style={{
        borderRadius: Radius,
        overflow: "hidden",
      }}
    >
      <Box width={1} flexDirection="row" style={{ display: "flex" }}>
        {showActions && (
          <Box
            style={{
              // backgroundColor: "#ffff00",
              cursor: "pointer",
              display: "flex",
              borderRadius: "2px",
              alignItems: "center",
              width: "10em",
              justifyContent: "flex-end",
              // font-size: "18px"
            }}
            display="flex"
            flexDirection="row"
          >
            <ChainSwitch />
            <a href={"/betpage"} style={{ textDecoration: "none" }}></a>
          </Box>
        )}
      </Box>
    </Flex>
  );
}

const ChainSwitch = () => {
  const { provider, connect } = useAuthContext();

  const navigate = useNavigate();

  console.log(provider);

  async function switchChain() {
    if (!provider) return;
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: networkConfig.chainId },
      ]);
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        const params = [networkConfig];
        try {
          await provider.send("wallet_addEthereumChain", params);
        } catch (addError) {
          alert("Could not add chain to MetaMask: " + addError.message);
        }
      }
      alert(switchError);
    }
  }

  const chainid = useChainId();
  console.log("chainid", chainid);
  if (chainid === parseInt(networkConfig.chainId)) {
    return (
      <Box>
        <button
          style={{
            backgroundColor: "#121823",
            color: "#ffff4d",
            borderRadius: "2px",
            cursor: "pointer",
            padding: "10px",
          }}
          onClick={async () => {
            await connect();
            navigate("/betpage");
          }}
        >
          Connect Wallet and Enter
        </button>
      </Box>
    );
  } else {
    return (
      <Box>
        <button
          style={{
            backgroundColor: "#121823",
            color: "#ffff4d",
            // size: "24px",
            borderRadius: "2px",
            cursor: "pointer",
            padding: "10px",
          }}
          onClick={switchChain}
        >
          switch to {networkConfig.chainName} Network and Enter
        </button>
      </Box>
    );
  }
};

export default SplashDrizzleContract;
