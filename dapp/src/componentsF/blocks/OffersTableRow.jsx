import { D } from '../basics/Colors'
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import Text from '../basics/Text'
import Button from '../basics/Button'
import TruncatedAddress from '../basics/TruncatedAddress.js'

export default ({
  fields,
  takeBigBet,
  handleBetSize,
  handleTeamPick
}) => (
  <Flex
    alignItems="center"
    pb="5px"
    pt="5px"
    style={{
      borderBottom: `thin solid ${D}`
    }}
  >
    <Box width="170px" display="flex" alignItems="flex-end">
      <Flex display="flex" flexDirection="column">
        <TruncatedAddress
          label="subkID"
          addr={fields[0]}
          start="6"
          end="2"
          spacing="1px"
        />
        <Button style={{ marginTop: "5px" }} onClick={takeBigBet}>
          Take Offer
        </Button>
      </Flex>
    </Box>
    <Flex justifyContent="space-between" width="100%">
      <Box
        width={1 / 4}
        display="flex"
        justifyContent="center"
        style={{
          borderLeft: "1px solid rgb(112, 180, 63)",
          borderRight: "1px solid rgb(213, 87, 87)",
          marginLeft: "25px",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Text size="14px">{(fields[1]).toFixed(0)} </Text>
      </Box>
      <Box
        width={1 / 4}
        display="flex"
        justifyContent="center"
        style={{
          borderRight: "1px solid rgb(112, 180, 63)",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Text size="14px">{(fields[2]).toFixed(3)}</Text>
      </Box>

      <Box
        width={1 / 4}
        display="flex"
        justifyContent="center"
        style={{
          borderRight: "1px solid rgb(213, 87, 87)",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Text size="14px">
          {(fields[3]).toFixed(0)}
        </Text>
      </Box>

    </Flex>
  </Flex>
);
