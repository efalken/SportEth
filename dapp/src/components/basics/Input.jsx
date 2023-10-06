import { B, cyellow, cblack, cwhite } from "./Colors";
import { Radius } from "./Style";
import { Box, Flex } from "@rebass/grid";
import React from "react";

// eslint-disable-next-line
export default function ({
  size,
  width,
  weight,
  label,
  placeholder,
  ...props
}) {
  if (label !== undefined)
    return (
      <Flex
        {...props}
        style={{
          //border: `thin solid ${Gg}`,
          border: `yellow`,
          borderRadius: Radius,
          height: 30,
        }}
      >
        {/* This is the label */}
        <Flex
          alignItems="center"
          px="9px"
          style={{
            size: "14px",
            font: "Arial",
            color: "#00ff00",
            //fontSize: size ? size : 14,
          }}
        >
          {label}
        </Flex>

        {/* This is the value */}
        {/* <Box
          // style={{
          //   borderLeft: `thin solid ${Gg}`,
          // }}
          style={{
            backgroundColor: "white",
            borderRadius: "2px",
            cursor: "pointer",
            color: "red"
          }}
        >
          <input
            style={{
              color: "yellow !important",
              // border: "none",
              // paddingLeft: 7,
              // paddingRight: 7,
              // outline: "none",
             // backgroundColor: "#fff",
              //font: cyellow, 
              width: width ? width : 50,
              height: "100%",
              fontSize: size ? size : 16,
              fontWeight: weight ? weight : "normal",

            }}
          />
        </Box> */}
      </Flex>
    );
  else
    return (
      <Box {...props}>
        <input
          placeholder={placeholder}
          value={props.value}
          style={{
            width: width ? width : 120,
            color: "#00ff00",
            border: "1px solid #00ff00",
            // borderRadius: "2px",
            // borderColor: "yellow",
            outline: "none",
            backgroundColor: cblack,
            padding: "5px 7px 5px 7px",
            //  fontSize: size ? size : 14,
            size: 14,
            fontWeight: weight ? weight : "normal",
            borderRadius: Radius,
          }}
        />
      </Box>
    );
}
