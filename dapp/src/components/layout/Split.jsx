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
  <Flex>
    <Box
      width="380px"
      style={{
        //backgroundColor: "rgba(5, 5, 5, 0.67)",
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        height: "auto",
      }}
    >
      {side}
    </Box>
    <Box width="calc(100% - 380px)"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.67)",
      //backgroundColor: "rgba(39, 39, 39, 0.67)",
      //backgroundColor: "rgba(5, 5, 5, 0.67)",
      height: "auto",
    }}>{children}</Box>
  </Flex>
) : (
  <Flex>
    <Box
      width="470px"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        //backgroundColor: "rgba(39, 39, 39, 0.67)",
        //backgroundColor: "rgba(5, 5, 5, 0.67)",
        height: "auto",
      }}
    >
      {side}
    </Box>
    <Box width="calc(100% - 470px)"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.67)",
      //backgroundColor: "rgba(39, 39, 39, 0.67)",
      //backgroundColor: "rgba(5, 5, 5, 0.67)",
      height: "auto",
    }}>{children}</Box>
  </Flex>
);