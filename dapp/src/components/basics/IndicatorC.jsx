import { G } from './Colors'
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import Button from './Button'

/*
    # Indicator C
    This components displays a value
*/
export default ({ children, buttonLabel, onClick, ...props }) => <Flex
    pt="10px"
    pb="10px"
    justifyContent="marginLeft"
    alignItems="marginLeft"
    {...props}
    style={{
        borderTop: `thin solid ${G}`,
        borderBottom: `thin solid ${G}`,
        marginBottom: "15px"
    }}>
    <Box mt="-5px">
        {children}
    </Box>
    <Box>
        <Button onClick={onClick}>{buttonLabel}</Button>
    </Box>
</Flex>
