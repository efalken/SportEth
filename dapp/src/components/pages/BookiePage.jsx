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
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

function BookiePage() {
  const { oracleContract, bettingContract, tokenContract, account } =
    useAuthContext();

  const [fundAmount, setFundAmount] = useState("");
  const [sharesToSell, setSharesToSell] = useState("");
  const [currentWeek, setCurrentWeek] = useState("");

  const [unusedCapital, setUnusedCapital] = useState(0);
  const [usedCapital, setUsedCapital] = useState(0);
  const [betCapital, setBetCapital] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [betNumber, setBetNumber] = useState(0);
  //const [newBets, setNewBets] = useState(false);
  const [betData, setBetData] = useState([]);
  const [scheduleString, setScheduleString] = useState(
    Array(32).fill("check later...: n/a: n/a")
  );
  const [bookieShares, setBookieShares] = useState("0");
  const [bookieEpoch, setBookieEpoch] = useState("0");
  const [tokenAmount, setTokenAmount] = useState("0");

  document.title = "LP Page";
  useEffect(() => {
    if (!bettingContract || !oracleContract || !tokenContract) return;

    const interval1 = setInterval(() => {
      findValues();
    }, 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [bettingContract, oracleContract, tokenContract]);

  async function wdBook() {
    await bettingContract.withdrawBook(sharesToSell);
  }

  async function fundBook() {
    try {
      await bettingContract.fundBook({
        value: ethers.parseEther(fundAmount),
      });
    } catch (err) {
      console.log(err);
    }
  }

  // async function inactivateBook() {
  //   await bettingContract.inactiveBook();
  // }

  async function findValues() {
    let _unusedCapital =
      Number((await bettingContract.margin(0)) || "0") / 10000;
    setUnusedCapital(_unusedCapital);

    let _usedCapital = Number((await bettingContract.margin(1)) || "0") / 10000;
    setUsedCapital(_usedCapital);

    let _betCapital = Number((await bettingContract.margin(2)) || "0") / 10000;
    setBetCapital(_betCapital);

    let _currentWeek = Number(await bettingContract.params(0));
    setCurrentWeek(_currentWeek);

    let _totalShares = (await bettingContract.margin(3)) || "0";
    setTotalShares(_totalShares);

    // let _newBets = Number(await bettingContract.margin(7)) != 2000000000;
    // setNewBets(_newBets);

    let _betData = (await bettingContract.showBetData()) || [];
    setBetData(_betData);

    let sctring = await oracleContract.showSchedString();
    //if (sctring && _newBets) {
    if (sctring) {
      setScheduleString(sctring);
    }

    let bs = await bettingContract.lpStruct(account);
    let _bookieShares = bs ? bs.shares.toString() : "0";
    setBookieShares(_bookieShares);

    let _bookieEpoch = bs ? bs.outEpoch.toString() : "0";
    setBookieEpoch(_bookieEpoch);

    let _tokenAmount =
      (await tokenContract.balanceOf(
        "0x23cEd89B1F6baFa4F89063D7Af51a81a38d879d6"
      )) || "0";
    setTokenAmount(_tokenAmount);
  }

  function unpack256(src) {
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

  // function getSpreadText(spreadnumber) {
  //   let outspread = spreadnumber / 10;
  //   if (outspread > 0) {
  //     outspread = "+" + outspread;
  //   }
  //   return outspread;
  // }

  let ethBookie =
    (Number(bookieShares) * (Number(unusedCapital) + Number(usedCapital))) /
    Number(totalShares);

  let [startTimeColumn, setStartTimeColumn] = useState([
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,
    1640455932, 1640455932,
  ]);

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

  let [xdecode, setXdecode] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    for (let ii = 0; ii < 32; ii++) {
      if (betData[ii]) xdecode = unpack256(betData[ii]);
      startTimeColumn[ii] = xdecode[7];
      bets0[ii] = Number(xdecode[0]);
      bets1[ii] = Number(xdecode[1]);
      payoff0[ii] = Number(xdecode[2]);
      payoff1[ii] = Number(xdecode[3]);
    }
    setBets0(bets0);
    setBets1(bets1);
    setPayoff0(payoff0);
    setPayoff1(payoff1);
    setStartTimeColumn(startTimeColumn);
    setXdecode(xdecode);
  }, [betData]);

  let teamSplit = [];

  for (let i = 0; i < 32; i++) {
    teamSplit[i] = scheduleString[i].split(":");
  }

  let allMatches = [];

  for (let i = 0; i < 32; i++) {
    allMatches.push(
      <tr key={i} style={{ width: "25%", textAlign: "left" }}>
        <td>{i}</td>
        <td>{teamSplit[i][1]}</td>
        <td>{teamSplit[i][2]}</td>
        <td>{(bets0[i] / 10000).toFixed(1)}</td>
        <td>{(bets1[i] / 10000).toFixed(1)}</td>
        <td>{(payoff0[i] / 10000 - bets1[i] / 10000).toFixed(1)}</td>
        <td>{(payoff1[i] / 10000 - bets0[i] / 10000).toFixed(1)}</td>
      </tr>
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
                    Home Page
                  </Link>
                </Text>
              </Flex>
            </Box>

            <Box>
              <Flex mt="10px" pt="10px"></Flex>
            </Box>
            <Box mb="10px" mt="10px">
              <Text className="style" size="14px">
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
                mt="10px"
                pt="10px"
                alignItems="center"
                style={{ borderTop: `thin solid ${G}` }}
              ></Flex>
            </Box>

            <Box>
              <Form
                onChange={setFundAmount}
                value={fundAmount}
                onSubmit={fundBook}
                mb="20px"
                justifyContent="flex-start"
                padding="4px"
                placeholder="# avax"
                buttonLabel="Fund"
              />
            </Box>

            <Box>
              {" "}
              <Text size="14px" color={cwhite}>
                {"Tokens available for match funding: " +
                  Number(tokenAmount)
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
                  " finney"}
              </Text>
            </Box>

            <Box>
              <Flex>
                <Flex width="100%" flexDirection="column">
                  <Flex
                    mt="10px"
                    pt="10px"
                    alignItems="center"
                    style={{
                      borderTop: `thin solid ${G}`,
                    }}
                  ></Flex>
                  <Flex pt="10px" justifyContent="left">
                    <Box>
                      <LabeledText
                        //big
                        color="#00ff00"
                        label="Available LP Capital"
                        size="14px"
                        text={Number(unusedCapital).toFixed(3)}
                        spacing="4px"
                      />
                    </Box>
                  </Flex>
                  <Flex pt="10px" justifyContent="left">
                    <Box>
                      <LabeledText
                        color="red"
                        label="Locked Capital"
                        text={Number(usedCapital).toFixed(3)}
                        spacing="1px"
                      />
                    </Box>
                  </Flex>
                  <Flex pt="10px" justifyContent="left">
                    <Box>
                      <LabeledText
                        big
                        label="Current Gross Bets"
                        text={Number(betCapital).toFixed(3)}
                        spacing="1px"
                      />
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
            </Box>

            <Box>
              {" "}
              <Text size="14px" color={cwhite}>
                {"You own: " +
                  Number(bookieShares).toFixed(0) +
                  "  out of " +
                  Number(totalShares).toFixed(0) +
                  " total shares"}
              </Text>
            </Box>
            <Box>
              {" "}
              <Text size="14px" color={cwhite}>
                {"Your share value: " + Number(ethBookie).toFixed(3) + " AVAX "}
              </Text>
              <Box>
                {" "}
                <Text size="14px" color={cwhite}>
                  Current Epoch: {currentWeek}{" "}
                </Text>
                <br></br>
                <Text size="14px" color={cwhite}>
                  you can withdraw after epoch {bookieEpoch}
                </Text>
              </Box>
            </Box>
            <Box>
              {Number(bookieShares) > 0 ? (
                <Form
                  onChange={setSharesToSell}
                  value={sharesToSell}
                  onSubmit={wdBook}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  placeholder="# shares"
                  buttonLabel="Withdraw"
                />
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
          <Flex justifyContent="center">
            <Text size="25px" color="#ffffff">
              Liquidity Provider Page
            </Text>
          </Flex>

          <Box mt="14px" mx="30px">
            <Flex width="100%" justifyContent="marginLeft">
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
              <Flex width="100%" flexDirection="column">
                <Flex pt="10px" justifyContent="space-between"></Flex>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex>
              <Flex width="100%" flexDirection="column">
                <Flex
                  mt="10px"
                  pt="10px"
                  alignItems="center"
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
