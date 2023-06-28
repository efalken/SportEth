import React, { useState } from "react";
import Logo from "../basics/Logo";
import { Flex, Box } from "rebass";
import Text from "../basics/Text";
import VBackground from "../basics/VBackgroundFull";
import SplashDrizzleContract from "../blocks/SplashDrizzleContract";
// import wppdf from "../whitepaper/SportEth.pdf";
// import excelSheet from "../whitepaper/sportEthData.xlsx";

export default function Splash() {
  const [contracts, setContracts] = useState([{ asset: "NFL", id: 0 }]);

  function openWhitepaper() {
    console.log("Opened whitepaper");
    // TODO
  }

  function openCheatSpreadsheet() {
    console.log("Opened cheat spreadsheet");
    // TODO
  }

  function openSimulationSheet() {
    console.log("Opened simulation sheet");
    // TODO
  }

  function openContract(id) {
    console.log("Opened contract", id);
    // TODO
  }

  return (
    <div>
      <VBackground />
      <Flex width={1}>
        {/* pt={30}
        px={30}> */}

        <Flex width={1} flexWrap="wrap">
          <Flex
            width={1}
            padding="10px"
            justifyContent="space-between"
          >
            <Box>
              <Logo />
            </Box>



          </Flex>
          <Flex
            width={1}
            justifyContent="center"
            alignItems="center"

          >
            <Box mt="50px">
              <Flex
                mt="20px"
                // mr="-20px"
                flexWrap="wrap"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                //color="#0ff000"
              >
                {contracts.map((contract) =>
                  contract.asset === "NFL" ? (
                    <Box mb="20px" key={contract.id}>
                      <SplashDrizzleContract
                        showActions={true}
                        key={contract.asset}
                        contract={contract}
                        width="1400px"
                        id={contract.id}
                      />
                    </Box>
                  ) : null
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>



      <div className="footer-links-wrapper" style={{ width: "115%" }}>
        {/* <Flex width="100%" alignItems="center" justifyContent="center">
          <Text size="15px">
            <a
              className="nav-header"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                width: "20em",
                alignItems: "flex-start",
                display: "flex",
              }}
              href="/betpage"
              target="_blank"
            >
              CLICK HERE TO GET TO MAIN PAGE
            </a>
          </Text>
        </Flex> */}

        <Flex width="100%" alignItems="center" justifyContent="center">
          <Text size="16px">
            <a
              className="nav-header"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                width: "20em",
                alignItems: "flex-start",
                display: "flex",
              //  color: "#white",
              }}
              href={
                new URL(`../../../../docs/SportEth.pdf`, import.meta.url)
                  .href
              }
              download=""
            >
              Whitepaper
            </a>
          </Text>
        </Flex>
        <Flex><Box>" "</Box></Flex>


        <Flex width="100%" alignItems="center" justifyContent="center">
          <Text size="16px">
          <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                        width: "20em",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                      href="/faqs"
                    >
                      FAQs
                    </a>
          </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>
        <Flex><Box>" "</Box></Flex>
        <Flex width="100%" alignItems="center" justifyContent="center">
          <Text size="16px">
 <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                        width: "20em",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                      href="http://github.com/efalken/SportEth"
                      //    href="FAQ.js"
                    >
              Github Codebase and Docs
            </a>
          </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>



      </div>
    </div>
  );
}
