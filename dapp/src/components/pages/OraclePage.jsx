import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G } from "../basics/Colors";
import Form from "../basics/Form";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import TeamTableWinner from "../blocks/TeamTableWinner";
import TeamTableOdds from "../blocks/TeamTableOdds";
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
  const [reviewStatus, setReviewStatus] = useState(false);
  const [bettingActive, setBettingActive] = useState(false);
  const [subNumber, setSubNumber] = useState(0);
  const [oracleEpoch, setOracleEpoch] = useState(0);
  //const [bettingEpoch, setBettingEpoch] = useState(0);
  const [concFactor, setConcFactor] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [pOddsVector, setPOddsVector] = useState([]);
  const [oddsVector, setOddsVector] = useState([]);
  const [proposer, setProposer] = useState("0x123");
  const [startTime, setStartTime] = useState([]);
  const [teamSplit, setTeamSplit] = useState([]);
  const [basePropNumber, setBasePropNumber] = useState(0);
  const [eoaTokens, setEoaTokens] = useState(0);
  const [baseEpoch, setBaseEpoch] = useState(0);
  const [probation, setProbation] = useState(0);
  const [probation2, setProbation2] = useState(0);
  const [voteTracker, setVoteTracker] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [initFeePool, setInitFeePool] = useState(0);
  const [tokenRevTracker, setTokRevTracker] = useState(0);
  const [approveAmount, setApproveAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [changeMatch, setChangeMatch] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
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
    335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335,
    335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335,
    335, 335,
  ]);

  let [odds1, setOdds1] = useState([
    335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335,
    335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335,
    335, 335,
  ]);

  let odds999 = 0;
  let oddsTot = [odds0, odds1];

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (pOddsVector) odds999 = Number(pOddsVector[ii]) || 0;
      odds0[ii] = Math.floor(1e7 / (512 + odds999) - 10000) || 0;
      odds1[ii] = Math.floor(1e7 / (512 - odds999) - 10000) || 0;
    }
    setOdds0(odds0);
    setOdds1(odds1);
  }, [pOddsVector]);

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

  const { data: walletClient } = useWalletClient();

  async function votefn(voteType) {
    try {
      const txHash = await writeContract(walletClient, {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "vote",
        args: [voteType],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
  }

  // async function haltMach(_match) {
  //   try {
  //     const txHash = await writeContract(walletClient, {
  //       abi: oracleContractABI,
  //       address: oracleContractAddress,
  //       functionName: "haltBetting",
  //       args: [changeMatch],
  //     });
  //     updateTransactionHashDialogBox(txHash);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setChangeMatch("");
  // }

  async function adjConcFactor(_match) {
    try {
      const txHash = await writeContract(walletClient, {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "adjConcLimit",
        args: [concFactor],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setConcFactor("");
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
    let depositAmt = (Number(depositAmount) * 1000).toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "depositTokens",
        args: [depositAmt],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setDepositAmount("");
  }

  async function withdrawTokens() {
    let wdamt = (Number(withdrawAmount) * 1000).toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "withdrawTokens",
        args: [wdamt],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setWithdrawAmount("");
  }

  async function approveTokens() {
    let approveAmt = (Number(approveAmount) * 1000).toString();
    try {
      const txHash = await writeContract(walletClient, {
        abi: tokenContractABI,
        address: tokenContractAddress,
        functionName: "approve",
        args: [oracleContractAddress, approveAmt],
      });
      updateTransactionHashDialogBox(txHash);
    } catch (err) {
      console.log(err);
    }
    setApproveAmount("");
  }

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
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "bettingActive",
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
        functionName: "showprobSpreadDiv2",
      },
      {
        abi: bettingContractABI,
        address: bettingContractAddress,
        functionName: "showOdds",
      },
      {
        abi: oracleContractABI,
        address: oracleContractAddress,
        functionName: "showPropResults",
      },
      {
        abi: oracleContractABI,
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
      { result: _bettingActive },
      { result: _subNumber },
      { result: _startTimes },
      { result: _pOddsVector },
      { result: _oddsVector },
      { result: _outcomes },
      { result: _oracleEpoch },
      { result: _concFactor },
      { result: _totalTokens },
      { result: _tokRevTracker },
      { result: _proposer },
      { result: _adminStruct },
      { result: _eoaTokens },
      { result: _sctring },
    ] = data;

    setVoteYes(Number(_votes0) || 0);
    setVoteNo(Number(_votes1) || 0);
    setPropNumber(Number(_propNumber) || 0);
    setReviewStatus(_reviewStatus);
    setBettingActive(_bettingActive);
    setSubNumber(Number(_subNumber) || 0);
    setStartTime(_startTimes || []);
    setPOddsVector(_pOddsVector || []);
    setOddsVector(_oddsVector || []);
    setOutcomes(_outcomes || []);
    setOracleEpoch(Number(_oracleEpoch) || 0);
    setConcFactor(Number(_concFactor) || 0);
    setTotalTokens(Number(_totalTokens) / 1000 || 0);
    setTokRevTracker(Number(_tokRevTracker) || 0);
    setProposer(_proposer || "0x123");
    setBasePropNumber(_adminStruct[0] || 0);
    setProbation(_adminStruct[1] || 0);
    setProbation2(_adminStruct[2] || 0);
    setVoteTracker(_adminStruct[3] || 0);
    setTotalVotes(_adminStruct[4] || 0);
    setTokens(_adminStruct[5] || 0);
    setInitFeePool(Number(_adminStruct[6]) || 0);
    setEoaTokens(Number(_eoaTokens) / 1000 || 0);
    setScheduleString(_sctring);
  }, [data]);

  function getMoneyLine(decOddsi) {
    if (decOddsi > 0) {
      if (decOddsi < 1000) return (-1e5 / decOddsi).toFixed(0);
      return (decOddsi / 10).toFixed(0);
    }
  }

  function ethToClaim() {
    let avaxAP = 0;
    if (propNumber > basePropNumber) {
      avaxAP = totalVotes / (propNumber - basePropNumber);
    }
    avaxAP = avaxAP > 1 ? 1 : avaxAP;
    let x = (tokens / 1e9) * (tokenRevTracker - initFeePool);
    avaxAP = (avaxAP * x) / 1e9;
    return avaxAP;
  }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

  function subNumberWord() {
    if (subNumber > 0) {
      if (!reviewStatus) return "odds sent, voting now";
      if (reviewStatus) return "outcome/schedule sent, voting now";
    } else {
      if (!reviewStatus) return "Outcomes/Schedule posted, waiting on odds ";
      if (reviewStatus)
        return "odds sent, waiting for settlement and new schedule";
    }
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
  // let haltedV = haltedColumn.indexOf(true);

  console.log("initFeePool", initFeePool);
  console.log("tokenRevTracker", tokenRevTracker);
  // console.log("subnumber", subNumber);
  // console.log("revStatus", reviewStatus);
  // console.log("bettingActive", bettingStatus);
  // console.log("propNumber", propNumber);
  // console.log("concFactor", concFactor);
  // console.log("proposer", proposer);

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
                start="6"
                end="3"
                transform="uppercase"
                spacing="1px"
              />
              <br />
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
                mt="10px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
              <Box>
                <button
                  style={{
                    backgroundColor: "black",
                    borderradius: "5px",
                    padding: "2px",
                    cursor: "pointer",
                    color: "#ccff99",
                    border: "1px solid #ccff99",
                  }}
                >
                  {Number(tokens / 1e3).toLocaleString()}
                </button>
                <Text size="14px" className="style">
                  {"  "}
                  Account Token Balance
                </Text>
              </Box>
              <Box>
                <Form
                  onChange={(e) => setApproveAmount(e.target.value)}
                  value={approveAmount}
                  onSubmit={approveTokens}
                  mb="1px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="0.00 oracle tokens"
                  buttonLabel="Approve"
                  buttonWidth="70px"
                />
              </Box>
              <Box>
                <Form
                  onChange={(e) => setDepositAmount(e.target.value)}
                  value={depositAmount}
                  onSubmit={depositTokens}
                  mb="1px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="0.00 oracle tokens"
                  buttonLabel="Deposit"
                  buttonWidth="70px"
                />
              </Box>
              <Box>
                <Form
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  value={withdrawAmount}
                  onSubmit={withdrawTokens}
                  mb="20px"
                  justifycontent="flex-start"
                  padding="4px"
                  placeholder="0.00 oracle tokens"
                  buttonLabel="WithDraw"
                  buttonWidth="70px"
                />
              </Box>

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
                      total tokens deposited:{" "}
                      {Math.round(totalTokens).toLocaleString()}
                      <br />
                    </Text>
                    <br />
                    <Text size="14px" className="style">
                      Avax Value of your tokens: {ethToClaim().toFixed(3)}
                    </Text>
                  </Box>
                ) : null}
              </Flex>
            </Box>
            {/* <Box>
              <Form
                onChange={(e) => setChangeMatch(e.target.value)}
                value={changeMatch}
                onSubmit={haltMach}
                mb="1px"
                justifycontent="flex-start"
                padding="4px"
                placeholder="match #"
                buttonLabel="halt"
                buttonWidth="50px"
              />
            </Box> */}
            <Box>
              <Form
                onChange={(e) => setConcFactor(e.target.value)}
                value={concFactor}
                onSubmit={adjConcFactor}
                mb="1px"
                justifycontent="flex-start"
                padding="4px"
                placeholder="match #"
                buttonLabel="conc factor"
                buttonWidth="100px"
              />
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
              <Text size="16px" className="style">
                Contract state
                <br />
              </Text>
              <Text size="14px" className="style">
                last submitter:
                <TruncatedAddress
                  addr={proposer}
                  start="6"
                  end="3"
                  transform="uppercase"
                  spacing="1px"
                />
              </Text>
              <Text size="14px" className="style">
                concentration factor: {concFactor}
                <br />
                reviewStatus: {reviewStatus.toLocaleString()}
                <br />
                bettingActive: {bettingActive.toLocaleString()}
                <br />
                subNumber: {subNumber}
                <br />
                current epoch: {oracleEpoch}
                <br />
                current prop number: {propNumber}
                <br />
                <br />
              </Text>
              <Text size="16px" className="style">
                Connected account state
                <br />
              </Text>
              <Text size="14px" className="style">
                base prop number: {basePropNumber}
                <br />
                probation number: {probation}
                <br />
                probation2: {probation2}
                <br />
                last vote prop num: {voteTracker}
                <br />
                total votes: {totalVotes}
                <br />
                voting record:{" "}
                {Number(
                  (Number(totalVotes) * 100) / (propNumber - basePropNumber)
                ).toFixed(0) + " %"}
                <br />
                tokens in EOA: {Math.round(eoaTokens).toLocaleString()}
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
          <Text size="14px" className="style">
            Status: {subNumberWord()}
          </Text>
        </Box>

        {subNumber > 0 ? (
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
            <Text size="14px" className="style">
              <br />
              No Votes: {Math.floor(Number(voteNo / 1000)).toLocaleString()} Yes
              Votes: {Math.floor(Number(voteYes / 1000)).toLocaleString()}
            </Text>
          </Box>
        ) : null}

        <Box>
          {" "}
          <Flex
            mt="20px"
            flexdirection="row"
            justifycontent="space-between"
          ></Flex>
        </Box>

        <div>
          <Box>
            {!reviewStatus && subNumber > 0 ? (
              <Flex>
                <TeamTableOdds
                  teamSplit={teamSplit}
                  startTimeColumn={startTime}
                  showDecimalOdds={showDecimalOdds}
                  oddsTot={oddsTot}
                  outcomev={outcomes}
                  subNumber={subNumber}
                  reviewStatus={reviewStatus}
                />
              </Flex>
            ) : null}
            {subNumber > 0 && reviewStatus ? (
              <Flex>
                <TeamTableWinner
                  teamSplit={teamSplit}
                  startTimeColumn={startTime}
                  outcomev={outcomes}
                  subNumber={subNumber}
                  reviewStatus={reviewStatus}
                />
              </Flex>
            ) : null}
          </Box>
        </div>
      </Split>
    </div>
  );
}

export default OraclePage;
