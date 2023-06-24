import React, { useState } from "react";
import Logo from "../basics/Logo";
import { Flex, Box } from "rebass";
import Text from "../basics/Text";
import VBackground from "../basics/VBackgroundCom";
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
            backgroundColor="rgba(27, 29, 30, 0.6)"
            padding="10px"
            justifyContent="space-between"
          >
            <Box>
              <Logo />
            </Box>
            <Flex
              width="100%"
              justifyContent="space-around"
              alignItems="center"
              // height="100%"
              className="nav-header-wrap"
            >
              {}
              <Flex
                flexWrap="wrap"
                width="100%"
                justifyContent="space-around"
                //   onClick={this.openWhitepaper}
                style={{ cursor: "pointer" }}
                variant="nav"
              >
                {}
                <Flex
                  alignItems="center"
                  height="100%"
                  className="nav-header-wrap"
                  backgroundColor="rgba(27, 29, 30, 0.6)"
                  width="100%"
                  justifyContent="space-around"
                >
                  <Text size="15px">
                    <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href={
                        new URL(`../whitepaper/SportEth.pdf`, import.meta.url)
                          .href
                      }
                      download=""
                    >
                      Whitepaper
                    </a>
                  </Text>

                  <Text size="15px">
                    <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="https://testnet.snowtrace.io/address/0x5e51b7f5ca7e3b7c969710be37f192e3d030f2b2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      EtherScan
                    </a>
                  </Text>

                  <Text size="15px">
                    <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="/faqs"
                    >
                      FAQ
                    </a>
                  </Text>

                  <Text size="15px">
                    <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href={
                        new URL(
                          `../whitepaper/sportEthData.xlsx`,
                          import.meta.url
                        ).href
                      }
                    >
                      Excel Sheet
                    </a>
                  </Text>

                  <Text size="15px">
                    <a
                      className="nav-header"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="http://github.com/efalken/SportEth"
                      //    href="FAQ.js"
                    >
                      Github Project
                    </a>
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {/* </Box> */}
          </Flex>
          <Flex
            width={1}
            justifyContent="center"
            alignItems="center"
            // style={{
            //     height: "calc(100vh - 90px)"
            // }}
          >
            <Box mt="50px">
              <Flex
                mt="20px"
                // mr="-20px"
                flexWrap="wrap"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
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
      {/* <Box>
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="center"
            color="859DA9"
          >
            <Text size="20px">Event Logs</Text>
          </Flex>
        </Box> */}

      <div className="footer-links-wrapper" style={{ width: "115%" }}>
        <Flex width="100%" alignItems="center" justifyContent="center">
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
        </Flex>

        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/bethistory"
              target="_blank"
            >
              Bet history
            </a>
          </Text>
        </Flex>

        <Flex>
          <Text> </Text>
        </Flex>

        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/bigbethistory"
              target="_blank"
            >
              Big Bet Offers
            </a>
          </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>
        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/oddshistory"
              target="_blank"
            >
              Oddds Posted
            </a>
          </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>
        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/resultshistory"
              target="_blank"
            >
              Game Outcomes
            </a>
          </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>
        <Flex>
          <Text> </Text>
        </Flex>
        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/schedhistory"
              target="_blank"
            >
              Weekly Bet Slate Schedules
            </a>
          </Text>
        </Flex>
        <Flex width="100%" alignItems="center" justifyContent="center">
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
              href="/starthistory"
              target="_blank"
            >
              Weekly Start Times
            </a>
          </Text>
        </Flex>
      </div>
    </div>
  );
}
