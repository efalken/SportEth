import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import web3 from "web3-utils";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G } from "../basics/Colors";
import LabeledText from "../basics/LabeledText";
import { autoBind } from "react-extras";
import Form from "../basics/Form.js";
import ButtonEthScan from "../basics/ButtonEthScan.js";
import TruncatedAddress from "../basics/TruncatedAddress.js";
import VBackgroundCom from "../basics/VBackgroundCom";

class BookiePagejs extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);

    this.contracts = context.drizzle.contracts;

    this.state = {
      fundAmount: "",
      shareAmount: "",
      sharesToSell: "",
      contractTokens: 0,
      currentWeek: "",
      showDecimalOdds: false,
      teamPick: "",
    };
  }

  componentDidMount() {
    document.title = "Bookie Page";
    setTimeout(() => {
      this.findValues();
    }, 1000);
  }

  handletakeBookTeam(value) {
    this.setState({ teamPick: value });
  }

  fundRadio() {
    const currentState = this.state.wantTokens;
    this.setState({ wantTokens: !currentState });
  }

  handlefundBook(value) {
    this.setState({
      fundAmount: value * 10000,
    });
  }

  openEtherscan(txhash) {
    const url = "https://testnet.snowtrace.io/tx/" + txhash;
    window.open(url, "_blank");
  }

  handleBookieSell(value) {
    this.setState({
      sharesToSell: value,
    });
  }

  wdBook() {
    console.log("sharesToSell", this.state.sharesToSell);
    this.contracts[
      "BettingMain"
    ].methods.withdrawBook.cacheSend(this.state.sharesToSell, {
      from: this.props.accounts[0],
    });
  }

  fundBook() {
    this.contracts["BettingMain"].methods.fundBook.cacheSend({
      from: this.props.accounts[0],
      value: this.state.fundAmount * 1e14,
    });
  }

  inactivateBook() {
    this.contracts[
      "BettingMain"
    ].methods.inactiveBook.cacheSend();
  }

  findValues() {

    this.unusedKey = this.contracts["BettingMain"].methods.margin.cacheCall(0);

    this.usedKey = this.contracts["BettingMain"].methods.margin.cacheCall(1);

    this.betCapitalKey = this.contracts["BettingMain"].methods.margin.cacheCall(2);

    this.weekKey = this.contracts["BettingMain"].methods.margin.cacheCall(3);

    this.totalSharesKey = this.contracts["BettingMain"].methods.margin.cacheCall(4);

    this.marginKey5 = this.contracts["BettingMain"].methods.margin.cacheCall(5);

    this.marginKey7 = this.contracts["BettingMain"].methods.margin.cacheCall(7);


    this.betDataKey = this.contracts[
      "BettingMain"
    ].methods.showBetData.cacheCall();

    this.scheduleStringKey = this.contracts[
      "OracleMain"
    ].methods.showSchedString.cacheCall();

    this.sharesKey = this.contracts["BettingMain"].methods.lpStruct.cacheCall(
      this.props.accounts[0]
    );

    this.tokenKey = this.contracts["TokenMain"].methods.balanceOf.cacheCall(
      "0x23cEd89B1F6baFa4F89063D7Af51a81a38d879d6"
    );
  }

  unpack256(src) {
    const bn = new web3.BN(src);
    //const str = bn.toString(16);
    const str = bn.toString(16).padStart(64, "0");
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

  getSpreadText(spreadnumber) {
    let outspread = spreadnumber / 10;
    if (outspread > 0) {
      outspread = "+" + outspread;
    }
    return outspread;
  }

  render() {

    let betData = [];
    if (this.betDataKey in this.props.contracts["BettingMain"].showBetData) {
      let st = this.props.contracts["BettingMain"].showBetData[this.betDataKey]
        .value;
      if (st) {
        betData = st;
      }
    }

    let unusedCapital = "0";
    if (this.unusedKey in this.props.contracts["BettingMain"].margin) {
      let uc = this.props.contracts["BettingMain"].margin[this.unusedKey].value;
      if (uc) {
        unusedCapital = uc / 10000;
      }
    }

    console.log("contract tokens", this.tokenKey);

    let usedCapital = "0";
    if (this.usedKey in this.props.contracts["BettingMain"].margin) {
      let uc = this.props.contracts["BettingMain"].margin[this.usedKey].value;
      if (uc) {
        usedCapital = uc / 10000;
      }
    }

    let betCapital = "0";
    if (this.betCapitalKey in this.props.contracts["BettingMain"].margin) {
      let bc = this.props.contracts["BettingMain"].margin[this.betCapitalKey]
        .value;
      if (bc) {
        betCapital = bc / 10000;
      }
    }

    if (this.weekKey in this.props.contracts["BettingMain"].margin) {
      this.currentWeek = this.props.contracts["BettingMain"].margin[
        this.weekKey
      ].value;
    }

    // let bookieStruct = {
    //   0: "0",
    //   1: "0",
    //   shares: "0",
    //   outEpoch: "0",
    // };
    let bookieShares = "0";
    let bookieEpoch = "0";
    if (this.sharesKey in this.props.contracts["BettingMain"].lpStruct) {
      let bs = this.props.contracts["BettingMain"].lpStruct[this.sharesKey]
        .value;
      if (bs) {
        // bookieStruct = bs;
        bookieShares = bs.shares;
        bookieEpoch = bs.outEpoch;
      }
    }

    let tokenAmount = "0";
    if (this.tokenKey in this.props.contracts["TokenMain"].balanceOf) {
      let ta = this.props.contracts["TokenMain"].balanceOf[this.tokenKey].value;
      if (ta) {
        tokenAmount = ta;
      }
    }

    let totalShares = "0";
    if (this.totalSharesKey in this.props.contracts["BettingMain"].margin) {
      let ts = this.props.contracts["BettingMain"].margin[this.totalSharesKey]
        .value;
      if (ts) {
        totalShares = ts;
      }
    }

    let ethBookie =
      (Number(bookieShares) * (Number(unusedCapital) + Number(usedCapital))) /
      Number(totalShares);

    let scheduleString = ["check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a"];

    let startTimeColumn = [1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932];


    let bets0 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    let bets1 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    let payoff0 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    let payoff1 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    let newBets = false;
    if (this.marginKey7 in this.props.contracts["BettingMain"].margin) {
      let newBets0 = this.props.contracts["BettingMain"].margin[
        this.marginKey7
      ].value;
      if (newBets0 != 2000000000) {
        newBets = true;
      }
    }


    if (
      this.scheduleStringKey in
      this.props.contracts["OracleMain"].showSchedString
    ) {
      let sctring = this.props.contracts["OracleMain"].showSchedString[
        this.scheduleStringKey
      ].value;
      if (sctring && newBets) {
        scheduleString = sctring;
      }
    }


    let xdecode = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let ii = 0; ii < 32; ii++) {
      xdecode = this.unpack256(betData[ii]);
      startTimeColumn[ii] = xdecode[7];
      bets0[ii] = Number(xdecode[0]);
      bets1[ii] = Number(xdecode[1]);
      payoff0[ii] = Number(xdecode[2]);
      payoff1[ii] = Number(xdecode[3]);
    }

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
                    <a
                      className="nav-header"
                      style={{
                        // textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="/betpage"
                      target="_blank"
                    >
                      Betting Page
                    </a>
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
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/"
                    >
                      Home Page
                    </a>
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Flex mt="10px" pt="10px"></Flex>
              </Box>
              <Box mb="10px" mt="10px">
                <TruncatedAddress
                  label="Your Address"
                  addr={this.props.accounts[0]}
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

              {this.props.transactionStack.length > 0 &&
                this.props.transactionStack[0].length === 66 ? (
                <Flex alignItems="center">
                  <ButtonEthScan
                    onClick={() =>
                      this.openEtherscan(this.props.transactionStack[0])
                    }
                    style={{ height: "30px" }}
                  >
                    See Transaction Detail on Ethscan
                  </ButtonEthScan>
                </Flex>
              ) : null}

              <Box>
                <Form
                  onChange={this.handlefundBook}
                  value={this.state.fundAmount}
                  onSubmit={this.fundBook}
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
                      <Text
                        size="16px"
                        weight="400"
                        style={{ marginLeft: "1%" }}
                      >
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
                  {"Your share value: " +
                    Number(ethBookie).toFixed(3) +
                    " Eth "}
                </Text>
                <Box>
                  {" "}
                  <Text size="15px">Current Epoch: {this.currentWeek} </Text>
                  <br></br>
                  <Text size="15px">
                    you can withdraw after epoch {bookieEpoch}
                  </Text>
                </Box>
              </Box>
              <Box>
                {Number(bookieShares) > 0 ? (
                  <Form
                    onChange={this.handleBookieSell}
                    value={this.state.sharesToSell}
                    onSubmit={this.wdBook}
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
}

BookiePagejs.contextTypes = {
  drizzle: PropTypes.object,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
  };
};

export default drizzleConnect(BookiePagejs, mapStateToProps);
