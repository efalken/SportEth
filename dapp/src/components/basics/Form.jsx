import { Box, Flex } from "@rebass/grid";
import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Text from "./Text";

export default function Form({
  label,
  inputWidth,
  placeholder,
  buttonWidth,
  buttonLabel,
  justifyContent,
  onSubmit,
  ...props
}) {
  const [value, setValue] = useState("");

  return (
    <Box {...props}>
      <Text>{label}</Text>
      <Flex mt="10px" justifyContent={justifyContent}>
        <Box mr="10px">
          <Input
            onChange={({ target: { value } }) => setValue(value)}
            width={inputWidth}
            placeholder={placeholder}
            value={value}
          />
        </Box>
        <Box>
          <Button
            style={{
              backgroundColor: "black",
              border: `1px solid ${false ? "#ffff0099" : "#ffff00"}`,
              color: false ? "#ffff0099" : "#ffff00",
              padding: "4px",
            }}
            width={buttonWidth}
            disabled={Boolean(false)}
            onClick={() => onSubmit(value)}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
