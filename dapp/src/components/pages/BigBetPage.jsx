import React, { useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import Form from "../basics/Form";
import { G } from "../basics/Colors";
import Triangle from "../basics/Triangle";
import Input from "../basics/Input";
import Button from "../basics/Button";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import { useAuthContext } from "../../contexts/AuthContext";
import { ethers } from "ethers";
import TeamTable from "../blocks/TeamTable";
import { Link } from "react-router-dom";

export default function BigBetPage() {
  const {
    oracleContract,
    bettingContract,
    provider,
    signer,
    setSigner,
    account,
  } = useAuthContext();

  const [userOffers, setUserOffers] = useState([]);
  const [currentOffers, setCurrentOffers] = useState([]);
  const [contractID, setContractID] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [teamPick, setTeamPick] = useState(null);
  const [matchPick, setMatchPick] = useState(null);
  const [teamTake, setTeamTake] = useState(false);
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [betSize, setBetSize] = useState(false);
  const [decOddsOffered, setDecOddsOffered] = useState(0);
  const [fundAmount, setFundAmount] = useState(0);
  const [wdAmount, setWdAmount] = useState("");
  const [bigBets, setBigBets] = useState([]);
  const [bigBetsSet, setBigBetsSet] = useState(false);
  const [decTransform1, setDecTransform1] = useState("");
  const [currW, setCurrW] = useState("");
  const [subcontracts, setSubcontracts] = useState({});
  const [subcontracts2, setSubcontracts2] = useState({});
 // const [newBets, setNewBets] = useState(false);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [teamSplit, setTeamSplit] = useState([]);
  const [betData, setBetData] = useState([]);
  // const [offstring, setOffstring] = useState("");
  const [userBalance, setUserBalance] = useState("0");

  useEffect(() => {
    let _teamSplit = scheduleString.map((s) => (s ? s.split(":") : undefined));
    setTeamSplit(_teamSplit);
  }, [scheduleString]);

  useEffect(() => {
    if (!bettingContract || !oracleContract) return;

    findValues();
    document.title = "Big Bets";
    getUserActiveOffers();
    getCurrentOffers();
    const interval1 = setInterval(() => {
      findValues();
      getCurrentOffers();
    }, 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [bettingContract, oracleContract, currW]);

  // async function takeBet() {
  //   await bettingContract.bet(6, 0, 200);
  // }

  async function killBet(x) {
    await bettingContract.cancelBigBet(x);
  }

  async function fundBettor(x) {
    await bettingContract.fundBettor({
      value: ethers.parseEther(fundAmount),
    });
  }

  async function withdrawBettor(x) {
    await bettingContract.withdrawBettor(wdAmount * 10000);
  }

  // async function offerContracts(x) {
  //   await bettingContract.offerContracts(x);
  // }

  function switchOdds() {
    setShowDecimalOdds(!showDecimalOdds);
  }

  async function makeBigBet() {
    await bettingContract.postBigBet(
      matchPick,
      teamPick,
      Math.round(betAmount * 10000),
      Math.round(decOddsOffered * 1000)
    );
  }

  async function takeBigBet() {
    await bettingContract.takeBigBet(contractID);
  }

  async function getUserActiveOffers() {
    const eventdata = [];
    const _subcontracts = {};

    const BetRecordEvent = bettingContract.filters.OfferRecord(account);
    const events = await bettingContract.queryFilter(BetRecordEvent);

    // TODO: Fix below
    for (const event of events) {
      //   const {args, blockNumber} = event;
      const {
        args: {
          bettor,
          epoch,
          matchNum,
          pick,
          betAmount,
          payoff,
          contractHash,
        },
        blockNumber,
      } = event;

      // const block = await provider.getBlock(blockNumber);

      eventdata.push({
        Hashoutput: contractHash,
        BettorAddress: bettor,
        Epoch: Number(epoch),
        timestamp: Number(blockNumber),
        BetSize: Number(betAmount),
        MyTeamPick: Number(pick),
        MatchNum: Number(matchNum),
        Payoff: Number(payoff),
      });
      _subcontracts[contractHash] = await bettingContract.checkOffer(
        contractHash
      );
    }
    userOffers[0] = eventdata;
    setSubcontracts(_subcontracts);
    setUserOffers(userOffers);
  }

  async function getCurrentOffers() {
    const eventdata2 = [];
    const _subcontracts2 = {};
    if (!currW) return;
    const BetRecordEvent = bettingContract.filters.OfferRecord(null, currW);
    const events = await bettingContract.queryFilter(BetRecordEvent);

    for (const event of events) {
      // const {args, blockNumber} = event;
      const {
        args: {
          bettor,
          epoch,
          matchNum,
          pick,
          betAmount,
          payoff,
          contractHash,
        },
        blockNumber,
      } = event;

      //   const block = await provider.getBlock(blockNumber);

      eventdata2.push({
        Hashoutput2: contractHash,
        BettorAddress2: bettor,
        Epoch2: Number(epoch),
        MatchNum2: Number(matchNum),
        OfferedTeam2: 1 - Number(pick),
        timestamp2: Number(blockNumber),
        BetSize2: Number(betAmount),
        Payoff2: Number(payoff),
      });
      _subcontracts2[contractHash] = await bettingContract.checkOffer(
        contractHash
      );
    }
    setSubcontracts2(_subcontracts2);
    setCurrentOffers(eventdata2);
  }

  function radioFavePick(matchpic) {
    setMatchPick(matchpic);
    setTeamTake(false);
    setTeamPick(0);
  }

  function radioUnderPick(matchpic) {
    setMatchPick(matchpic);
    setTeamTake(false);
    setTeamPick(1);
  }

  function radioTeamPickTake(betamt0, hash0, odds0) {
    setTeamTake(true);
    setContractID(hash0);
    setBetAmount(betamt0);
    setDecOddsOffered(odds0);
  }

  function sortByBetSize() {
    if (betSize) {
      bigBets.sort(function (a, b) {
        return a.BigBetSize - b.BigBetSize;
      });
    } else {
      bigBets.sort(function (a, b) {
        return b.BigBetSize - a.BigBetSize;
      });
    }
    setBetSize(!betSize);
    setBigBets(bigBets);
  }

  async function findValues() {
    // weekKey = contracts["BettingMain"].methods.margin.cacheCall(3);

    let _currW = Number((await bettingContract.margin(3)) || "0");
    setCurrW(_currW);

    // userBalKey = contracts[
    //   "BettingMain"
    // ].methods.userBalance.cacheCall(account);
    let _userBalance =
      Number(
        (await bettingContract.userStruct(await signer.getAddress()).userBalance) || "0"
      ) / 10000;
    setUserBalance(_userBalance);

    // betDataKey =
    //   contracts["BettingMain"].methods.showBetData.cacheCall();
    let _betData = (await bettingContract.showBetData()) || [];
    setBetData(_betData);

    // scheduleStringKey =
    //   contracts["OracleMain"].methods.showSchedString.cacheCall();

    // offkey = contracts["BettingMain"].methods.betContracts.cacheCall(
    //   "0xd742678f8344bbb7accc6296c8abc740f2c0508ada4c2249fa898c2877a8943c"
    // ).epoch;
    // let _offstring =
    //   (
    //     await bettingContract.betContracts(
    //       "0xd742678f8344bbb7accc6296c8abc740f2c0508ada4c2249fa898c2877a8943c"
    //     )
    //   ).epoch || "";
    // setOffstring(_offstring);

    // marginKey7 = contracts["BettingMain"].methods.margin.cacheCall(7);
    // let _newBets = Number(await bettingContract.margin(7)) != 2000000000;
    // setNewBets(_newBets);

    let sctring = await oracleContract.showSchedString();
   // if (sctring && _newBets) {
    if (sctring) {
      setScheduleString(sctring);
    }
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

  function translateMoneyLine(moneyline0) {
    let decTransform1 = 0;
    if (moneyline0 < 100) {
      decTransform1 = -(100 - moneyline0) / moneyline0;
    } else {
      decTransform1 = moneyline0 / 100 + 1;
    }
    decTransform1 = decTransform1.toFixed(2);
    setDecTransform1(decTransform1);
  }

  function unpack256(src) {
    //const str = bn.toString(16);
    const str = src.toString(16).padStart(64, "0");
    const pieces = str
      .match(/.{1,2}/g)
      .reverse()
      .join("")
      .match(/.{1,8}/g)
      .map((s) =>
        s
          .match(/.{1,2}/g)
          .reverse()
          .join("")
      );
    const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
    return ints;
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

  let [xdecode, setXdecode] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    if (betData[0]) xdecode = unpack256(betData[0]);
    if (xdecode[6] > 0) {
      for (let ii = 0; ii < 32; ii++) {
        if (betData[ii]) xdecode = unpack256(betData[ii]);
        odds0[ii] = Number(xdecode[6]);
        odds1[ii] = Number(xdecode[7]);
        startTimeColumn[ii] = xdecode[5];
        netLiab[0][ii] = (Number(xdecode[2]) - Number(xdecode[1])) / 10;
        netLiab[1][ii] = (Number(xdecode[3]) - Number(xdecode[0])) / 10;
      }
    }
    setOdds0(odds0);
    setOdds1(odds1);
    setLiab0(liab0);
    setLiab1(liab1);
    setStartTimeColumn(startTimeColumn);
    setXdecode(xdecode);
  }, [betData]);

  let oddsTot = [odds0, odds1];

  useEffect(() => {
    let _bigBets = [];

    currentOffers.forEach((bet) => {
      let bigBet = {
        teamAbbrevName: teamSplit[bet.MatchNum2][bet.OfferedTeam2 + 1],
        BigBetSize: Number(bet.Payoff2 / 10000).toFixed(3),
        BigOdds: ((0.95 * bet.Payoff2) / bet.BetSize2 + 1).toFixed(3),
        OfferHash: bet.Hashoutput2,
        OfferedEpoch: Number(bet.Epoch2),
        OfferTeamNum: Number(bet.OfferedTeam2),
        BigMatch: Number(bet.MatchNum2),
      };
      _bigBets.push(bigBet);
    });
    if (!bigBetsSet && _bigBets.length > 0) {
      setBigBets(_bigBets);
      setBigBetsSet(true);
    }
  }, [currentOffers, bigBetsSet, teamSplit]);

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setSigner(signer);
  }

  if (!signer) {
    return (
      <div>
        <button onClick={connect}>connect</button>
      </div>
    );
  }

  return (
    <div>
      <VBackgroundCom />
      <Split
        page={"bigbets"}
        side={
          <Box mt="30px" ml="25px" mr="35px">
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
              <Flex>
                <Text size="14px">
                  <Link
                    to="/bookiepage"
                    className="nav-header"
                    style={{
                      cursor: "pointer",
                      color: "#fff000",
                      fontStyle: "italic",
                    }}
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
                    }}
                    to="/betpage"
                  >
                    Straight Bet Page
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
              <Text color="#ffffff" size="14px">Connected Account Address</Text>
              <TruncatedAddress
                addr={account}
                start="8"
                end="0"
                transform="uppercase"
                spacing="1px"
              />
              <Text  color="#ffffff" size="14px">
                Your available capital: {Number(userBalance).toFixed(4)} AVAX
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
              <Box mt="1px" mb="1px">
                <button
                  style={{
                    backgroundColor: "black",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "yellow",
                    border: "1px solid #ffff00",
                    padding: "4px"
                  }}
                  onClick={() => switchOdds()}
                >
                  {showDecimalOdds ? "Switch to MoneyLine Odds" : "Switch to Decimal Odds"}
                </button>{" "}
              </Box>
            </Flex>{" "}
            <Box>
              <Flex
                style={{
                  borderTop: `thin solid ${G}`,
                }}
              ></Flex>
            </Box>
            <Flex justifyContent="left">
              <Text size="14px"  color="#ffffff">Active Week: {currW}</Text>
            </Flex>
            <br />
            <Flex>
              {Object.keys(userOffers).map((id) => (
                <div key={id} style={{ width: "100%", float: "left" }}>
                  <Text color= "#ffffff" size="14px" fontFamily="Arial"> Your Unclaimed Active Offers</Text>
                  <br />
                  <table style={{ width: "100%", fontSize: "14px",  color: "#ffffff", fontFamily:"Arial"}}>
                    <tbody>
                      <tr style={{ width: "50%", color: "#ffffff"}}>
                        <td>Week</td>
                        <td>Bet Size</td>
                        <td>Contract Hash ID</td>
                        <td>Click to Retract</td>
                      </tr>
                      {userOffers[id].map(
                        (event, index) =>
                          event.Epoch === currW &&
                          subcontracts[event.Hashoutput] && (
                            <tr key={index} style={{ width: "50%", color: "#ffffff" }}>
                              <td  color= "#ffffff">{event.Epoch}</td>
                              <td>{Number(event.BetSize).toFixed(2)}</td>

                              <td>
                                <TruncatedAddress
                                  addr={event.Hashoutput}
                                  start="8"
                                  end="0"
                                  transform="uppercase"
                                  spacing="1px"
                                />{" "}
                              </td>
                              <td>
                                <button
                                  style={{
                                    backgroundColor: "black",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    color: "yellow",
                                    border: "1px solid #fff000",
                                    padding: "4px"
                                    // border: "1px solid #ffff00"
                                  }}
                                  value={event.Hashoutput}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    killBet(event.Hashoutput);
                                  }}
                                >
                                  Cancel
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
            <Box>
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
                <Flex
                  mt="20px"
                  flexDirection="row"
                  justifyContent="space-between"
                ></Flex>
              </Box>

              <Box>
                <Form
                  onChange={setWdAmount}
                  value={wdAmount}
                  onSubmit={withdrawBettor}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  borderRadius="4px"
                  placeholder="# avax"
                  buttonLabel="WithDraw"
                  border-color= "yellow"
                 background-color= "black"
                />
              </Box>
            </Flex>
            <Flex
              mt="2px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box>
                <Form
                  onChange={setFundAmount}
                  value={fundAmount}
                  onSubmit={fundBettor}
                  mb="10px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  borderRadius="2px"
                  placeholder="# avax"
                  buttonLabel="Fund"
                />
              </Box>

              <Box mt="10px" mb="10px" ml="80px" mr="80px"></Box>
            </Flex>
            <Box>
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
                <Flex
                  mt="20px"
                  flexDirection="row"
                  justifyContent="space-between"
                ></Flex>
              </Box>
            </Flex>
            <Box>
              <Box>
                <Text  color="white" size="14px"> MoneyLine to Decimal odds converter</Text>
              </Box>

              <Flex mt="10px" mb="10px">
                <Text width="50%"  color="white" size="14px">MoneyLine: </Text>
                <Input
                  onChange={({ target: { value } }) =>
                    translateMoneyLine(value)
                  }
                  width="100px"
                  placeholder={"eg, -110 or 220"}
                  marginLeft="10px"
                  marginRight="5px"
                 // color= "#ffffff"
                />
              </Flex>
              <Flex>
                <Text width="50%"  color="white" size="14px">Decimal odds:</Text>
                <Text width="5%"></Text>
                <Text  color="white" size="14px" marginLeft="10px">     {decTransform1}</Text>
              </Flex>
            </Box>
          </Box>
        }
      >
        <Flex justifyContent="center">
          <Text size="25px" color="white">Big Bets: Offer or Take Bets too large for LPs</Text>
        </Flex>

        <Box mt="14px" mx="30px">
          <Flex width="100%" justifyContent="marginLeft">
            <Text size="14px" weight="300" color="white">
              {" "}
              Bet size must be greater than what is maximally feasible on the straight-up betting page. Toggle the match and
              team you want to bet on, and the offers, if any, will appear
              below. You can place your showLongs large bet above. Your
              unclaimed bets are on the left tab (this sends your AVAX back).
              Enter odds in decimal form, but only to two decimals (eg, 1.9123456 will be recorded as 1.91).
              These are the odds you are asking for on your winning payoff. 
            </Text>
          </Flex>
        </Box>

        {teamPick != null && !teamTake ? (
          <Flex
            mt="10px"
            pt="10px"
            alignItems="center"
            style={{
              borderTop: `thin solid ${G}`,
            }}
          >
            <Flex
              style={{
                color: "#B0B0B0",
                fontSize: "14px",
              }}
            >
              <Text size="14px" weight="400" color="white">
                Sport:{teamSplit[matchPick][0]}
                {"  "}
                pick:
                {teamSplit[matchPick][Number(teamPick) + 1]}
                {"    "}
                opponent: {teamSplit[matchPick][2 - Number(teamPick)]}
                <br></br>
                Standard Book Odds:{" "}
                {((95 * oddsTot[teamPick][matchPick]) / 100000 + 1).toFixed(3)}
                {"  (MoneyLine "}
                {getMoneyLine(0.95 * oddsTot[teamPick][matchPick])}
                {")   "}
                <br></br>
                <br></br>{" "}
              </Text>
            </Flex>
          </Flex>
        ) : null}

        <Flex>
          {teamPick != null && !teamTake ? (
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Input
                onChange={({ target: { value } }) => setBetAmount(value)}
                width="100px"
                placeholder={"# avax"}
                marginLeft="10px"
                marginRignt="5px"
                value={betAmount}
              />

              <Input
                onChange={({ target: { value } }) => setDecOddsOffered(value)}
                width="125px"
                placeholder={"DecOdds e.g. 2.97"}
                marginLeft="10px"
                marginRignt="5px"
                value={decOddsOffered}
              />
              <Box mt="10px" mb="10px">
                <Button
                  style={{
                    float: "right",
                    marginLeft: "20px",
                    border: "1px solid yellow",
                    padding: "4px"
                  }}
                  onClick={makeBigBet}
                >
                  Post Bet
                </Button>
              </Box>

              <Box mt="10px" mb="10px" ml="80px" mr="80px"></Box>
            </Flex>
          ) : null}
        </Flex>

        <Flex
          style={{
            color: "#0099ff",
            fontSize: "14px",
          }}
        >
          {teamTake === true ? (
            <Text size="14px" weight="400">
              <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
              <Box mt="10px" mb="10px" ml="40px" mr="40px">
                <Button
                  style={{
                    border: "1px solid yellow",
                  padding: "4px"
                  }}
                  onClick={() => takeBigBet()}
                >
                  Click to Take {Number(betAmount).toFixed(3)} on{" "}
                  {teamSplit[matchPick][1 + Number(teamPick)]} {"  "}
                  at odds {Number(decOddsOffered).toFixed(3)}
                  {" (MoneyLine "}
                  {getMoneyLine(Number(decOddsOffered) * 1000 - 1000)}
                  {")"}{" "}
                </Button>{" "}
              </Box>
              <Box></Box>
              <br />
              <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
            </Text>
          ) : null}
        </Flex>

        <Flex>
          {teamPick !== null ? (
            <div>
              <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
              <Text color="white" size="14px">Current Offers</Text>
              <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
              <table
                style={{
                  width: "100%",
                  fontSize: "14px",
                  tableLayout: "fixed",
                  fontFamily: "Arial",
                }}
              >
                <thead>
                  <tr style={{ width: "100%", color: "white", font: "Arial"}}>
                    <td>Take </td>
                    <td
                      onClick={() => sortByBetSize()}
                      style={{ cursor: "pointer" }}
                    >
                      Size
                      <Triangle
                        rotation={!betSize ? "180deg" : ""}
                        scale="0.8"
                        fill
                        color="white"
                      />
                    </td>
                    <td>Offered Odds</td>
                    <td>Contract hash ID</td>
                  </tr>
                </thead>
                <tbody>
                  {bigBets
                    .filter(
                      (bet) =>
                        bet.BigMatch === Number(matchPick) &&
                        bet.OfferTeamNum === Number(teamPick) &&
                        subcontracts2[bet.OfferHash]
                    )
                    .map((bet, index) => (
                      //    bet.OfferTeamNum === teamPick &&
                      <tr key={index} style={{ width: "100%", color:"white" }}>
                        <td>
                          <input
                            type="radio"
                            value={bet.OfferTeamNum}
                            name={bet.teamAbbrevName}
                            onChange={({ target: { value } }) =>
                              radioTeamPickTake(
                                bet.BigBetSize,
                                bet.OfferHash,
                                bet.BigOdds
                              )
                            }
                          />
                        </td>
                        <td>{Number(bet.BigBetSize).toFixed(3)}</td>
                        <td>{Number(bet.BigOdds).toFixed(3)}</td>

                        <td>
                          <TruncatedAddress
                            addr={bet.OfferHash}
                            start="8"
                            end="0"
                            transform="uppercase"
                            spacing="1px"
                          />{" "}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Flex>

        <Flex
          mt="10px"
          pt="10px"
          alignItems="center"
          style={{
            borderTop: `thin solid ${G}`,
          }}
        ></Flex>

        <Box>
          <Flex
            mt="20px"
            flexDirection="row"
            justifyContent="space-between"
          ></Flex>
        </Box>

        <Box>
          {" "}
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
