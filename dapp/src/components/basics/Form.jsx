
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import Input from './Input'
import Button from './Button'
import Text from './Text'
  
export default function Form({ label, inputWidth, placeholder, buttonWidth, buttonLabel, justifyContent, value, onChange, onSubmit, ...props }) {
    return <Box
        {...props}>
        <Text>{label}</Text>
        <Flex mt="10px" justifyContent={justifyContent}>
            <Box mr="10px">
                <Input   onChange={({ target: { value } }) => onChange(value)} width={inputWidth} placeholder={placeholder} value={value} />
            </Box>
            <Box>
                <Button style={{
                    backgroundColor: "black",
                  // borderRadius: "1px",
                 //  borderColor: "yellow",
                    border: "1px solid #ffff00", 
                    cursor: "pointer",
                    color: "yellow",
                    padding: "4px"
                }} width={buttonWidth} onClick={onSubmit}>{buttonLabel}</Button>
            </Box>
        </Flex>
    </Box>
}