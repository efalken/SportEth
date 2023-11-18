import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G, cwhite } from "../basics/Colors";
import LabeledText from "../basics/LabeledText";
import Form from "../basics/Form";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import { Link } from "react-router-dom";
import { writeContract } from "viem/actions";
import { useAccount, useContractReads, useWalletClient } from "wagmi";
import {
  abi as bettingContractABI,
  address as bettingContractAddress,
} from "../../abis/Betting.json";
import {
  abi as oracleContractABI,
  address as oracleContractAddress,
} from "../../abis/Oracle.json";
import {
  abi as tokenContractABI,
  address as tokenContractAddress,
} from "../../abis/Token.json";
import { parseEther } from "viem";
import { defaultNetwork } from "../../config";

function BookiePage() {
  const { address } = useAccount();
  const [fundAmount, setFundAmount] = useState("");
  const [sharesToSell, setSharesToSell] = useState("");
  const [currentWeek, setCurrentWeek] = useState("");
  const [totalLpCapital, setTotalLpCapital] = useState(0);
  const [lockedLpCapital, setUsedCapital] = useState(0);
  const [betCapital, setBetCapital] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [betData, setBetData] = useState([]);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [bookieShares, setBookieShares] = useState("0");
  const [bookieEpoch, setBookieEpoch] = useState("0");
  const [bettingActive, setbettingActive] = useState(0);
  const [eoaTokens, setEoaTokens] = useState(0);
  const [tokensInK, setTokensInK] = useState("0");
  const [txnHash, setHash] = useState();

  document.title = "LP Page";
  useEffect(() => {
    const interval1 = setInterval(() => {
      refetchAll();
    }, 1000);
    return () => {
      clearInterval(interval1);
    };
  }, []);

  const { data: walletClient } = useWalletClient();

  async function updateTransactionHashDialogBox(hash) {
    setHash(
      <div>
        <div onClick={() => setHash(null)}>
          <a
            target="_blank"
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href={`${defaultNetwork.blockExplorers.default.url}/tx/${hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            target="_blank"
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
          >
            <u>click here to dismiss</u>
          </a>
        </div>
      </div>
    );
  }

  async function fundBook() {
    // let value2 = Number(fundAmount / 10000);
    //value = value2.toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "fundBook",
        value: parseEther(fundAmount),
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setFundAmount("");
  }

  async function wdBook() {
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "withdrawBook",
        args: [sharesToSell],
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setSharesToSell("");
  }

  async function claimRewards() {
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "tokenReward",
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
  }

  const { data, refetch: refetchAll } = useContractReads({
    contracts: [
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "showBetData",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showPropStartTimes",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "margin",
        args: [0],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "margin",
        args: [1],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "margin",
        args: [2],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "bettingActive",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "liqProvShares",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "bettingEpoch",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "concFactor",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showSchedString",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "lpStruct",
        args: [address],
      },
      {
        abi: tokenContractABI,
        address: tokenContractAddress,
        functionName: "balanceOf",
        args: [address],
      },
      {
        abi: tokenContractABI,
        address: tokenContractAddress,
        functionName: "balanceOf",
        args: [bettingContractAddress],
      },
    ],
  });

  useEffect(() => {
    if (!data) return;

    const [
      { result: _betData },
      { result: _startTimes },
      { result: _margin0 },
      { result: _margin1 },
      { result: _margin2 },
      { result: _bettingActive },
      { result: _lpShares },
      { result: _params0 },
      { result: _concFactor },
      { result: _schedString },
      { result: _lpStruct },
      { result: _eoaTokens },
      { result: _tokensInK },
    ] = data;

    setBetData(_betData || []);
    setCurrentWeek(Number(_params0));
    setTotalLpCapital(Number(_margin0 || 0n) / 10000);
    setUsedCapital(Number(_margin1 || 0n) / 10000);
    setBetCapital(Number(_margin2 || 0n) / 10000);
    setbettingActive(Number(_bettingActive || 0));
    setTotalShares(_lpShares || 0n);
    setEoaTokens(Number(_eoaTokens) / 1000 || 0);
    setTokensInK(Number(_tokensInK || 0n) / 1000);
    if (_schedString) setScheduleString(_schedString);

    const _bookieShares = _lpStruct[0] || "0";
    setBookieShares(_bookieShares);

    const _bookieEpoch = _lpStruct[2] || "0";
    setBookieEpoch(_bookieEpoch);
  }, [data]);
  console.log(tokensInK, "tokensInK");
  console.log(bookieShares, "bookieShares");

  function statusCheck() {
    if (!bettingActive) return "Betting inactive, can withdraw or fund.";
    if (bettingActive) return "Betting active, cannot withdraw or fund";
    return "na";
  }
  console.log("bettingActive", bettingActive);
  function unpack256(src) {
    if (!src) return [0, 0, 0, 0];
    //const str = bn.toString(16);
    const str = src.toString(16).padStart(64, "0");
    const pieces = str
      .toString(16)
      .match(/.{1,16}/g)
      .reverse();
    const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
    return ints;
  }

  let ethBookie =
    (Number(bookieShares) * Number(totalLpCapital)) / Number(totalShares);

  let [bets0, setBets0] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);

  let [bets1, setBets1] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);

  let [payoff0, setPayoff0] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);

  let [payoff1, setPayoff1] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);

  let [xdecode256, setXdecode] = useState([0, 1, 2, 3]);

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (betData) xdecode256 = unpack256(betData[ii]);
      bets0[ii] = Number(xdecode256[0]) || 0;
      bets1[ii] = Number(xdecode256[1]) || 0;
      payoff0[ii] = Number(xdecode256[2]) || 0;
      payoff1[ii] = Number(xdecode256[3]) || 0;
    }
    setBets0(bets0);
    setBets1(bets1);
    setPayoff0(payoff0);
    setPayoff1(payoff1);
    setXdecode(xdecode256);
  }, [betData]);

  let teamSplit = [];

  for (let i = 0; i < 32; i++) {
    teamSplit[i] = scheduleString[i].split(":");
  }

  let allMatches = [];

  for (let i = 0; i < 32; i++) {
    allMatches.push(
      teamSplit[i][0] !== "AAA" ? (
        <tr key={i} style={{ width: "25%", textAlign: "left" }}>
          <td>{i}</td>
          <td>{teamSplit[i][1]}</td>
          <td>{teamSplit[i][2]}</td>
          <td>{(bets0[i] / 10000).toFixed(3)}</td>
          <td>{(bets1[i] / 10000).toFixed(3)}</td>
          <td>{(payoff0[i] / 10000 - bets1[i] / 10000).toFixed(3)}</td>
          <td>{(payoff1[i] / 10000 - bets0[i] / 10000).toFixed(3)}</td>
        </tr>
      ) : (
        ""
      )
    );
  }

  return (
    <div>
      <VBackgroundCom />
      <Split
        page={"bookie"}
        side={
          <Box mt="30px" ml="25px" mr="35px">
            <Logo />
            <Flex mt="14px"></Flex>
            <Box
              mt="20px"
              pt="10px"
              style={{ borderTop: `thin solid ${G}` }}
            ></Box>

            <Box>
              <Flex
                width="100%"
                alignitems="center"
                justifycontent="marginLeft"
              >
                <Text size="14px">
                  <Link
                    className="nav-header"
                    style={{
                      // textDecoration: "none",
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/betpage"
                  >
                    Betting Page
                  </Link>
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex>
                <Text size="14px">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                      // font: "sans-serif"
                    }}
                    to="/oraclepage"
                  >
                    Oracle Page
                  </Link>
                </Text>
              </Flex>
            </Box>

            <Box>
              <Flex
                width="100%"
                alignitems="center"
                justifycontent="marginLeft"
              >
                <Text size="14px">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/FAQ"
                  >
                    FAQs
                  </Link>
                </Text>
              </Flex>
            </Box>
            <Box mb="10px" mt="10px">
              <Text className="style" size="14px">
                Connected Account Address
              </Text>
              <TruncatedAddress
                addr={address}
                start="6"
                end="3"
                transform="uppercase"
                spacing="1px"
              />
            </Box>

            <Box>
              <Flex
                mt="10px"
                pt="1px"
                alignitems="center"
                style={{ borderTop: `thin solid ${G}` }}
              ></Flex>
            </Box>

            <Box>
              <button
                style={{
                  backgroundColor: "black",
                  borderradius: "5px",
                  padding: "4px",
                  cursor: "pointer",
                  color: "#ccff99",
                  border: "1px solid #ccff99",
                }}
              >
                {Number(bookieShares).toLocaleString()}
              </button>
              <Text size="14px" className="style">
                {"  "}
                Account LP Share Balance
                <br />
                <br />
                {"total shares in contract: " +
                  Number(totalShares).toLocaleString()}
              </Text>
            </Box>

            {!bettingActive ? (
              <Box>
                <Form
                  onChange={(e) => setFundAmount(e.target.value)}
                  value={fundAmount}
                  onSubmit={fundBook}
                  mb="5px"
                  justifycontent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  placeholder="0.00 avax"
                  buttonLabel="Fund"
                />
                <Form
                  onChange={(e) => setSharesToSell(Number(e.target.value))}
                  value={sharesToSell}
                  onSubmit={wdBook}
                  mb="5px"
                  justifycontent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  placeholder="0.00 shares"
                  buttonLabel="Withdraw"
                />
              </Box>
            ) : (
              <Text size="14px" className="style">
                <br />
                No funding or withdrawals while betting active
                <br />
                <br />
              </Text>
            )}

            <Box>
              {" "}
              <Text size="14px" color={cwhite}>
                {"connected acct value: " +
                  Number(ethBookie).toFixed(1) +
                  " avax "}
              </Text>
              <Box>
                <Box>
                  <Flex>
                    <Flex width="100%" flexdirection="column">
                      <Box>
                        {" "}
                        <Text size="14px" color={cwhite}>
                          {"Total LP Capital : " +
                            Number(totalLpCapital).toFixed(2) +
                            " avax"}
                        </Text>
                        <br />
                        <Text size="14px" color={cwhite}>
                          {"Locked LP Capital: " +
                            Number(lockedLpCapital).toFixed(2) +
                            " avax"}
                        </Text>
                        <br />
                        <Text size="14px" color={cwhite}>
                          {"GrossBets : " +
                            Number(betCapital).toFixed(1) +
                            " avax"}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
                <Box>
                  <Flex
                    mt="10px"
                    pt="10px"
                    style={{ borderTop: `thin solid ${G}` }}
                  ></Flex>
                </Box>{" "}
                <Text size="14px" color={cwhite}>
                  Current Epoch: {currentWeek}{" "}
                </Text>
                <br></br>
                {/* {bookieEpoch === currentWeek ? (
                  <Text size="14px" color={cwhite}>
                    you can withdraw after settlement
                  </Text>
                ) : (
                  <Text size="14px" color={cwhite}>
                    you can withdraw before betting starts
                  </Text>
                )} */}
              </Box>
            </Box>

            <Box>
              {Number(tokensInK) > 0 ? (
                <Flex>
                  <Box>
                    {eoaTokens > 0 ? (
                      <Text size="14px" color={cwhite}>
                        Oracle tokens in your Wallet:{" "}
                        {Math.round(eoaTokens).toLocaleString()}
                      </Text>
                    ) : null}
                    <br />
                    <Text size="14px" color={cwhite}>
                      Token Rewards Remaining:{" "}
                      {Math.round(tokensInK).toLocaleString()}
                    </Text>
                    <br />
                    <Text size="14px" weight="300" color="#ffffff">
                      <br />
                      Token rewards can be claimed while tokens remain. Claiming
                      rewards sends tokens to your EOA. After claiming, user
                      cannot withdraw until after the next settlement.
                    </Text>
                    <br />
                    <br />
                    {ethBookie > 0 && bookieEpoch < currentWeek ? (
                      <button
                        style={{
                          backgroundColor: "black",
                          borderradius: "10px",
                          padding: "4px",
                          //borderradius: "1px",
                          cursor: "pointer",
                          color: "yellow",
                          border: "1px solid #ffff00",
                        }}
                        value={0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimRewards();
                        }}
                      >
                        Claim Reward
                      </button>
                    ) : null}
                  </Box>
                </Flex>
              ) : null}
            </Box>
            <Box>
              {tokensInK > 0 &&
              bookieEpoch == currentWeek &&
              bookieShares > 0 ? (
                <Text size="14px" color={cwhite}>
                  you can claim rewards after next settlement
                </Text>
              ) : null}
            </Box>
            <Box>
              <Flex
                mt="20px"
                pt="10px"
                style={{ borderTop: `thin solid ${G}` }}
              ></Flex>
            </Box>
          </Box>
        }
      >
        {/* <div className="bookie-page-wrapper" style={{ width: "100%" }}> */}
        <div style={{ width: "100%" }}>
          <Flex justifycontent="center">
            <Text size="25px" color="#ffffff">
              Liquidity Provider Page
            </Text>
          </Flex>
          <Box> {txnHash}</Box>
          <Box mt="14px" mx="30px">
            <Flex width="100%" justifycontent="marginLeft">
              <Text size="14px" className="style">
                Status: {statusCheck()} <br />A positive net liability number
                implies how much the LPs lose if the team wins. If negative, LPs
                profit if the team wins.
              </Text>
            </Flex>
          </Box>

          <Box>
            <Flex>
              <Flex width="100%" flexdirection="column">
                <Flex pt="10px" justifycontent="space-between"></Flex>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex>
              <Flex width="100%" flexdirection="column">
                <Flex
                  mt="10px"
                  pt="10px"
                  alignitems="center"
                  style={{
                    borderTop: `thin solid ${G}`,
                  }}
                ></Flex>

                <table
                  style={{
                    width: "100%",
                    borderRight: "1px solid",
                    float: "left",
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                  }}
                >
                  <tbody>
                    <tr
                      font="sans-serif"
                      style={{ width: "50%", textAlign: "left" }}
                    >
                      <th>Match</th>
                      <th>Favorite</th>
                      <th>Underdog</th>
                      <th>Fave Bets</th>
                      <th>Dog Bets</th>
                      <th>NetLiabFave</th>
                      <th>NetLiabDog</th>
                    </tr>
                    {allMatches}
                  </tbody>
                </table>
              </Flex>
            </Flex>
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default BookiePage;
