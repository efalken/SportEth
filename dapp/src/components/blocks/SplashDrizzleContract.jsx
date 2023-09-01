import React from "react";
import { Box, Flex } from "@rebass/grid";
import { Radius } from "../basics/Style";
// import { networkConfig } from "../../config";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useNetwork, useSwitchNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function SplashDrizzleContract({ showActions, redirectURL }) {
  return (
    <Flex
      style={{
        borderRadius: Radius,
        overflow: "hidden",
      }}
    >
      <Box width={1} flexdirection="row" style={{ display: "flex" }}>
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
            <ChainSwitch redirectURL={redirectURL} />
            <a href={"/betpage"} style={{ textDecoration: "none" }}></a>
          </Box>
        )}
      </Box>
    </Flex>
  );
}

function ChainSwitch({ redirectURL }) {
  // const { chain } = useNetwork();
  // const d = useMutation();
  // console.log(d);
  // const networkId = parseInt(networkConfig.chainId, "16");
  // const data = useSwitchNetwork({
  //   chainId: networkId,
  //   throwForSwitchChainNotSupported: true,
  // });
  // const { switchNetwork, chains, pendingChainId, status, reset } = data;
  // const { open } = useWeb3Modal();
  // const navigate = useNavigate();

  // console.log(ethereumClient.getNetwork());
  // ethereumClient.watchNetwork((data) => console.log(data));

  return <ConnectButton />;

  // if (chain) {
  //   if (chain.id == networkId) {
  //     return (
  //       <>
  //         Correct network
  //         <Web3Button />{" "}
  //       </>
  //     );
  //   } else {
  //     return (
  //       <button
  //         style={{
  //           backgroundColor: "#121823",
  //           color: "#ffff4d",
  //           // size: "24px",
  //           borderRadius: "2px",
  //           cursor: "pointer",
  //           padding: "10px",
  //         }}
  //         onClick={async () => {
  //           console.log("a");
  //           // await addChain(ethereumClient.getNetwork(), { chain: arbitrum });
  //           switchNetwork(networkId);
  //           console.log("b");
  //         }}
  //       >
  //         switch to {networkConfig.chainName} Network and Enter
  //       </button>
  //     );
  //   }
  // } else {
  //   return <Web3Button />;
  // }

  // if (chain && chain.id == parseInt(networkConfig.chainId, "16")) {
  //   console.log("right");
  // }
}

// const ChainSwitch = ({ redirectURL }) => {
//   const { provider, connect } = useAuthContext();

//   const navigate = useNavigate();

//   const { open, close } = useWeb3Modal();

//   const chainid = useChainId();
//   console.log("chainid", chainid);
//   if (chainid === parseInt(networkConfig.chainId)) {
//     return (
//       <Box>
//         <button
//           style={{
//             backgroundColor: "#121823",
//             color: "#ffff4d",
//             borderRadius: "2px",
//             cursor: "pointer",
//             padding: "10px",
//           }}
//           onClick={async () => {
//             open();
//             // await connect();
//             // console.log(redirectURL);
//             // navigate(redirectURL);
//           }}
//         >
//           Connect Wallet and Enter
//         </button>
//       </Box>
//     );
//   } else {
//     return (
//       <Box>
//         <Web3Button />
//         <button
//           style={{
//             backgroundColor: "#121823",
//             color: "#ffff4d",
//             // size: "24px",
//             borderRadius: "2px",
//             cursor: "pointer",
//             padding: "10px",
//           }}
//           onClick={switchChain}
//         >
//           switch to {networkConfig.chainName} Network and Enter
//         </button>
//       </Box>
//     );
//   }
// };

export default SplashDrizzleContract;
