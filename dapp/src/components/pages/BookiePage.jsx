import React, { useContext, useState, useEffect } from "react";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G } from "../basics/Colors";
import LabeledText from "../basics/LabeledText";
import Form from "../basics/Form";
import TruncatedAddress from "../basics/TruncatedAddress";
import VBackgroundCom from "../basics/VBackgroundCom";
import AuthContext from "../../contexts/AuthContext";
import BettingContract from "../../abis/Betting.json";
import TokenContract from "../../abis/Token.json";
import OracleContract from "../../abis/Oracle.json";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

function BookiePage() {
  const [bettingContract, setBettingContract] = useState(null);
  const [oracleContract, setOracleContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState("");

  const { signer, provider, setSigner } = useContext(AuthContext);

  const [fundAmount, setFundAmount] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [sharesToSell, setSharesToSell] = useState("");
  const [contractTokens, setContractTokens] = useState(0);
  const [currentWeek, setCurrentWeek] = useState("");
  const [showDecimalOdds, setShowDecimalOdds] = useState(false);
  const [teamPick, setTeamPick] = useState("");
  const [wantTokens, setWantTokens] = useState(false);

  const [unusedCapital, setUnusedCapital] = useState(0);
  const [usedCapital, setUsedCapital] = useState(0);
  const [betCapital, setBetCapital] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [newBets, setNewBets] = useState(false);
  const [betData, setBetData] = useState([]);
  const [scheduleString, setScheduleString] = useState([
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
    "check later...: n/a: n/a",
  ]);
  const [bookieShares, setBookieShares] = useState("0");
  const [bookieEpoch, setBookieEpoch] = useState("0");
  const [tokenAmount, setTokenAmount] = useState("0");

  useEffect(() => {
    if (!signer) {
      if (provider) connect();
      return;
    }

    (async () => {
      setAccount(await signer.getAddress());

      console.log(await provider.getNetwork());
      const chainId = (await provider.getNetwork()).chainId.toString();

      const _bettingContract = new ethers.Contract(
        BettingContract.networks[chainId].address,
        BettingContract.abi,
        signer
      );
      const _oracleContract = new ethers.Contract(
        OracleContract.networks[chainId].address,
        OracleContract.abi,
        signer
      );
      const _tokenContract = new ethers.Contract(
        TokenContract.networks[chainId].address,
        TokenContract.abi,
        signer
      );

      setBettingContract(_bettingContract);
      setOracleContract(_oracleContract);
      setTokenContract(_tokenContract);
    })();
  }, [provider, signer]);

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

  async function inactivateBook() {
    await bettingContract.inactiveBook();
  }

  async function findValues() {
    // this.unusedKey = this.contracts["BettingMain"].methods.margin.cacheCall(0);
    let _unusedCapital =
      Number((await bettingContract.margin(0)) || "0") / 10000;
    setUnusedCapital(_unusedCapital);

    // this.usedKey = this.contracts["BettingMain"].methods.margin.cacheCall(1);
    let _usedCapital = Number((await bettingContract.margin(1)) || "0") / 10000;
    setUsedCapital(_usedCapital);

    // this.betCapitalKey =
    //   this.contracts["BettingMain"].methods.margin.cacheCall(2);
    let _betCapital = Number((await bettingContract.margin(2)) || "0") / 10000;
    setBetCapital(_betCapital);

    // this.weekKey = this.contracts["BettingMain"].methods.margin.cacheCall(3);
    let _currentWeek = Number(await bettingContract.margin(3));
    setCurrentWeek(_currentWeek);

    // this.totalSharesKey =
    //   this.contracts["BettingMain"].methods.margin.cacheCall(4);
    let _totalShares = (await bettingContract.margin(4)) || "0";
    setTotalShares(_totalShares);

    // this.marginKey5 = this.contracts["BettingMain"].methods.margin.cacheCall(5);

    // this.marginKey7 = this.contracts["BettingMain"].methods.margin.cacheCall(7);
    let _newBets = Number(await bettingContract.margin(7)) != 2000000000;
    setNewBets(_newBets);

    // this.betDataKey =
    //   this.contracts["BettingMain"].methods.showBetData.cacheCall();
    let _betData = (await bettingContract.showBetData()) || [];
    setBetData(_betData);

    // this.scheduleStringKey =
    //   this.contracts["OracleMain"].methods.showSchedString.cacheCall();
    let sctring = await oracleContract.showSchedString();
    if (sctring && _newBets) {
      setScheduleString(sctring);
    }

    // this.sharesKey = this.contracts["BettingMain"].methods.lpStruct.cacheCall(
    //   this.props.accounts[0]
    // );
    let bs = await bettingContract.lpStruct(account);
    let _bookieShares = bs ? bs.shares.toString() : "0";
    setBookieShares(_bookieShares);

    let _bookieEpoch = bs ? bs.outEpoch.toString() : "0";
    setBookieEpoch(_bookieEpoch);

    // this.tokenKey = this.contracts["TokenMain"].methods.balanceOf.cacheCall(
    //   "0x23cEd89B1F6baFa4F89063D7Af51a81a38d879d6"
    // );
    let _tokenAmount =
      (await tokenContract.balanceOf(
        "0x23cEd89B1F6baFa4F89063D7Af51a81a38d879d6"
      )) || "0";
    setTokenAmount(_tokenAmount);
  }

  function unpack256(src) {
    // const bn = new web3.BN(src);
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

  function getSpreadText(spreadnumber) {
    let outspread = spreadnumber / 10;
    if (outspread > 0) {
      outspread = "+" + outspread;
    }
    return outspread;
  }

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
      <tr key={i} style={{ width: "25%", textAlign: "center" }}>
        <td>{teamSplit[i][0]}</td>
        <td>{teamSplit[i][1]}</td>
        <td>{teamSplit[i][2]}</td>
        <td>{(bets0[i] / 10).toFixed(3)}</td>
        <td>{(bets1[i] / 10).toFixed(3)}</td>
        <td>{(payoff0[i] / 10 - bets1[i] / 10).toFixed(3)}</td>
        <td>{(payoff1[i] / 10 - bets0[i] / 10).toFixed(3)}</td>
      </tr>
    );
  }

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log(signer);
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
        page={"bookie"}
        side={
          <Box mt="30px" ml="25px" mr="35px">
            <Logo />
            <Flex mt="15px"></Flex>
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
                <Text size="20px">
                  <Link
                    className="nav-header"
                    style={{
                      // textDecoration: "none",
                      cursor: "pointer",
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
                <Text size="20px">
                  <Link
                    className="nav-header"
                    style={{
                      cursor: "pointer",
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
              <TruncatedAddress
                label="Your Address"
                addr={account}
                start="8"
                end="6"
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
                buttonWidth="95px"
                inputWidth="100px"
                placeholder="ether"
                buttonLabel="fund"
              />
            </Box>

            <Box>
              {" "}
              <Text size="14px">
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
                  >
                    <Text size="16px" weight="400" style={{ marginLeft: "1%" }}>
                      Bookie Capital
                    </Text>
                  </Flex>
                  <Flex pt="10px" justifyContent="space-around">
                    <Box>
                      <LabeledText
                        big
                        label="Available Capital"
                        size="14px"
                        text={Number(unusedCapital).toFixed(3)}
                        spacing="4px"
                      />
                    </Box>

                    <Box>
                      <LabeledText
                        big
                        label="Locked Capital"
                        text={Number(usedCapital).toFixed(3)}
                        spacing="1px"
                      />
                    </Box>
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
              <Text size="14px">
                {"You own: " +
                  Number(bookieShares).toFixed(0) +
                  "  out of " +
                  Number(totalShares).toFixed(0) +
                  " total shares"}
              </Text>
            </Box>
            <Box>
              {" "}
              <Text size="14px">
                {"Your share value: " + Number(ethBookie).toFixed(3) + " Eth "}
              </Text>
              <Box>
                {" "}
                <Text size="15px">Current Epoch: {currentWeek} </Text>
                <br></br>
                <Text size="15px">
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
                  placeholder="Shares"
                  buttonLabel="withdraw"
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
        <div className="bookie-page-wrapper" style={{ width: "100%" }}>
          <Flex justifyContent="center">
            <Text size="25px">Bookie Page</Text>
          </Flex>

          <Box mt="15px" mx="30px">
            <Flex width="100%" justifyContent="marginLeft">
              <Text size="14px" weight="300">
                {" "}
                This page helps LPs understand their netLiab exposure to this
                week's events. The NetLiability is the amount paid out by the
                contract if the Home or Away Team wins. If negative this means
                the LPs are credited eth. LPs can fund and withdraw using the
                left-hand fields.
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
                  }}
                >
                  <tbody>
                    <tr style={{ width: "50%", textAlign: "center" }}>
                      <th>sport</th>
                      <th>Home Team</th>
                      <th>Away Team</th>
                      <th>HomeBets</th>
                      <th>AwayBets</th>
                      <th>NetLiabHome</th>
                      <th>NetLiabAway</th>
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
