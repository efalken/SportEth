import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import Form from "../basics/Form";
import { G, cblack } from "../basics/Colors";
import Input from "../basics/Input";
import Button from "../basics/Button";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import { ethers } from "ethers";
import { useAuthContext } from "../../contexts/AuthContext";
import { networkConfig } from "../../config";
import TeamTable from "../blocks/TeamTable2";
import { Link } from "react-router-dom";

function TestPage() {
  const {
    oracleContract,
    bettingContract,
    tokenContract,
    provider,
    signer,
    setSigner,
    account,
  } = useAuthContext();

  const [betAmount, setBetAmount] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [teamPick, setTeamPick] = useState(null);
  const [matchPick, setMatchPick] = useState(null);
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [viewedTxs, setViewedTxs] = useState(0);
  const [betHistory, setBetHistory] = useState([]);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [outcomes, setOutcomes] = useState([]);
  const [tokenEoaBalance, setTokenEoaBalance] = useState("0");
  const [lpEpochReward, setLpEpochReward] = useState("0");
  const [voteNo, setVoteNo] = useState("0");
  const [voteYes, setVoteYes] = useState("0");
  const [voteTracker, setVoteTracker] = useState("0");
  const [propNumber, setPropNumber] = useState("0");
  const [reviewStatus, setReviewStatus] = useState("0");
  const [betData, setBetData] = useState([]);
  const [userBalance, setUserBalance] = useState("0");
  const [unusedCapital, setUnusedCapital] = useState("0");
  const [usedCapital, setUsedCapital] = useState("0");
  const [currW4, setCurrW4] = useState("0");
  const [concentrationLimit, setConcentrationLimit] = useState("0");
  const [oddsVector, setOddsVector] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [teamSplit, setTeamSplit] = useState([]);

  useEffect(() => {
    if (!bettingContract || !oracleContract) return;

    document.title = "Test Page";
    const interval1 = setInterval(() => {
      findValues();
    }, 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [bettingContract, oracleContract]);

  async function checkRedeem(hashInput0) {
    await bettingContract.redeem(hashInput0);
  }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

  async function vote() {
    await oracleContract.vote();
  }

  function openEtherscan(txhash) {
    const url = `${
      networkConfig.blockExplorerUrls ? networkConfig.blockExplorerUrls[0] : ""
    }tx/${txhash}`;
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

  useEffect(() => {
    if (!bettingContract || !account || !provider) return;
  }, [bettingContract, account]);

  async function findValues() {
    let _betData = (await bettingContract.showBetData()) || [];
    setBetData(_betData);
    console.log(betData, "betData");

    let us = await bettingContract.userStruct(account);
    let _userBalance = us ? us.userBalance.toString() : "0";
    setUserBalance(_userBalance);

    let _yesVotes = Number(await oracleContract.votes(0)) || "0";
    setVoteYes(_yesVotes);

    let _noVotes = Number(await oracleContract.votes(1)) || "0";
    setVoteNo(_noVotes);

    let _propNumber = Number(await oracleContract.propNumber()) || "0";
    setPropNumber(_propNumber);

    let _reviewStatus = Number(await oracleContract.reviewStatus()) || "0";
    setReviewStatus(_reviewStatus);

    let _startTimes = (await oracleContract.showPropStartTimes()) || [];
    setStartTime(_startTimes);

    let _oddsvector = (await oracleContract.showPropOdds()) || [];
    setOddsVector(_oddsvector);

    let _tokenEoaBalance = (await tokenContract.balanceOf(account)) || "0";
    setTokenEoaBalance(_tokenEoaBalance);

    let _outcomes = (await oracleContract.showResults()) || [];
    setOutcomes(_outcomes);

    // let _lastBetHash = (await bettingContract.showUserBetData()) || [];
    // setLastBetHash(_lastBetHash);

    let _currW4 = Number((await bettingContract.params(0)) || "0");
    setCurrW4(_currW4);

    let _concentrationLimit = Number((await bettingContract.params(1)) || "0");
    setConcentrationLimit(_concentrationLimit);

    let oc = await oracleContract.adminStruct(account);
    let _lpEpochReward = oc ? oc.baseEpoch.toString() : "0";
    setLpEpochReward(_lpEpochReward);

    // let _lastBetHash = us ? us.lastTransaction.toString() : "0";
    // setLastBetHash(_lastBetHash);

    let _voteTracker = oc ? oc.voteTracker.toString() : "0";
    setVoteTracker(_voteTracker);

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

  function getMaxSize2(netExposure) {
    let maxSize =
      (usedCapital + unusedCapital) / concentrationLimit + netExposure;
    return maxSize;
  }


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

  function getOutcome(outcomei) {
    let outx = "lose";
    if (outcomei === 1) {
      outx = "win";
    } else if (outcomei === 2) {
      outx = "tie";
    }
    return outx;
  }

  let statusWord = "na";
  function reviewStatusWord(revStatusi) {
    statusWord = "na";
    if (revStatusi === 0) {
      statusWord = "init";
    } else if (revStatusi === 10) {
      statusWord = "process Initial";
    } else if (revStatusi === 20) {
      statusWord = "process update";
    } else if (revStatusi === 30) {
      statusWord = "process Settle";
    } else if (revStatusi === 2) {
      statusWord = "waiting for update or settlement";
    }
    return statusWord;
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
  let [outcomev, setOutcomev] = useState([
    0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]);

  let netLiab = [liab0, liab1];

  let [xdecode256, setXdecode] = useState([0, 1, 2, 3]);
  let time999 = 0;
  let odds999 = 0;


  useEffect(() => {
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
  setOdds0(odds0);
  setOdds1(odds1);
  setLiab0(liab0);
  setLiab1(liab1);
  setStartTimeColumn(startTimeColumn);
  setXdecode(xdecode256);
}, [betData]);


  let oddsTot = [odds0, odds1];

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
            {/* <Box>
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
                    to="/bigbetpage"
                  >
                    Big Bet Page
                  </Link>
                </Text>
              </Flex>
            </Box> */}
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
                Your available capital: {Number(userBalance).toFixed(3)} AVAX
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
                  onClick={() => switchOdds()}
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
                  Active Week: {currW4}
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
                          <td>Epoch</td>
                          <td>Match</td>
                          <td>Pick</td>
                          <td>BetSize</td>
                          <td>DecOdds</td>
                        </tr>
                        {betHistory[id].map(
                          (event, index) =>
                            event.Epoch === currW4 && (
                              <tr key={index} style={{ width: "33%" }}>
                                <td>{event.Epoch}</td>
                                <td>{teamSplit[event.MatchNum][0]}</td>
                                <td>
                                  {
                                    teamSplit[event.MatchNum][
                                      event.LongPick + 1
                                    ]
                                  }
                                </td>
                                <td>{parseFloat(event.BetSize).toFixed(4)}</td>
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
            <Box></Box>
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
                <button
                  style={{
                    backgroundColor: "black",
                    borderRadius: "5px",
                    padding: "4px",
                    //borderRadius: "1px",
                    cursor: "pointer",
                    color: "yellow",
                    border: "1px solid #ffff00",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    vote();
                  }}
                >
                  Vote
                </button>
              </Box>
            </Flex>
            <Box>
              <Form
                onChange={setHashInput}
                value={hashInput}
                onSubmit={checkRedeem}
                mb="20px"
                justifyContent="flex-start"
                buttonWidth="95px"
                inputWidth="100px"
                borderRadius="1px"
                placeholder="bet ID"
                //backgroundColor = "#fff"
                buttonLabel="checkRedeem"
              />
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                No Votes: {voteNo}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                Yes Votes: {voteYes}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                initEpoch: {lpEpochReward}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                ConcentrationLimit: {concentrationLimit}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                ReviewStatus: {reviewStatusWord(reviewStatus)}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                tokenBalance: {tokenEoaBalance}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                currentSubNumber: {propNumber}
              </Text>
            </Box>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                voteTracker: {voteTracker}
              </Text>
            </Box>
          </Box>
        }
      >
        <Flex justifyContent="center">
          <Text size="25px" className="style">
            test Page{" "}
          </Text>
        </Flex>
        <Box mt="14px" mx="30px">
          <Flex width="100%" justifyContent="marginLeft">
            <Text size="14px" weight="300" className="style">
              {" "}
              shows data submitted by oracle token holder for vote
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
                getMaxSize2(netLiab[teamPick][matchPick]) / 1e3
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
                getMoneyLine={getMoneyLine}
                outcomev={outcomev}
                getOutcome={getOutcome}
              />
            </Flex>{" "}
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default TestPage;
