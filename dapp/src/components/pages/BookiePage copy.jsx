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
  const [startTime, setStartTime] = useState([]);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [bookieShares, setBookieShares] = useState("0");
  const [bookieEpoch, setBookieEpoch] = useState("0");
  // const [tokenAmount, setTokenAmount] = useState("0");
  const [eoaTokens, setEoaTokens] = useState("0");
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
        <div
          style={{
            color: "yellow",
            font: "Arial",
            fontStyle: "Italic",
            fontSize: "14px",
          }}
          onClick={() => setHash(null)}
        >
          click here to dismiss
        </div>
      </div>
    );
  }

  async function fundBook(value) {
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "fundBook",
        value: parseEther(value),
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
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
        functionName: "margin",
        args: [3],
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
      { result: _margin3 },
      { result: _params0 },
      { result: _concFactor },
      { result: _schedString },
      { result: _lpStruct },
      { result: _balanceOfUser },
      { result: _balanceOfContract },
    ] = data;

    setBetData(_betData || []);
    setStartTime(_startTimes || []);
    setCurrentWeek(Number(_params0));
    setTotalLpCapital(Number(_margin0 || 0n) / 10000);
    setUsedCapital(Number(_margin1 || 0n) / 10000);
    setBetCapital(Number(_margin2 || 0n) / 10000);
    setTotalShares(_margin3 || 0n);
    setEoaTokens(Number(_balanceOfUser || 0n) / 1000);
    setTokensInK(Number(_balanceOfContract || 0n) / 1000);
    if (_schedString) setScheduleString(_schedString);

    const _bookieShares = _lpStruct[0] || "0";
    setBookieShares(_bookieShares);

    const _bookieEpoch = _lpStruct[1] || "0";
    setBookieEpoch(_bookieEpoch);
  }, [data]);
  console.log(bookieEpoch, "bookieEpoch");
  console.log(currentWeek, "currentEpoch");
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
      startTime[i + 1] > 0 ? (
        <tr key={i} style={{ width: "25%", textAlign: "left" }}>
          <td>{i}</td>
          <td>{teamSplit[i][1]}</td>
          <td>{teamSplit[i][2]}</td>
          <td>{(bets0[i] / 10000).toFixed(1)}</td>
          <td>{(bets1[i] / 10000).toFixed(1)}</td>
          <td>{(payoff0[i] / 10000 - bets1[i] / 10000).toFixed(1)}</td>
          <td>{(payoff1[i] / 10000 - bets0[i] / 10000).toFixed(1)}</td>
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
                    to="/"
                  >
                    Home Page
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
                start="8"
                end="0"
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
              <Form
                onChange={(e) => setFundAmount(Number(e.target.value))}
                value={fundAmount}
                onSubmit={fundBook}
                mb="20px"
                justifycontent="flex-start"
                padding="4px"
                placeholder="# avax"
                buttonLabel="Fund"
              />
            </Box>
            <Box>
              <Text size="14px" color={cwhite}>
                {"Your:"}
              </Text>
              <br />{" "}
              <Text size="14px" color={cwhite}>
                {"LP shares: " + Number(bookieShares).toLocaleString()}
              </Text>
              <br />
              <Text size="14px" color={cwhite}>
                {"LP percent: " +
                  Math.floor(
                    (Number(bookieShares) * 100) / Number(totalShares)
                  ).toFixed(1) +
                  "%"}
              </Text>
            </Box>

            <Box>
              {" "}
              <Text size="14px" color={cwhite}>
                {"share value: " + Number(ethBookie).toFixed(1) + " avax "}
              </Text>
              <Box>
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
                      <Flex pt="10px" justifycontent="left">
                        <Box>
                          {" "}
                          <Text size="14px" color={cwhite}>
                            {"Total LP Capital : " +
                              Number(totalLpCapital).toFixed(4) +
                              " avax"}
                          </Text>
                          <br />
                          <Text size="14px" color={cwhite}>
                            {"% Locked : " +
                              (
                                (Number(lockedLpCapital) * 100) /
                                Number(totalLpCapital)
                              ).toFixed(1) +
                              "%"}
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
                {bookieEpoch === currentWeek ? (
                  <Text size="14px" color={cwhite}>
                    you can withdraw after settlement
                  </Text>
                ) : null}
              </Box>
            </Box>
            <Box>
              {Number(bookieShares) > 0 ? (
                <Flex>
                  <Box>
                    <Form
                      onChange={(e) => setSharesToSell(Number(e.target.value))}
                      value={sharesToSell}
                      onSubmit={wdBook}
                      mb="20px"
                      justifycontent="flex-start"
                      buttonWidth="95px"
                      inputWidth="100px"
                      placeholder="# shares"
                      buttonLabel="Withdraw"
                    />
                  </Box>
                </Flex>
              ) : null}
            </Box>
            <Box>
              {Number(tokensInK) > 0 ? (
                <Flex>
                  <Box>
                    {eoaTokens > 0 ? (
                      <Text size="14px" color={cwhite}>
                        oracle tokens in your Wallet:
                        {Number(eoaTokens).toLocaleString()}
                      </Text>
                    ) : null}
                    <LabeledText
                      big
                      label="Token Rewards Remaining"
                      text={Number(tokensInK).toLocaleString()}
                      spacing="1px"
                    />{" "}
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
              {ethBookie > 0 && bookieEpoch == currentWeek ? (
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
              <Text size="14px" weight="300" color="#ffffff">
                {" "}
                This page helps LPs understand their netLiab exposure to this
                week's events. The NetLiability is the amount paid out by the
                contract if the Favorite or Underdog Team wins. If negative this
                means the LPs are credited AVAX. LPs can fund and withdraw using
                the left-hand fields.
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
