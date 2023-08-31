import React from "react";
import { Box } from "@rebass/grid";
import Background from "../../images/backgroundFull.mp4";

// eslint-disable-next-line
export default function () {
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      //  backgroundColor: "rgba(0, 0, 0, 0.99)",
        // width: "100vw",
        // height: "100wh",
        zIndex: -1,
        //overflow: "hidden",

      }}
    >
      <video
        autoPlay
        muted
        loop
        style={{
        //  backgroundColor: "rgba(0, 0, 0, 0.99)"
         // opacity: 0.97,
          //filter: "grayscale(85%)",
          // minHeight: "100%",
          // minWidth: "100%",
         // backgroundColor: "rgba(0, 0, 0, 0.72)"
        // backgroundColor: "rgba(0, 0, 0, 0.99)"
        }}
      >
        <source src={Background} type="video/mp4" />
      </video>

    </Box>
  );
}
