import { C, B, cblack, cwhite } from './Colors'
import { Box } from '@rebass/grid'
import React from 'react'
import Text from './Text'

// eslint-disable-next-line
export default ({ label, text, transform, spacing, big }) => <Box>
    <Box>
        <Text
            size={big ? "16px" : "16px"}
            color={cwhite}>
            {label}
        </Text>
    </Box>
    <Box mt="2px">
        <Text
            size={big ? "16px" : "16px"}
            color={cwhite}
            style={{
                textTransform: transform ? transform : "none",
                //letterSpacing: spacing ? spacing : 0
            }}>
            {text}
        </Text>
    </Box>
</Box>
