import { C, B, cblack } from './Colors'
import { Box } from '@rebass/grid'
import React from 'react'
import Text from './Text'

// eslint-disable-next-line
export default ({ label, text, transform, spacing, big }) => <Box>
    <Box>
        <Text
            size={big ? "24px" : "24px"}
            color={cblack}>
            {label}
        </Text>
    </Box>
    <Box mt="2px">
        <Text
            size={big ? "24px" : "24px"}
            color={cblack}
            style={{
                textTransform: transform ? transform : "none",
                letterSpacing: spacing ? spacing : 0
            }}>
            {text}
        </Text>
    </Box>
</Box>
