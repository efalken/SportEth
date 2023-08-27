import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G } from "../basics/Colors";
import Form from "../basics/Form";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import { useAuthContext } from "../../contexts/AuthContext";
import TeamTable from "../blocks/TeamTable2";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

function OraclePage() {
  const { oracleContract, bettingContract, tokenContract, account } =
    useAuthContext();

  document.title = "Oracle Page";
  //
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [outcomes, setOutcomes] = useState([]);
  const [voteNo, setVoteNo] = useState(0);
  const [voteYes, setVoteYes] = useState(0);

  const [propNumber, setPropNumber] = useState(0);
  const [reviewStatus, setReviewStatus] = useState(0);
  const [currW4, setCurrW4] = useState(0);
  const [concentrationLimit, setConcentrationLimit] = useState(0);
  const [minSubmit, setMinSubmit] = useState(0);
  const [pause0, setPause0] = useState(0);
  const [pause1, setPause1] = useState(0);
  const [oddsVector, setOddsVector] = useState([]);
  const [proposer, setProposer] = useState("0x123");
  const [startTime, setStartTime] = useState([]);
  const [teamSplit, setTeamSplit] = useState([]);

  const [eoaTokens, setEoaTokens] = useState(0);
  const [baseEpoch, setBaseEpoch] = useState(0);
  const [voteTracker, setVoteTracker] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [initFeePool, setInitFeePool] = useState(0);
  const [feeData0, setFeeData0] = useState(0);
  const [feeData1, setFeeData1] = useState(0);
  const [tokenRewardsLeft, setTokenRewardsLeft] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [txnHash, setHash] = useState();

  useEffect(() => {
    if (!bettingContract || !oracleContract) return;
    const interval1 = setInterval(() => {
      findValues();
    }, 1000);
    return () => {
      clearInterval(interval1);
    };
  }, [bettingContract, oracleContract]);

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

  let odds999 = 0;
  let oddsTot = [odds0, odds1];

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (oddsVector) odds999 = Number(oddsVector[ii]);
      odds0[ii] = odds999 || 0;
      odds1[ii] = Math.floor(1000000 / (odds999 + 45) - 45) || 0;
    }
    setOdds0(odds0);
    setOdds1(odds1);
  }, [oddsVector]);

  useEffect(() => {
    let _teamSplit = scheduleString.map((s) => (s ? s.split(":") : undefined));
    setTeamSplit(_teamSplit);
  }, [scheduleString]);

  async function voteNofn() {
    console.log(voteNo, "voteNo");
    const stackId = await oracleContract.vote(false);
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
            href={`https://testnet.snowtrace.io/tx/${stackId.hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href="javascript:void(0)"
          >
            click here to dismiss
          </a>
        </div>
      </div>
    );
  }

  async function voteYesfn() {
    const stackId = await oracleContract.vote(true);
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
            href={`https://testnet.snowtrace.io/tx/${stackId.hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href="javascript:void(0)"
          >
            click here to dismiss
          </a>
        </div>
      </div>
    );
  }

  async function processVote() {
    const stackId = await oracleContract.processVote();
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
            href={`https://testnet.snowtrace.io/tx/${stackId.hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href="javascript:void(0)"
          >
            click here to dismiss
          </a>
        </div>
      </div>
    );
  }

  async function depositTokens() {
    const stackId = await oracleContract.depositTokens(depositAmount);
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
            href={`https://testnet.snowtrace.io/tx/${stackId.hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href="javascript:void(0)"
          >
            click here to dismiss
          </a>
        </div>
      </div>
    );
  }

  async function withdrawTokens() {
    const stackId = await oracleContract.withdrawTokens(withdrawAmount);
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
            href={`https://testnet.snowtrace.io/tx/${stackId.hash}`}
          >
            click here to txn on the blockchain
          </a>
        </div>
        <Text style={{ color: "white", fontSize: "14px" }}>or</Text>
        <div onClick={() => setHash(null)}>
          <a
            style={{
              color: "yellow",
              font: "Arial",
              fontStyle: "Italic",
              fontSize: "14px",
            }}
            href="javascript:void(0)"
          >
            click here to dismiss
          </a>
        </div>
      </div>
    );
  }

  async function findValues() {
    let _yesVotes = Number(await oracleContract.votes(0)) || 0;
    setVoteYes(_yesVotes);

    let _noVotes = Number(await oracleContract.votes(1)) || 0;
    setVoteNo(_noVotes);

    let _propNumber = Number(await oracleContract.propNumber()) || 0;
    setPropNumber(_propNumber);

    let _reviewStatus = Number(await oracleContract.reviewStatus()) || 0;
    setReviewStatus(_reviewStatus);

    let _startTimes = (await oracleContract.showPropStartTimes()) || [];
    setStartTime(_startTimes);

    let _oddsvector = (await oracleContract.showPropOdds()) || [];
    setOddsVector(_oddsvector);

    let _outcomes = (await oracleContract.showPropResults()) || [];
    setOutcomes(_outcomes);

    let _currW4 = Number((await bettingContract.params(0)) || 0);
    setCurrW4(_currW4);

    let _concentrationLimit = Number((await bettingContract.params(1)) || 0);
    setConcentrationLimit(_concentrationLimit);

    let _pause0 = Number((await bettingContract.paused(0)) || 0);
    setPause0(_pause0);

    let _pause1 = Number((await bettingContract.paused(1)) || 0);
    setPause1(_pause1);

    let _minSubmit = Number((await oracleContract.minSubmit()) || []);
    setMinSubmit(_minSubmit);

    let _feeData1 = Number(await oracleContract.feeData(1)) || 0;
    setFeeData1(_feeData1);

    let _feeData0 = Number(await oracleContract.feeData(0)) || 0;
    setFeeData0(_feeData0);

    let _proposer = (await oracleContract.proposer()) || "0x123";
    setProposer(_proposer);

    let oc = await oracleContract.adminStruct(account);
    let _voteTracker = oc ? Number(oc.voteTracker) : 0;
    setVoteTracker(_voteTracker);
    let _tokens = oc ? Number(oc.tokens) : 0;
    setTokens(_tokens);
    let _baseEpoch = oc ? Number(oc.baseEpoch) : 0;
    setBaseEpoch(_baseEpoch);
    let _totalVotes = oc ? Number(oc.totalVotes) : 0;
    setTotalVotes(_totalVotes);
    let _initFeePool = oc ? Number(oc.initFeePool) : 0;
    setInitFeePool(_initFeePool);

    let _eoaTokens = Number((await tokenContract.balanceOf(account)) || 0);
    setEoaTokens(_eoaTokens);

    let _tokenRewardsLeft = Number(
      (await oracleContract.rewardTokensLeft()) || 0
    );
    setTokenRewardsLeft(_tokenRewardsLeft);

    let sctring = await oracleContract.showSchedString();
    setScheduleString(sctring);
  }

  function getMoneyLine(decOddsi) {
    let moneyline = 1;
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

  function ethToClaim() {
    let coeff = 0;
    if (currW4 > baseEpoch) {
      coeff = totalVotes / 2 / (currW4 - baseEpoch);
    }
    if (coeff > tokens) {
      coeff = tokens;
    }
    let x = (feeData1 - initFeePool) / 1000000;
    coeff = (coeff * x) / 100000000;
    // coeff = totalVotes;
    console.log(coeff, "coeff");
    return coeff;
  }

  console.log(reviewStatus, "reviewStatus");
  console.log(feeData1, "feeData1");
  /*
console.log(currW4, "currEpoch");
console.log(baseEpoch, "baseepoch");
console.log(tokens, "tokens");
console.log(totalVotes, "totvotes");
console.log(reviewStatus, "reviewStatus");
  console.log(propNumber, "propNumber");
  console.log(voteTracker, "voteTracker");
  console.log(feeData1, "feeData1");
  console.log(initFeePool, "initFeePool");
*/

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

  function getOutcome(outcomei) {
    let outx = "lose";
    let outnum = Number(outcomei);
    if (outnum === 1) {
      outx = "win";
    } else if (outnum === 2) {
      outx = "tie";
    }
    return outx;
  }

  function reviewStatusWord(revStatusi) {
    let statusWord = "na";
    if (revStatusi === 0) {
      statusWord = "init";
    } else if (revStatusi === 10) {
      statusWord = "process Initial";
    } else if (revStatusi === 20) {
      statusWord = "process update";
    } else if (revStatusi === 30) {
      statusWord = "process Settle";
    } else if (revStatusi === 2) {
      statusWord = "waiting for update or settlement post";
    }
    return statusWord;
  }

  function needToVote() {
    let needtovote = true;
    if (
      Number(voteTracker) === Number(propNumber) ||
      Number(tokens) === 0 ||
      reviewStatus < 9
    ) {
      needtovote = false;
    }
    return needtovote;
  }

  function needToProcess() {
    let needtovote = true;
    if (reviewStatus < 9) {
      needtovote = false;
    }
    return needtovote;
  }

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
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="marginLeft"
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
              <Box>
                <Form
                  onChange={setDepositAmount}
                  value={depositAmount}
                  onSubmit={depositTokens}
                  mb="20px"
                  justifyContent="flex-start"
                  padding="4px"
                  placeholder="# oracle tokens"
                  buttonLabel="Deposit"
                  buttonWidth="70px"
                />
              </Box>
              <Box>
                <Form
                  onChange={setWithdrawAmount}
                  value={withdrawAmount}
                  onSubmit={withdrawTokens}
                  mb="20px"
                  justifyContent="flex-start"
                  padding="4px"
                  placeholder="# oracle tokens"
                  buttonLabel="WithDraw"
                  buttonWidth="70px"
                />
              </Box>

              <Flex justifyContent="left">
                <Box mb="10px" mt="10px">
                  <Text size="14px" color="#ffffff">
                    Active Epoch: {currW4}
                  </Text>
                  <br />
                  <Text size="14px" className="style">
                    Your Tokens in Contract: {Number(tokens).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
              <Flex justifyContent="left">
                {tokens > 0 ? (
                  <Box>
                    <Text size="14px" className="style">
                      base Epoch: {baseEpoch}
                    </Text>
                    <br />
                    <Text size="14px" className="style">
                      Your Voting %:{" "}
                      {Number(
                        (Number(totalVotes) * 100) / (currW4 - baseEpoch)
                      ).toFixed(0) + " %"}
                    </Text>
                    <br />
                    <Text size="14px" className="style">
                      Avax Value of your tokens:{" "}
                      {Number(ethToClaim()).toLocaleString()}
                    </Text>
                  </Box>
                ) : null}
              </Flex>
              <Flex
                mt="10px"
                flexDirection="row"
                justifyContent="space-between"
              ></Flex>
            </Box>
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {needToVote() ? (
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
                      voteNofn();
                    }}
                  >
                    Vote No
                  </button>
                  <Text>" "</Text>
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
                      voteYesfn();
                    }}
                  >
                    Vote Yes
                  </button>
                  <Box mb="10px" mt="10px">
                    <Text size="14px" className="style">
                      No Votes: {Number(voteNo).toLocaleString()} Yes Votes:{" "}
                      {Number(voteYes).toLocaleString()}
                    </Text>
                  </Box>
                  <Box mb="10px" mt="10px">
                    <Text size="14px" className="style">
                      Proposer:
                      <TruncatedAddress
                        addr={proposer}
                        start="8"
                        end="0"
                        transform="uppercase"
                        spacing="1px"
                      />
                    </Text>
                  </Box>
                </Box>
              ) : (
                <Text size="14px" className="style">
                  {" "}
                </Text>
              )}
            </Flex>
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {needToProcess() ? (
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
                      processVote();
                    }}
                  >
                    Process Vote
                  </button>
                </Box>
              ) : (
                <Text size="14px" className="style">
                  {" "}
                </Text>
              )}
            </Flex>
            <Box mb="10px" mt="10px">
              <Text size="14px" className="style">
                ConcentrationLimit: {concentrationLimit}
              </Text>{" "}
              <br />
              <Text size="14px" className="style">
                minSubmit: {Math.floor(minSubmit / 1e7).toFixed(1) + "%"}
              </Text>
              <br />
              <Text size="14px" className="style">
                Paused Matches: {pause0}; {pause1}
              </Text>
              <br />
              <Text size="14px" className="style">
                current Submission #: {propNumber}
              </Text>
              <br />
              <Text size="14px" className="style">
                Last Proposal Vote: {voteTracker}
              </Text>
              <br />
              <Text size="14px" className="style">
                Tokens in EOA: {Number(eoaTokens).toLocaleString()}
              </Text>
            </Box>
          </Box>
        }
      >
        <Flex justifyContent="center">
          <Text size="25px" className="style">
            Oracle/Admin Page{" "}
          </Text>
        </Flex>
        <Box> {txnHash}</Box>
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
        <Box mb="10px" mt="10px">
          <Text size="14px" className="style">
            ReviewStatus: {reviewStatusWord(reviewStatus)}
            <br />
            {reviewStatus}
          </Text>
        </Box>

        <Box>
          {" "}
          <Flex
            mt="20px"
            flexDirection="row"
            justifyContent="space-between"
          ></Flex>
        </Box>

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
                startTimeColumn={startTime}
                showDecimalOdds={showDecimalOdds}
                oddsTot={oddsTot}
                getMoneyLine={getMoneyLine}
                outcomev={outcomes}
                getOutcome={getOutcome}
                revStatus={reviewStatus}
              />
            </Flex>{" "}
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default OraclePage;
