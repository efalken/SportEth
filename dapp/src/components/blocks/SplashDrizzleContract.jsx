import React, { useContext } from "react";
import { Box, Flex } from "@rebass/grid";
import { Radius } from "../basics/Style";
import { B } from "../basics/Colors";
import {
  useChainId,
  switchToAvalanche,
} from "../../helpers/switchAvalanche.js";
import AuthContext from "../../contexts/AuthContext";
import { networkConfig } from "../../config";

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
              backgroundColor: B,
              cursor: "pointer",
              display: "flex",
              borderRadius: "2px",
              alignItems: "center",
              width: "15em",
              justifyContent: "flex-end",
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
  const { provider } = useContext(AuthContext);

  console.log(provider);

  const chainid = useChainId();
  console.log("chainid", chainid);
  if (chainid === parseInt(networkConfig.chainId)) {
    return (
      <a href="/betpage">
        <Box>
          <button
            style={{
              backgroundColor: "#707070",
              color: "white",
              borderRadius: "2px",
              cursor: "pointer",
              padding: "10px",
            }}
            //    onClick={() => switchToAvalanche()}
            //    href={"/betpage"}
          >
            {" "}
            Click Here to Enter Main Betting Page{" "}
          </button>
        </Box>
      </a>
    );
  } else {
    return (
      <Box>
        <button
          style={{
            backgroundColor: "#424242",
            borderRadius: "2px",
            cursor: "pointer",
            color: "white",
            padding: "10px",
          }}
          onClick={() => switchToAvalanche()}
        >
          {" "}
          switch to AVAX Network and Enter
        </button>{" "}
      </Box>
    );
  }
};

export default SplashDrizzleContract;
