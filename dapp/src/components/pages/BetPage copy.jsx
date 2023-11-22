import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Icon from "../basics/Icon";
import Text from "../basics/Text";
import Form from "../basics/Form";
import { G } from "../basics/Colors";
import Input from "../basics/Input";
import Button from "../basics/Button";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import {
  abi as bettingContractABI,
  address as bettingContractAddress,
} from "../../abis/Betting.json";
import {
  abi as oracleContractABI,
  address as oracleContractAddress,
} from "../../abis/Oracle.json";
import TeamTable from "../blocks/TeamTable";
import TeamTableInit2 from "../blocks/TeamTableInit2";
import { Link } from "react-router-dom";
import { useAccount, useContractReads, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { writeContract } from "viem/actions";
import { defaultNetwork } from "../../config";
import BetHistoryRow from "./components/BetHistoryRow";
import ActiveBetRow from "./components/ActiveBetRow";

function BetPage() {
  document.title = "Betting Page";
  const { address } = useAccount();
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const [betAmount, setBetAmount] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [wdAmount, setWdAmount] = useState("");
  const [teamPick, setTeamPick] = useState(null);
  const [matchPick, setMatchPick] = useState(null);
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [viewedTxs, setViewedTxs] = useState(0);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [betData, setBetData] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [totalLpCapital, setTotalLpCapital] = useState(0);
  const [activeEpoch, setActiveEpoch] = useState(0);
  const [lockedLpCapital, setUsedCapital] = useState(0);
  const [betEpoch, setbetEpoch] = useState(0);
  const [concentrationLimit, setConcentrationLimit] = useState(0);
  const [bettingActive, setBettingActive] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(false);
  const [subNumber, setSubNumber] = useState(0);
  const [teamSplit, setTeamSplit] = useState([]);
  const [oddsVector, setOddsVector] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [counter, setCounter] = useState(0);
  const [txnHash, setHash] = useState();
  const [betHashes, setBetHashes] = useState([]);
  const [odds0, setOdds0] = useState([
    355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355,
    355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355,
    355, 355,
  ]);
  const [odds1, setOdds1] = useState([
    355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355,
    355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355, 355,
    355, 355,
  ]);
  const [liab0, setLiab0] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);
  const [liab1, setLiab1] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);
  let netLiab = [liab0, liab1];

  let xdecode256 = [0, 1, 2, 3];
  let odds999 = 0;
  let oddsTot = [odds0, odds1];

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (betData) xdecode256 = unpack256(betData[ii]);
      if (oddsVector) odds999 = Number(oddsVector[ii]) || 0;
      odds0[ii] = Math.floor(1e7 / (512 + odds999) - 10000) || 0;
      odds1[ii] = Math.floor(1e7 / (512 - odds999) - 10000) || 0;
      netLiab[0][ii] = Number(xdecode256[2]) - Number(xdecode256[1]);
      netLiab[1][ii] = Number(xdecode256[3]) - Number(xdecode256[0]);
    }
    setOdds0(odds0);
    setOdds1(odds1);
    setLiab0(liab0);
    setLiab1(liab1);
  }, [betData]);

  useEffect(() => {
    let _teamSplit = scheduleString.map((s) => (s ? s.split(":") : undefined));
    setTeamSplit(_teamSplit);
  }, [scheduleString]);

  async function fundBettor() {
    // let _value2 = Number(_value / 10000);
    // _value = _value2.toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        value: parseEther(fundAmount),
        functionName: "fundBettor",
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setFundAmount("");
  }

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

  async function withdrawBettor() {
    let wdamt = (Number(wdAmount) * 10000).toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "withdrawBettor",
        args: [wdamt],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setWdAmount("");
  }

  async function takeBet() {
    setHash(null);
    let betAmount2 = Math.round(betAmount * 10000);
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "bet",
        args: [matchPick, teamPick, betAmount2],
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setBetAmount("");
  }

  async function redeemBet() {
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "redeem",
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    totalLpCapital;
  }

  const { data, refetch: refetchAll } = useContractReads({
    contracts: [
      {
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: "userStruct",
        args: [address],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "showUserBetData",
        args: [address],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "showBetData",
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
        functionName: "showStartTime",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "showOdds",
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
        functionName: "bettingActive",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "reviewStatus",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "subNumber",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "betContracts",
        args: [betHashes[counter - 1]],
      },
    ],
  });

  useEffect(() => {
    if (!data) return;

    const [
      { result: us },
      { result: _bettorHashes },
      { result: _betData },
      { result: _totalLpCapital },
      { result: _startTimes },
      { result: _oddsvector },
      { result: _lockedLpCapital },
      { result: _betEpoch },
      { result: _concentrationLimit },
      { result: sctring },
      { result: _bettingActive },
      { result: _reviewStatus },
      { result: _subNumber },
      { result: betContracts },
    ] = data;

    const _counter = us ? Number(us[0]) : 0;
    setCounter(_counter);

    let _userBalance = us ? Number(us[1]) : 0;
    setUserBalance(_userBalance);

    if (_counter) {
      let _lastBetHash = Object.values(_bettorHashes || []).slice(0, _counter);
      setBetHashes(_lastBetHash);
    }

    setBetData(_betData || []);

    setTotalLpCapital(Number(_totalLpCapital || 0n));

    setStartTime(_startTimes || []);

    setOddsVector(_oddsvector || []);

    setUsedCapital(Number(_lockedLpCapital || 0n));

    setbetEpoch(Number(_betEpoch || 0n));

    setConcentrationLimit(Number(_concentrationLimit || 0n));

    setScheduleString(sctring || Array(32).fill("check later...: n/a: n/a"));

    setBettingActive(_bettingActive);

    setReviewStatus(_reviewStatus || false);

    setSubNumber(Number(_subNumber || 0n));

    let _activeEpoch = betContracts ? Number(betContracts[0]) : 0;
    setActiveEpoch(_activeEpoch);
  }, [data, counter]);

  useEffect(() => {
    setInterval(() => {
      refetchAll();
    }, 1000);
  }, []);

  // function getOutcome(outcomei) {
  //   let outx = "lose";
  //   let outnum = Number(outcomei);
  //   if (outnum === 1) {
  //     outx = "win";
  //   } else if (outnum === 2) {
  //     outx = "tie";
  //   }
  //   return outx;
  // }

  function getMaxSize(liabOpponent, liabPick, oddsPick, x) {
    liabOpponent = isNaN(liabOpponent) ? 0 : Number(liabOpponent);
    liabPick = isNaN(liabPick) ? 1 : Number(liabPick);
    oddsPick = isNaN(oddsPick) ? 1 : Number(oddsPick) / 10000;
    let _maxSize =
      Math.max(liabOpponent - liabPick, 0) +
      Math.min(
        totalLpCapital / concentrationLimit - Math.max(liabOpponent, liabPick),
        totalLpCapital - lockedLpCapital
      );
    _maxSize = _maxSize / oddsPick / 100000;
    if (!bettingActive) _maxSize = 0;
    return x;
  }

  function unpack256(src) {
    if (!src) return [];
    const str = src.toString(16).padStart(64, "0");
    const pieces = str
      .toString(16)
      .match(/.{1,16}/g)
      .reverse();
    const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
    return ints;
  }

  function subNumberWord() {
    if (subNumber === 0) {
      if (reviewStatus) return "Betting Active";
      if (!reviewStatus)
        return "Settlement complete. Next week's schedule finalized, waiting for odds.";
    } else {
      if (reviewStatus)
        return "new schedule posted below, settlement within 12 hours";
      if (!reviewStatus)
        return "Matches set, odds being processed, active betting within 12 hours";
    }
  }

  // function bettingWord() {
  //   if (bettingActive === 0 && subNumber == 0)
  //     return "settle completed, waiting for next weekend's schedule";
  //   if (bettingActive === 2 && subNumber == 0) return "Betting Active!";
  //   if (bettingActive === 2 && subNumber > 0)
  //     return "Betting closed, settlement in process";
  //   if (bettingActive === 1)
  //     return "Schedule posted completed, waiting for odds.";
  // }

  function getMoneyLine(decOddsi) {
    if (decOddsi < 1e4) {
      return (-1e6 / decOddsi).toFixed(0);
    } else {
      return Number((decOddsi - 1) / 1e2).toFixed(0);
    }
  }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }
  console.log("initFeePool", betHashes[counter - 1]);
  console.log("activeEpoch", activeEpoch);
  console.log("betEpoch", betEpoch);

  function openEtherscan(txhash) {
    const url = `${defaultNetwork.blockExplorers.default.url}/tx/${txhash}`;
    window.open(url, "_blank");
    setViewedTxs(viewedTxs + 1);
  }

  function radioFavePick(teampic) {
    setMatchPick(teampic);
    setTeamPick(0);
  }

  function radioUnderPick(teampic) {
    setMatchPick(teampic);
    setTeamPick(1);
  }

  return (
    <div>
      <VBackgroundCom />
      <Split
        page={"betpage"}
        side={
          <Box mt="30px" ml="25px" mr="30px">
            <div style={{ display: "flex" }}>
              <Icon /> <Logo />
            </div>
            <Box>
              <Flex
                mt="20px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
              <Flex style={{ borderTop: `thin solid ${G}` }}></Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
            </Box>
            <Box>
              <Flex>
                <Text style={{ color: "white", fontSize: "14px" }}>
                  LP book has {Number(totalLpCapital / 1e4).toFixed(2)} avax
                  <br />
                  go to{" "}
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/bookiepage"
                  >
                    LP Page
                  </Link>{" "}
                  to invest in the book
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex
                width="100%"
                alignitems="center"
                justifycontent="marginleft"
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
            <Box>
              <Flex
                mt="5px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
            </Box>
            <Flex>
              <Box mt="1px" mb="1px" font="white">
                <button
                  style={{
                    backgroundColor: "black",
                    borderradius: "5px",
                    cursor: "pointer",
                    color: "yellow",
                    border: "1px solid #ffff00",
                    padding: "4px",
                    // width: width ? width : 120,
                    // color: "#00ff00",
                  }}
                  onClick={switchOdds}
                >
                  {showDecimalOdds
                    ? "Switch to MoneyLine Odds"
                    : "Switch to Decimal Odds"}
                </button>{" "}
              </Box>
            </Flex>{" "}
            <Box>
              <Flex
                mt="10px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>

              <Box>
                <Flex
                  style={{
                    borderTop: `thin solid ${G}`,
                  }}
                ></Flex>
              </Box>
              <Flex
                mt="1px"
                flexdirection="row"
                justifycontent="flex-start"
                alignitems="center"
              >
                <Box>
                  <Box mb="10px" mt="10px">
                    <Text size="14px" className="style">
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
                      {Number(userBalance / 1e4).toFixed(4)}
                    </button>
                    <Text size="14px" className="style">
                      {"  "}
                      Account Avax Balance
                    </Text>
                  </Box>
                  <Form
                    onChange={(e) => setFundAmount(e.target.value)}
                    value={fundAmount}
                    onSubmit={fundBettor}
                    mb="2px"
                    justifycontent="flex-start"
                    buttonWidth="95px"
                    inputWidth="100px"
                    placeholder="0.000 avax"
                    buttonLabel="Fund"
                  />
                  <Form
                    onChange={(e) => setWdAmount(e.target.value)}
                    value={wdAmount}
                    onSubmit={withdrawBettor}
                    mb="1px"
                    justifycontent="flex-start"
                    buttonWidth="95px"
                    color="yellow"
                    inputWidth="100px"
                    borderradius="1px"
                    placeholder="0.000 avax"
                    buttonLabel="WithDraw"
                  />
                </Box>
              </Flex>
              <Flex mb="10px" style={{ borderTop: `thin solid ${G}` }}></Flex>
              <Flex justifycontent="left">
                <Text size="14px" color="#ffffff">
                  Current Epoch: {betEpoch}
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex>
                <div style={{ width: "100%", float: "left" }}>
                  <Text className="style" color="#ffffff" size="14px">
                    {" "}
                    Your active bets
                  </Text>
                  <br />
                  <table
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      fontFamily: "sans-serif",
                      color: "#ffffff",
                    }}
                  >
                    <tbody>
                      <tr style={{ width: "33%", color: "#ffffff" }}>
                        <td>Match</td>
                        <td>Pick</td>
                        <td>BetSize</td>
                        <td>DecOdds</td>
                      </tr>
                      {Object.values(betHashes).map(
                        (contractHash, index) =>
                          index < counter && (
                            <ActiveBetRow
                              key={index}
                              contractHash={contractHash}
                              betEpoch={betEpoch}
                              teamSplit={teamSplit}
                            />
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
              <Flex
                style={{
                  borderTop: `thin solid ${G}`,
                }}
              ></Flex>
            </Box>
            <Box>
              {activeEpoch < betEpoch && activeEpoch > 0 ? (
                <button
                  style={{
                    backgroundColor: "black",
                    borderradius: "5px",
                    padding: "4px",
                    //borderradius: "1px",
                    cursor: "pointer",
                    color: "yellow",
                    border: "1px solid #ffff00",
                    // width: width ? width : 120,
                    // color: "#00ff00",
                  }}
                  value={0}
                  onClick={(e) => {
                    e.preventDefault();
                    redeemBet();
                  }}
                >
                  Redeem
                </button>
              ) : (
                ""
              )}
            </Box>
            <Box>
              <Flex>
                <div style={{ width: "100%", float: "left" }}>
                  <Text className="style" size="14px">
                    {" "}
                    settled bets
                  </Text>
                  <br />
                  <table
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      float: "left",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <tbody>
                      <tr style={{ width: "33%", color: "#ffffff" }}>
                        <td>Epoch</td>
                        <td>Pick</td>
                        <td>Your Payout</td>
                        <td>Win?</td>
                      </tr>
                      {Object.values(betHashes).map(
                        (contractHash, index) =>
                          index < counter && (
                            <BetHistoryRow
                              key={index}
                              contractHash={contractHash}
                              betEpoch={betEpoch}
                              teamSplit={teamSplit}
                            />
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </Flex>
            </Box>
            {/* <Box>
              <Flex>  
                <Text size="14px" color="#000">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/bethistory"
                  >
                    bet history
                  </Link>
                </Text>
              </Flex>
            </Box> */}
            {/* <Box>
              <Flex>
                <Text size="14px" color="#000">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/oddshistory"
                  >
                    odds history
                  </Link>
                </Text>
              </Flex>
            </Box> */}
            {/* <Box>
              <Flex>
                <Text size="14px" color="#000">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/schedhistory"
                  >
                    schedule history
                  </Link>
                </Text>
              </Flex>
            </Box> */}
            {/* <Box>
              <Flex>
                <Text size="14px" color="#000">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/starthistory"
                  >
                    start history
                  </Link>
                </Text>
              </Flex>
            </Box> */}
            {/* <Box>
              <Flex>
                <Text size="14px" color="#000">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
                    to="/resultshistory"
                  >
                    result history
                  </Link>
                </Text>
              </Flex>
            </Box> */}
            <Box></Box>
          </Box>
        }
      >
        <Flex justifycontent="center">
          <Text size="25px" className="style">
            Betting Page
          </Text>
        </Flex>
        <Box> {txnHash}</Box>

        <Box mt="14px" mx="30px">
          <Flex width="100%" justifycontent="center">
            <Text size="14px" weight="300" className="style">
              Status: {subNumberWord()}
            </Text>
          </Flex>
        </Box>

        <Box mt="14px" mx="30px"></Box>

        <Flex
          mt="10px"
          pt="10px"
          alignitems="center"
          style={{
            borderTop: `thin solid ${G}`,
          }}
        ></Flex>
        {teamPick != null ? (
          <Flex
            mt="5px"
            flexdirection="row"
            justifycontent="flex-start"
            alignitems="center"
          >
            <Text
              size="14px"
              weight="400"
              color="white"
              style={{ paddingRight: "10px", paddingTop: "5px" }}
            >
              Bet Amount
            </Text>

            <Input
              onChange={({ target: { value } }) => setBetAmount(value)}
              width="100px"
              color="black"
              font="sans-serif"
              placeholder={"0.0000 avax"}
              marginleft="10px"
              marginRignt="25px"
              paddingRight="10px"
              // color="yellow"
              value={betAmount}
            />

            <Box mt="0px" mb="10px">
              <Button
                style={{
                  //height: "30px",
                  // width: "100px",
                  float: "right",
                  marginleft: "15px",
                  border: "1px solid yellow",
                  padding: "4px",
                  // color: "black"
                }}
                onClick={takeBet}
              >
                Bet Now{" "}
              </Button>{" "}
            </Box>

            <Box mt="10px" mb="10px" ml="40px" mr="80px"></Box>
          </Flex>
        ) : null}

        <Box>
          {" "}
          <Flex
            mt="20px"
            flexdirection="row"
            justifycontent="space-between"
          ></Flex>
        </Box>

        <Flex
          style={{
            //  color: "#000",
            fontSize: "14px",
          }}
        >
          {teamPick != null ? (
            <Text size="14px" weight="400" color="white">
              MaxBet:{" "}
              {Number(
                getMaxSize(
                  Number(netLiab[1 - teamPick][matchPick]),
                  Number(netLiab[teamPick][matchPick]),
                  Number(oddsTot[teamPick][matchPick]),
                  teamPick
                )
              ).toFixed(2)}
              {"  "} <br />
              pick: {teamSplit[matchPick][teamPick + 1]}
              {",  "} Decimal Odds:{" "}
              {((0.95 * oddsTot[teamPick][matchPick]) / 10000 + 1).toFixed(3)}
              {";  "} MoneyLine Odds:{" "}
              {getMoneyLine(0.95 * oddsTot[teamPick][matchPick])}
              {"  "}
            </Text>
          ) : null}
        </Flex>

        <Box>
          <Flex
            mt="20px"
            flexdirection="row"
            justifycontent="space-between"
          ></Flex>
        </Box>
        <div>
          <Box>
            {" "}
            <Flex>
              {reviewStatus && subNumber == 0 ? (
                <TeamTable
                  teamSplit={teamSplit}
                  startTimeColumn={startTime}
                  radioFavePick={radioFavePick}
                  showDecimalOdds={showDecimalOdds}
                  oddsTot={oddsTot}
                  radioUnderPick={radioUnderPick}
                />
              ) : (
                <TeamTableInit2
                  teamSplit={teamSplit}
                  startTimeColumn={startTime}
                />
              )}
            </Flex>
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default BetPage;
