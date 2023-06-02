import { D } from '../basics/Colors'
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import Text from '../basics/Text'
import Triangle from '../basics/Triangle'
import Styled from 'styled-components'

const Field = Styled(Box)`
    cursor: pointer;
    user-select: none;
`

export default ({ order: [by, asc], setOrder }) => (
  <Flex
    pb="10px"
    style={{
      borderBottom: `thin solid ${D}`
    }}
  >

    <Box
      width="170px"
      justifyContent="flex-start"
      alignItems="flex-end"
      pt="20px"
      display="flex"
    >
      <Text size="14px">ContractHash</Text>
    </Box>
    <Box width="100%">
      <Box>
        <Flex ml="25px">Click to Sort
        </Flex>
        <br />
      </Box>


      <Flex
        alignItems="flex-end"
        mt="13px"
        className="offers-table-header"
        style={{
          textOverflow: "ellipsis",
          minWidth: "0",
          whiteSpace: "pre-wrap"
        }}
      >
        <Field
          display="flex"
          padding="1px"
          width={1 / 4}
          onClick={() => setOrder(1, !asc)}
          style={{
            borderLeft: "1px solid rgb(112, 180, 63)",
            borderRight: "1px solid rgb(213, 87, 87)",
            marginLeft: "25px",
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Text size="14px">Team</Text>{" "}
          {by === 1 ? (
            <Triangle
              rotation={!asc ? "180deg" : ""}
              scale="0.8"
              fill
              color="white"
            />
          ) : null}
        </Field>
        <Field
          display="flex"
          justifyContent="center"
          padding="1px"
          width={1 / 4}
          style={{
            borderRight: "1px solid rgb(112, 180, 63)",
            justifyContent: "center",
            display: "flex"
          }}
          onClick={() => setOrder(1, !asc)}
        >
          <Text size="14px">Size</Text>{" "}
          {by === 2 ? (
            <Triangle
              rotation={!asc ? "180deg" : ""}
              scale="0.8"
              fill
              color="white"
            />
          ) : null}
        </Field>
        <Field
          display="flex"
          justifyContent="center"
          padding="1px"
          width={1 / 4}
          style={{
            borderRight: "1px solid rgb(213, 87, 87)",
            justifyContent: "center",
            display: "flex"
          }}
          onClick={() => setOrder(1, !asc)}
        >
          <Text size="14px">Odds</Text>{" "}

        </Field>
      </Flex>
    </Box>
  </Flex>
);
