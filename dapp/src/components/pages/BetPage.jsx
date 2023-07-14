import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import Form from "../basics/Form";
import { G } from "../basics/Colors";
import Input from "../basics/Input";
import Button from "../basics/Button";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import { ethers } from "ethers";
import { useAuthContext } from "../../contexts/AuthContext";
import { networkConfig } from "../../config";
import TeamTable from "../blocks/TeamTable";
import { Link } from "react-router-dom";
//import { syncEvents } from "../../helpers/syncEvents";
//import { BigNumber } from "bignumber.js";

function BetPage() {
  const { oracleContract, bettingContract, account } = useAuthContext();

  const [betAmount, setBetAmount] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [wdAmount, setWdAmount] = useState("");
  const [teamPick, setTeamPick] = useState(null);
  const [matchPick, setMatchPick] = useState(null);
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [viewedTxs, setViewedTxs] = useState(0);
  const [betHistory, setBetHistory] = useState([{}]);
  const [subcontracts, setSubcontracts] = useState({});
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [betData, setBetData] = useState([]);
  const [userBalance, setUserBalance] = useState("0");
  const [unusedCapital, setUnusedCapital] = useState("0");
  const [usedCapital, setUsedCapital] = useState("0");
  const [currW4, setCurrW4] = useState("0");
  const [concentrationLimit, setConcentrationLimit] = useState("0");
  const [teamSplit, setTeamSplit] = useState([]);
  const [betNumber, setBetNumber] = useState("0");
  const [oddsVector, setOddsVector] = useState([]);
  const [startTime, setStartTime] = useState([]);

  useEffect(() => {
    if (!bettingContract || !oracleContract) return;

    document.title = "Betting Page";
    const interval1 = setInterval(() => {
      findValues();
    }, 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [bettingContract, oracleContract]);

  async function fundBettor(x) {
    try {
      const stackId = await bettingContract.fundBettor({
        value: ethers.parseEther(fundAmount),
      });
      // console.log("stackid", stackId);
    } catch (error) {
      // console.log("igotanerror", error);
    }
  }

  async function withdrawBettor(x) {
    await bettingContract.withdrawBettor(wdAmount * 10000);
  }

  async function takeBet() {
    const tx = await bettingContract.bet(
      matchPick,
      teamPick,
      betAmount * 10000
    );
    const receipt = await tx.wait(1);
    // await syncEvents(receipt.hash);
  }

  async function redeemBet() {
    const tx = await bettingContract.redeem();
    const receipt = await tx.wait(1);
    // await syncEvents(receipt.hash);
  }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

  // async function getBets(hash) {
  //   const betParams = await bettingContract.betContracts(hash);
  // }

  function openEtherscan(txhash) {
    const url = `${
      networkConfig.blockExplorerUrls ? networkConfig.blockExplorerUrls[0] : ""
    }tx/${txhash}`;
    window.open(url, "_blank");
    setViewedTxs(viewedTxs + 1);
  }

  async function addBetRecord(contractHash) {
    // console.log(subcontracts);
    const { epoch, matchNum, pick, betAmount, payoff, bettor } =
      await bettingContract.betContracts(contractHash);

    if (Object.keys(subcontracts).includes(contractHash)) return;

    betHistory[0][contractHash] = {
      Hashoutput: contractHash,
      BettorAddress: bettor,
      Epoch: Number(epoch),
      BetSize: Number(betAmount) / 10000,
      LongPick: Number(pick),
      MatchNum: Number(matchNum),
      Payoff: (0.95 * Number(payoff)) / 10000,
      // Redeemable: await bettingContract.checkRedeem(
      //   contractHash
      // ),
    };
    subcontracts[contractHash] = await bettingContract.checkRedeem(
      contractHash
    );
    setSubcontracts(subcontracts);
    setBetHistory(betHistory);
  }

  useEffect(() => {
    if (!bettingContract || !account) return;

    updateBetHashes();

    const BetRecordFilter = bettingContract.filters.BetRecord(account);
    bettingContract.on(BetRecordFilter, (eventEmitted) => {
      const { contractHash } = eventEmitted.args;
      console.log(contractHash);
      addBetRecord(contractHash);
    });

    const FundingFilter = bettingContract.filters.Funding(account);
    bettingContract.on(FundingFilter, () => {
      updateBetHashes();
    });
  }, [bettingContract, account]);

  function radioFavePick(teampic) {
    setMatchPick(teampic);
    setTeamPick(0);
  }

  function radioUnderPick(teampic) {
    setMatchPick(teampic);
    setTeamPick(1);
  }

  async function updateBetHashes() {
    setSubcontracts({});
    setBetHistory([{}]);
    const userAccount = await bettingContract.userStruct(account);
    const count = Number(userAccount.counter);
    let _lastBetHash = (
      Object.values(await bettingContract.showUserBetData()) || []
    ).slice(0, count);
    for (const betHash of _lastBetHash) {
      if (
        betHash !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
        await addBetRecord(betHash);
    }
  }

  async function findValues() {
    let _betData = (await bettingContract.showBetData()) || [];
    setBetData(_betData);

    let us = await bettingContract.userStruct(account);
    let _betNumber = us ? us.counter.toString() : "0";
    setBetNumber(_betNumber);

    let _userBalance = us ? us.userBalance.toString() : "0";
    setUserBalance(_userBalance);

    let _unusedCapital = (await bettingContract.margin(0)) || "0";
    setUnusedCapital(_unusedCapital);

    // let _oddsvector = unpack64("7253652274872844843");
    // setOddsVector(_oddsvector);

    let _startTimes = (await bettingContract.showStartTime()) || [];
    setStartTime(_startTimes);

    let _oddsvector = (await bettingContract.showOdds()) || [];
    setOddsVector(_oddsvector);

    // console.log(oddsVector, "odds0");

    // let _eoaBalance = (await (account).getBalance())|| "0";
    // setEoaBalance(_eoaBalance);
    // // console.log(`eoabal ${eoaBalance}`);

    let _usedCapital = (await bettingContract.margin(1)) || "0";
    setUsedCapital(_usedCapital);

    let _currW4 = Number((await bettingContract.params(0)) || "0");
    setCurrW4(_currW4);

    let _concentrationLimit = await bettingContract.params(1);
    setConcentrationLimit(_concentrationLimit);

    // let _newBets = Number(await bettingContract.margin(7)) != 2000000000;
    // setNewBets(_newBets);

    let sctring = await oracleContract.showSchedString();
    setScheduleString(sctring);
  }

  function getMaxSize(unused0, used0, climit0, long0) {
    let unused = Number(unused0);
    let used = Number(used0);
    let climit = Number(climit0);
    let long = Number(long0);
    let maxSize = (unused + used) / climit - long;
    let maxSize2 = unused;
    if (maxSize2 < maxSize) {
      maxSize = maxSize2;
    }
    return maxSize;
  }

  // function unpack256(src) {
  //   if (!src) return [];
  //   //const str = bn.toString(16);
  //   const str = src.toString(16).padStart(64, "0");
  //   const pieces = str
  //     .match(/.{1,2}/g)
  //     .reverse()
  //     .join("")
  //     .match(/.{1,8}/g)
  //     .map((s) =>
  //       s
  //         .match(/.{1,2}/g)
  //         .reverse()
  //         .join("")
  //     );
  //   const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
  //   return ints;
  // }

  function unpack256(src) {
    if (!src) return [];
    //const str = bn.toString(16);
    const str = src.toString(16).padStart(64, "0");
    const pieces = str
      .toString(16)
      .match(/.{1,16}/g)
      .reverse();
    const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
    return ints;
  }

  // function unpack64(num) {
  //  let x = 7252038024299545485n;
  //   //let x = BigInt(num);
  //   let data = [];
  //   //let xx = bn.toString(x);
  //   //const outvec = [1688496681, 909]
  //   const _mask = 4294967295n; // Mask to extract lower 32 bits
  //   const _odds0 = Number(x & _mask); // Extract lower 32 bits
  //   const _startUTC = (x >> 32n) & _mask; // Shift and extract higher
  //   let startUTC = _startUTC;
  //   let odds0 = _odds0;
  //   data.push(startUTC);
  //   data.push(odds0);
  //   // console.log("startUTC and odds0 ===", startUTC, odds0);
  //   return data;
  // }

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

  let [startTimeColumn, setStartTimeColumn] = useState([
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932,
  ]);

  let [odds0, setOdds0] = useState([
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957,
  ]);

  let [odds1, setOdds1] = useState([
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957,
    957, 957,
  ]);

  let [liab0, setLiab0] = useState([
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100,
  ]);

  let [liab1, setLiab1] = useState([
    -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123,
    -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123,
    -123, -123, -123, -123, -123, -123, -123, -123,
  ]);

  let netLiab = [liab0, liab1];

  //let [xdecode, setXdecode] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  let [xdecode256, setXdecode] = useState([0, 1, 2, 3]);
  //let [xdecode64, setXdecode64] = useState([168123456, 99]);
  let time999 = 0;
  let odds999 = 0;

  useEffect(() => {
    // console.log("startTime ===", startTime[1]);
    // console.log("odds0 ===", oddsVector[1]);
    {
      for (let ii = 0; ii < 32; ii++) {
        if (betData[ii]) xdecode256 = unpack256(betData[ii]);
        if (startTime) time999 = startTime[ii];
        if (oddsVector) odds999 = oddsVector[ii];
        odds0[ii] = Number(odds999) || 0;
        odds1[ii] = Math.floor(1000000 / (Number(odds999) + 50) - 1) || 0;
        startTimeColumn[ii] = Number(time999);
        netLiab[0][ii] = (Number(xdecode256[2]) - Number(xdecode256[1])) / 10;
        netLiab[1][ii] = (Number(xdecode256[3]) - Number(xdecode256[0])) / 10;
      }
    }
    setOdds0(odds0);
    setOdds1(odds1);
    setLiab0(liab0);
    setLiab1(liab1);
    setStartTimeColumn(startTimeColumn);
    setXdecode(xdecode256);
  }, [betData]);

  let oddsTot = [odds0, odds1];
  //// console.log(`odd0 is ${oddsTot[0][1]}`)

  useEffect(() => {
    let _teamSplit = scheduleString.map((s) => (s ? s.split(":") : undefined));
    setTeamSplit(_teamSplit);
  }, [scheduleString]);

  return (
    <div>
      <VBackgroundCom />
      <Split
        page={"betpage"}
        side={
          <Box mt="30px" ml="25px" mr="30px">
            <Logo />
            <Box>
              <Flex
                mt="20px"
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
              <Flex style={{ borderTop: `thin solid ${G}` }}></Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexDirection="row"
                justifyContent="space-between"
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
                    to="/testpage"
                  >
                    Test Page
                  </Link>
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="marginLeft"
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
                addr={account}
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
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
            </Box>
            <Flex>
              <Box mt="1px" mb="1px" font="white">
                <button
                  style={{
                    backgroundColor: "black",
                    borderRadius: "5px",
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
                mt="20px"
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
              <Flex
                style={{
                  borderTop: `thin solid ${G}`,
                }}
              ></Flex>
              <Flex justifyContent="left">
                <Text size="14px" color="#ffffff">
                  Current Epoch: {currW4}
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex>
                {Object.keys(betHistory).map((id) => (
                  <div key={id} style={{ width: "100%", float: "left" }}>
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
                        {Object.values(betHistory[id]).map(
                          (event, index) =>
                            event.Epoch === currW4 && (
                              <tr key={index} style={{ width: "33%" }}>
                                <td>{teamSplit[event.MatchNum][0]}</td>
                                <td>
                                  {
                                    teamSplit[event.MatchNum][
                                      event.LongPick + 1
                                    ]
                                  }
                                </td>
                                <td>{parseFloat(event.BetSize).toFixed(3)}</td>
                                <td>
                                  {Number(
                                    event.Payoff / event.BetSize + 1
                                  ).toFixed(4)}
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
              <Flex
                style={{
                  borderTop: `thin solid ${G}`,
                }}
              ></Flex>
            </Box>
            <Box>
              <Flex>
                {Object.keys(betHistory).map((id) => (
                  <div key={id} style={{ width: "100%", float: "left" }}>
                    <Text size="14px" className="style">
                      Bets to be Redeemed: {betNumber}
                    </Text>
                    <br />
                    <Text className="style" size="14px">
                      {" "}
                      Your unclaimed winning bets
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
                          <td>Match</td>
                          <td>Pick</td>
                          <td>Your Payout</td>
                          <td>Click to Claim</td>
                        </tr>
                        {Object.values(betHistory[id]).map(
                          (event, index) =>
                            index < betNumber &&
                            subcontracts[event.Hashoutput] && (
                              <tr
                                key={index}
                                style={{ width: "33%", color: "#ffffff" }}
                              >
                                <td>{currW4}</td>
                                <td>{teamSplit[event.MatchNum][0]}</td>
                                <td>
                                  {
                                    teamSplit[event.MatchNum][
                                      event.LongPick + 1
                                    ]
                                  }
                                </td>
                                <td>
                                  {(event.Payoff + event.BetSize).toFixed(3)}
                                </td>
                                <td>
                                  <button
                                    style={{
                                      backgroundColor: "black",
                                      borderRadius: "5px",
                                      padding: "4px",
                                      //borderRadius: "1px",
                                      cursor: "pointer",
                                      color: "yellow",
                                      border: "1px solid #ffff00",
                                      // width: width ? width : 120,
                                      // color: "#00ff00",
                                    }}
                                    value={event.Hashoutput}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      redeemBet();
                                    }}
                                  >
                                    Redeem
                                  </button>
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
              <Flex
                style={{
                  borderTop: `thin solid ${G}`,
                }}
              ></Flex>
            </Box>
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box>
                <Form
                  onChange={setWdAmount}
                  value={wdAmount}
                  onSubmit={withdrawBettor}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  color="yellow"
                  inputWidth="100px"
                  borderRadius="1px"
                  placeholder="# avax"
                  buttonLabel="WithDraw"
                  padding="4px"
                />
              </Box>

              <Box mt="10px" mb="10px" ml="80px" mr="80px"></Box>
            </Flex>
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box>
                <Form
                  onChange={setFundAmount}
                  value={fundAmount}
                  onSubmit={fundBettor}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  borderRadius="1px"
                  placeholder="# avax"
                  //backgroundColor = "#fff"
                  buttonLabel="Fund"
                />
              </Box>
            </Flex>
          </Box>
        }
      >
        <Flex justifyContent="center">
          <Text size="25px" className="style">
            Place Bets Here
          </Text>
        </Flex>
        <Box mt="14px" mx="30px">
          <Flex width="100%" justifyContent="marginLeft">
            <Text size="14px" weight="300" className="style">
              {" "}
              Toggle radio button on the team/player you want to bet on to win.
              Enter desired avax bet in the box (eg, 1.123). Prior wins, tie, or
              cancelled bets are redeemable on the left panel. This sends avax
              directly to your avax address. Scroll down to see all of the
              week's contests.
            </Text>
          </Flex>
        </Box>

        <Box mt="14px" mx="30px"></Box>

        <Flex
          mt="10px"
          pt="10px"
          alignItems="center"
          style={{
            borderTop: `thin solid ${G}`,
          }}
        ></Flex>
        {teamPick != null ? (
          <Flex
            mt="5px"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
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
              marginLeft="10px"
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
                  marginLeft: "5px",
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
            flexDirection="row"
            justifyContent="space-between"
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
              pick: {teamSplit[matchPick][teamPick + 1]}
              {"  "}
              Odds:{" "}
              {((0.95 * oddsTot[teamPick][matchPick]) / 1000 + 1).toFixed(3)}
              {" (MoneyLine "}
              {getMoneyLine(0.95 * oddsTot[teamPick][matchPick])}
              {"),  "}
              MaxBet:{" "}
              {parseFloat(
                getMaxSize(
                  unusedCapital,
                  usedCapital,
                  concentrationLimit,
                  netLiab[teamPick][matchPick]
                ) / 1e3
              ).toFixed(2)}
              {"  "}
              opponent: {teamSplit[matchPick][2 - teamPick]}
              {"  "}
              Odds:{" "}
              {((0.95 * oddsTot[1 - teamPick][matchPick]) / 1000 + 1).toFixed(
                3
              )}
              {"  "}
              MoneyLine: {getMoneyLine(0.95 * oddsTot[1 - teamPick][matchPick])}
            </Text>
          ) : null}
        </Flex>

        <Box>
          <Flex
            mt="20px"
            flexDirection="row"
            justifyContent="space-between"
          ></Flex>
        </Box>
        <div>
          <Box>
            {" "}
            <Flex>
              <TeamTable
                teamSplit={teamSplit}
                startTimeColumn={startTimeColumn}
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
