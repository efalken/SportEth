import React from 'react'
import { Box, Flex } from "@rebass/grid"

/*  
    # Split
    Generates the page skeleton with two columns,
    one with a width of 600px and a second with the rest
    of the width.
    
    ## Props
    side: a function that returns the side bar contents
    children: the contents of the main container
*/
// eslint-disable-next-line
export default ({ side, children, page }) => page === "bookie" ? (
  <Flex style={{
 //   backgroundColor: "rgba(0, 0, 0, 0.85)"
  }}>
    <Box
      width="380px"
      style={{
//        backgroundColor: "rgba(0, 0, 0, 0.72)",
        height: "auto",
      }}
    >
      {side}
    </Box>
    <Box width="calc(100% - 380px)"
    style={{
//      backgroundColor: "rgba(0, 0, 0, 0.67)",
      height: "auto",
    }}>{children}</Box>
  </Flex>
) : (
  <Flex style={{
   // backgroundColor: "rgba(0, 0, 0, 0.85)"
  }}>
    <Box
      width="470px"
      style={{
   //     backgroundColor: "rgba(0, 0, 0, 0.72)",
        height: "auto",
      }}
    >
      {side}
    </Box>
    <Box width="calc(100% - 470px)"
    style={{
   //   backgroundColor: "rgba(0, 0, 0, 0.67)",
      height: "auto",
    }}>{children}</Box>
  </Flex>
);