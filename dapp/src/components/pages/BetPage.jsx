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
  const [activeStart, setGameStart] = useState(0);
  const [currTime, setCurrTime] = useState(0);
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
  const [totalLpCapital, setUnlockedLpCapital] = useState(0);
  const [lockedLpCapital, setUsedCapital] = useState(0);
  const [currW4, setCurrW4] = useState(0);
  const [concentrationLimit, setConcentrationLimit] = useState(0);
  const [teamSplit, setTeamSplit] = useState([]);
  const [oddsVector, setOddsVector] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [counter, setCounter] = useState(0);
  const [txnHash, setHash] = useState();
  const [betHashes, setBetHashes] = useState([]);
  const [odds0, setOdds0] = useState([
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957,
  ]);
  const [odds1, setOdds1] = useState([
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957,
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
      if (oddsVector) odds999 = Number(oddsVector[ii]) || 1000;
      odds0[ii] = odds999;
      odds1[ii] = Math.floor(1000000 / (odds999 + 45) - 45);
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

  async function fundBettor(value) {
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        value: parseEther(value),
        functionName: "fundBettor",
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
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

  async function withdrawBettor() {
    try {
      console.log(wdAmount);
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "withdrawBettor",
        args: [wdAmount * 10000],
      });
      console.log("A");
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
  }

  async function takeBet() {
    setHash(null);
    let betAmount2 = Math.round(betAmount);
    try {
      const txHash = await writeContract(walletClient, {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "bet",
        args: [matchPick, teamPick, betAmount2 * 10000],
      });

      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
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
        functionName: "params",
        args: [3],
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
        functionName: "params",
        args: [0],
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "params",
        args: [1],
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showSchedString",
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
      { result: _gameStart },
      { result: _startTimes },
      { result: _oddsvector },
      { result: _lockedLpCapital },
      { result: _currW4 },
      { result: _concentrationLimit },
      { result: sctring },
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

    setUnlockedLpCapital(Number(_totalLpCapital || 0n));

    setGameStart(Number(_gameStart || 0n));

    setStartTime(_startTimes || []);

    setOddsVector(_oddsvector || []);

    setUsedCapital(Number(_lockedLpCapital || 0n));

    setCurrW4(Number(_currW4 || 0n));

    setConcentrationLimit(Number(_concentrationLimit || 0n));

    setScheduleString(sctring || Array(32).fill("check later...: n/a: n/a"));
  }, [data, counter]);

  useEffect(() => {
    setInterval(() => {
      let _currTime = Math.floor(new Date().getTime() / 1000);
      setCurrTime(_currTime);
    }, 1000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      refetchAll();
    }, 1000);
  }, []);

  function getMaxSize(liabOpponent, liabPick, oddsPick) {
    liabOpponent = isNaN(liabOpponent) ? 0 : Number(liabOpponent);
    liabPick = isNaN(liabPick) ? 1 : Number(liabPick);
    oddsPick = isNaN(oddsPick) ? 1 : Number(oddsPick) / 1000;
    let _maxSize =
      Math.max(liabOpponent - liabPick, 0) +
      Math.min(
        totalLpCapital / concentrationLimit - Math.max(liabOpponent, liabPick),
        totalLpCapital - lockedLpCapital
      );
    _maxSize = _maxSize / oddsPick / 10000;
    return _maxSize;
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

  function getMoneyLine(decOddsi) {
    let moneyline = 0;
    if (decOddsi < 1000) {
      moneyline = -1e5 / decOddsi;
    } else {
      moneyline = decOddsi / 10;
    }
    moneyline = moneyline.toFixed(0);
    if (moneyline > 0) {
      moneyline = "+" + moneyline;
    }
    return moneyline;
  }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

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
                <Text size="14px" color="#000">
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
                    to="/"
                  >
                    HomePage
                  </Link>
                </Text>
              </Flex>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                Connected Account Address
              </Text>
              <TruncatedAddress
                addr={address}
                start="8"
                end="0"
                transform="uppercase"
                spacing="1px"
              />
              <Text size="14px" className="style">
                Your free capital on contract:{" "}
                {(Number(userBalance) / 1e4).toFixed(3)} AVAX
              </Text>
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
                  <Form
                    onChange={(e) => setWdAmount(Number(e.target.value))}
                    value={wdAmount}
                    onSubmit={withdrawBettor}
                    mb="1px"
                    justifycontent="flex-start"
                    buttonWidth="95px"
                    color="yellow"
                    inputWidth="100px"
                    borderradius="1px"
                    placeholder="# avax"
                    buttonLabel="WithDraw"
                    padding="4px"
                  />
                </Box>
              </Flex>
              <Flex
                mt="1px"
                flexdirection="row"
                justifycontent="flex-start"
                alignitems="center"
              >
                <Box>
                  <Form
                    onChange={(e) => setFundAmount(Number(e.target.value))}
                    value={fundAmount}
                    onSubmit={fundBettor}
                    mb="10px"
                    justifycontent="flex-start"
                    buttonWidth="95px"
                    inputWidth="100px"
                    borderradius="1px"
                    placeholder="# avax"
                    //backgroundColor = "#fff"
                    buttonLabel="Fund"
                  />
                </Box>
              </Flex>
              <Flex mb="10px" style={{ borderTop: `thin solid ${G}` }}></Flex>
              <Flex justifycontent="left">
                <Text size="14px" color="#ffffff">
                  Current Epoch: {currW4}
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
                              currW4={currW4}
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
              {counter > 0 ? (
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
                  <Text size="14px" className="style">
                    Bets in stack: {counter}
                  </Text>
                  <br />

                  <Text className="style" size="14px">
                    {" "}
                    resolved bets to be processed via redeem
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
                              currW4={currW4}
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
            </Box>
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box></Box>
          </Box>
        }
      >
        <Flex justifycontent="center">
          <Text size="25px" className="style">
            Place Bets Here
          </Text>
        </Flex>
        <Box> {txnHash}</Box>

        <Box mt="14px" mx="30px">
          <Flex width="100%" justifycontent="center">
            {+3 * 86400 < 0 ? (
              <Text size="14px" weight="300" className="style">
                betting closed, waiting for next weekend's schedule ...
              </Text>
            ) : (
              <Text size="14px" weight="300" className="style">
                Fund account. Once funded, toggle radio button on the
                team/player and enter desired avax bet in the box (eg, 1.123).
                If they win, you get your bet back times the decimal odds. You
                redeem all bets at once, which clears your array of unredeemed
                bets, but only when you have no active bets. If you have 16
                unredeemed active and closed bets, you must clear your
                unredeemed bets to bet again. Redemption sends any winning back
                to your free capital balance, which is then available for
                withdrawal or new bets.
              </Text>
            )}
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
              style={{ paddingLeft: "10px" }}
            >
              Bet Amount
            </Text>

            <Input
              onChange={({ target: { value } }) => setBetAmount(value)}
              width="100px"
              color="black"
              font="sans-serif"
              placeholder={"# avax"}
              marginleft="10px"
              marginRignt="5px"
              // color="yellow"
              value={betAmount}
            />
            <Box mt="10px" mb="10px">
              <Button
                style={{
                  //height: "30px",
                  // width: "100px",
                  float: "right",
                  marginleft: "5px",
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
                  Number(oddsTot[teamPick][matchPick])
                )
              ).toFixed(2)}
              {"  "} <br />
              pick: {teamSplit[matchPick][teamPick + 1]}
              {"  "}
              Decimal Odds:{" "}
              {((0.95 * oddsTot[teamPick][matchPick]) / 1000 + 1).toFixed(3)}
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
              <TeamTable
                teamSplit={teamSplit}
                startTimeColumn={startTime}
                radioFavePick={radioFavePick}
                showDecimalOdds={showDecimalOdds}
                oddsTot={oddsTot}
                radioUnderPick={radioUnderPick}
                getMoneyLine={getMoneyLine}
              />
            </Flex>{" "}
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default BetPage;
