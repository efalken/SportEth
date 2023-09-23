import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G } from "../basics/Colors";
import Form from "../basics/Form";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import TeamTable2 from "../blocks/TeamTable2";
import { Link } from "react-router-dom";
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
import { writeContract } from "viem/actions";
import { formatEther, parseEther } from "viem";
import { defaultNetwork } from "../../config";

function OraclePage() {
  const { address } = useAccount();

  document.title = "Oracle Page";

  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [outcomes, setOutcomes] = useState([]);
  const [voteNo, setVoteNo] = useState(0);
  const [voteYes, setVoteYes] = useState(0);
  const [propNumber, setPropNumber] = useState(0);
  const [reviewStatus, setReviewStatus] = useState(0);
  const [subNumber, setSubNumber] = useState(0);
  const [currEpoch, setCurrEpoch] = useState(0);
  const [concentrationLimit, setConcentrationLimit] = useState(0);
  const [oddsVector, setOddsVector] = useState([]);
  const [proposer, setProposer] = useState("0x123");
  const [startTime, setStartTime] = useState([]);
  const [teamSplit, setTeamSplit] = useState([]);
  const [basePropNumber, setBasePropNumber] = useState(0);
  const [eoaTokens, setEoaTokens] = useState(0);
  const [baseEpoch, setBaseEpoch] = useState(0);
  const [voteTracker, setVoteTracker] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [initFeePool, setInitFeePool] = useState(0);
  const [feeData0, setTotTokens] = useState(0);
  const [feeData1, setTokRevTracker] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [txnHash, setHash] = useState();

  useEffect(() => {
    const interval1 = setInterval(() => {
      refetchAll();
    }, 1000);
    return () => {
      clearInterval(interval1);
    };
  }, []);

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
  const [haltedColumn, setHaltedColumn] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (oddsVector) odds999 = Number(oddsVector[ii]) || 0;
      haltedColumn[ii] = oddsVector[ii] % 10 === 1 ? true : false;
      odds0[ii] = odds999 / 10;
      odds1[ii] = Math.floor(1e8 / (odds999 + 450) - 450) / 10 || 0;
    }
    setHaltedColumn(haltedColumn);
    setOdds0(odds0);
    setOdds1(odds1);
  }, [oddsVector]);

  useEffect(() => {
    let _teamSplit = scheduleString.map((s) => (s ? s.split(":") : undefined));
    setTeamSplit(_teamSplit);
  }, [scheduleString]);

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

  const { data: walletClient } = useWalletClient();

  async function votefn(voteType) {
    console.log(voteNo, "voteNo");
    const txHash = await writeContract(walletClient, {
      abi: oracleContractABI,
      address: oracleContractAddress,
      functionName: "vote",
      args: [voteType],
    });
    updateTransactionHashDialogBox(txHash);
  }

  async function processVote() {
    const txHash = await writeContract(walletClient, {
      abi: oracleContractABI,
      address: oracleContractAddress,
      functionName: "processVote",
    });
    updateTransactionHashDialogBox(txHash);
  }

  async function depositTokens() {
    console.log(depositAmount, "depoAmt");
    const txHash = await writeContract(walletClient, {
      abi: oracleContractABI,
      address: oracleContractAddress,
      functionName: "depositTokens",
      args: [depositAmount.toString()],
    });
    updateTransactionHashDialogBox(txHash);
  }

  async function withdrawTokens() {
    const txHash = await writeContract(walletClient, {
      abi: oracleContractABI,
      address: oracleContractAddress,
      functionName: "withdrawTokens",
      args: [withdrawAmount.toString()],
    });
    updateTransactionHashDialogBox(txHash);
  }

  async function approveTokens() {
    console.log(depositAmount, "approveAmt");
    const txHash = await writeContract(walletClient, {
      abi: tokenContractABI,
      address: tokenContractAddress,
      functionName: "approve",
      args: [oracleContractAddress, depositAmount.toString()],
    });
    updateTransactionHashDialogBox(txHash);
  }

  // async function withdrawTokens() {
  //   const txHash = await writeContract(walletClient, {
  //     abi: oracleContractABI,
  //     address: oracleContractAddress,
  //     functionName: "withdrawTokens",
  //     args: [withdrawAmount.toString()],
  //   });
  //   updateTransactionHashDialogBox(txHash);
  // }

  const { data, refetch: refetchAll } = useContractReads({
    contracts: [
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "votes",
        args: [0],
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "votes",
        args: [1],
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "propNumber",
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
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showPropStartTimes",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showPropOdds",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showPropResults",
      },
      {
        abi: bettingContractABI,
        address: oracleContractAddress,
        functionName: "oracleEpoch",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "concFactor",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "totalTokens",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "tokenRevTracker",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "proposer",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "adminStruct",
        args: [address],
      },
      {
        abi: tokenContractABI,
        address: tokenContractAddress,
        functionName: "balanceOf",
        args: [address],
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
      { result: _votes0 },
      { result: _votes1 },
      { result: _propNumber },
      { result: _reviewStatus },
      { result: _subNumber },
      { result: _startTimes },
      { result: _oddsvector },
      { result: _outcomes },
      { result: _oracleEpoch },
      { result: _concFactor },
      { result: _totTokens },
      { result: _tokRevTracker },
      { result: _proposer },
      { result: _adminStruct },
      { result: _balance },
      { result: _sctring },
    ] = data;

    setVoteYes(Number(_votes0) || 0);
    setVoteNo(Number(_votes1) || 0);
    setPropNumber(Number(_propNumber) || 0);
    setReviewStatus(Number(_reviewStatus) || 0);
    setSubNumber(Number(_subNumber) || 0);
    setStartTime(_startTimes || []);
    setOddsVector(_oddsvector || []);
    setOutcomes(_outcomes || []);
    setCurrEpoch(Number(_oracleEpoch) || 0);
    setConcentrationLimit(Number(_concFactor) || 0);
    setTotTokens(Number(_totTokens) || 0);
    setTokRevTracker(Number(_tokRevTracker) || 0);
    setProposer(_proposer || "0x123");
    setBasePropNumber(_adminStruct[0] || 0);
    setBaseEpoch(_adminStruct[1] || 0);
    setVoteTracker(_adminStruct[2] || 0);
    setTotalVotes(_adminStruct[3] || 0);
    setTokens(_adminStruct[4] || 0);
    setInitFeePool(Number(_adminStruct[5]) || 0);
    setEoaTokens((_balance || 0n).toString());
    setScheduleString(_sctring);
  }, [data]);

  function getMoneyLine(decOddsi) {
    if (decOddsi > 0) {
      if (decOddsi < 1000) return (-1e5 / decOddsi).toFixed(0);
      return (decOddsi / 10).toFixed(0);
    }
  }

  function ethToClaim() {
    let coeff = 0;
    if (propNumber > basePropNumber) {
      coeff = totalVotes / (propNumber - basePropNumber);
    }
    coeff = coeff > 1 ? 1 : coeff;
    let x = (tokens / 1e9) * (feeData1 - initFeePool);
    coeff = (coeff * x) / 1e5;
    return coeff;
  }
  // console.log(feeData0, "fee0");

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

  function reviewStatusWord() {
    let statusWord = "na";
    if (reviewStatus === 0) {
      statusWord = "init next";
    } else if (reviewStatus === 1) {
      statusWord = "odds next";
    } else if (reviewStatus === 2) {
      statusWord = "settlement next";
    }
    return statusWord;
  }
  console.log("subnumber", subNumber);
  function subNumberWord() {
    let status2Word = "na";
    if (subNumber === 0) {
      status2Word = "no data";
    } else if (subNumber === 1) {
      status2Word = "first data submitted";
    } else if (subNumber === 2) {
      status2Word = "second data submitted";
    }
    return status2Word;
  }

  function needToVote() {
    let needtovote = true;
    if (
      Number(voteTracker) === Number(propNumber) ||
      Number(tokens) === 0 ||
      subNumber === 0
    ) {
      needtovote = false;
    }
    return needtovote;
  }

  function Voted() {
    let voted = true;
    if (Number(voteTracker) === Number(propNumber) && Number(tokens) > 0) {
      voted = true;
    }
    return voted;
  }

  function needToProcess() {
    let needtovote = true;
    if (reviewStatus < 9) {
      needtovote = false;
    }
    return needtovote;
  }
  /* bla
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

  function Voted() {
    let voted = true;
    if (Number(voteTracker) === Number(propNumber) && Number(tokens) > 0) {
      voted = true;
    }
    return voted;
  }

  function needToProcess() {
    let needtovote = true;
    if (reviewStatus < 9) {
      needtovote = false;
    }
     needtovote = false;
    return needtovote;
  }
  */
  return (
    <div>
      <VBackgroundCom />
      <Split
        page={"oraclepage"}
        side={
          <Box mt="30px" ml="25px" mr="30px">
            <Logo />
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
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
              <Box>
                <Form
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  value={depositAmount}
                  onSubmit={depositTokens}
                  mb="20px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="# oracle tokens"
                  buttonLabel="Deposit"
                  buttonWidth="70px"
                />
              </Box>
              <Box>
                <Form
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  value={depositAmount}
                  onSubmit={approveTokens}
                  mb="20px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="# oracle tokens"
                  buttonLabel="Approve"
                  buttonWidth="70px"
                />
              </Box>
              <Box>
                <Form
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  value={withdrawAmount}
                  onSubmit={withdrawTokens}
                  mb="20px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="# oracle tokens"
                  buttonLabel="WithDraw"
                  buttonWidth="70px"
                />
              </Box>

              <Flex justifycontent="left">
                <Box mb="10px" mt="10px">
                  <Text size="14px" color="#ffffff">
                    Active Epoch: {currEpoch}
                  </Text>
                  <br />
                  <Text size="14px" className="style">
                    Your Tokens in Contract:{" "}
                    {Number(tokens / 1000).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
              <Flex justifycontent="left">
                {tokens > 0 ? (
                  <Box>
                    {Number(voteTracker) === Number(propNumber) ? (
                      <Text size="14px" className="style" color="#0fff00">
                        you voted!
                        <br />
                      </Text>
                    ) : null}
                    <Text size="14px" className="style">
                      your base Epoch: {baseEpoch}
                    </Text>
                    <br />
                    <Text size="14px" className="style">
                      Your Voting %:{" "}
                      {Number(
                        (Number(totalVotes) * 100) /
                          (propNumber - basePropNumber)
                      ).toFixed(0) + " %"}
                    </Text>
                    <br />
                    <Text size="14px" className="style">
                      Avax Value of your tokens: {ethToClaim().toFixed(3)}
                    </Text>
                  </Box>
                ) : null}
              </Flex>
              <Flex
                mt="10px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
            </Box>
            <Flex
              mt="5px"
              flexdirection="row"
              justifycontent="flex-start"
              alignitems="center"
            >
              {needToVote() ? (
                <Box>
                  <button
                    style={{
                      backgroundColor: "black",
                      borderradius: "5px",
                      padding: "4px",
                      //borderradius: "1px",
                      cursor: "pointer",
                      color: "yellow",
                      border: "1px solid #ffff00",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      votefn(false);
                    }}
                  >
                    Vote No
                  </button>
                  <Text>" "</Text>
                  <button
                    style={{
                      backgroundColor: "black",
                      borderradius: "5px",
                      padding: "4px",
                      //borderradius: "1px",
                      cursor: "pointer",
                      color: "yellow",
                      border: "1px solid #ffff00",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      votefn(true);
                    }}
                  >
                    Vote Yes
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
                last submitter:
                <TruncatedAddress
                  addr={proposer}
                  start="8"
                  end="0"
                  transform="uppercase"
                  spacing="1px"
                />
              </Text>
              <Text size="14px" className="style">
                ConcentrationLimit: {concentrationLimit}
              </Text>{" "}
              <br />
              <Text size="14px" className="style">
                current Submission Number: {propNumber}
              </Text>
              <br />
              <Text size="14px" className="style">
                Your last Proposal Vote: {voteTracker}
              </Text>
              <br />
              <Text size="14px" className="style">
                Tokens in EOA: {Number(eoaTokens / 1000).toLocaleString()}
              </Text>
            </Box>
          </Box>
        }
      >
        <Flex justifycontent="center">
          <Text size="25px" className="style">
            Oracle/Admin Page{" "}
          </Text>
        </Flex>
        <Box> {txnHash}</Box>

        <Box mt="14px" mx="30px"></Box>

        <Flex
          mt="10px"
          pt="10px"
          alignitems="center"
          style={{
            borderTop: `thin solid ${G}`,
          }}
        ></Flex>
        <Box mb="10px" mt="10px">
          {subNumber == 0 ? (
            <Text size="14px" className="style">
              {reviewStatusWord()}
            </Text>
          ) : (
            <Text size="14px" className="style" color="#00ff00">
              Submission Status: {subNumberWord()} submissions
              <br />
              <Text size="14px" className="style">
                No Votes: {Number(voteNo).toLocaleString()} Yes Votes:{" "}
                {Number(voteYes).toLocaleString()}
              </Text>
              <Box>
                <button
                  style={{
                    backgroundColor: "black",
                    borderradius: "5px",
                    padding: "4px",
                    //borderradius: "1px",
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
            </Text>
          )}
        </Box>

        <Box>
          {" "}
          <Flex
            mt="20px"
            flexdirection="row"
            justifycontent="space-between"
          ></Flex>
        </Box>

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
              <TeamTable2
                teamSplit={teamSplit}
                startTimeColumn={startTime}
                showDecimalOdds={showDecimalOdds}
                oddsTot={oddsTot}
                getMoneyLine={getMoneyLine}
                outcomev={outcomes}
                getOutcome={getOutcome}
                subNumber={subNumber}
                reviewStatus={reviewStatus}
              />
            </Flex>{" "}
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default OraclePage;
