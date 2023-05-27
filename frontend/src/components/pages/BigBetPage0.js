import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import web3 from "web3-utils";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import Form from "../basics/Form.js";
import { G } from "../basics/Colors";
import { autoBind } from "react-extras";
import Triangle from "../basics/Triangle";
import ButtonEthScan from "../basics/ButtonEthScan.js";
import Input from "../basics/Input.js";
import Button from "../basics/Button.js";
 import ButtonI from '../basics/ButtonI.js';
import TruncatedAddress from "../basics/TruncatedAddress.js";
//import TruncatedAddress0 from '../basics/TruncatedAddress0.js';
import VBackgroundCom from "../basics/VBackgroundCom";
import BettingContract from "../../abis/Betting.json";
// import Form from '../basics/Form.js'
var moment = require("moment");
var momentTz = require("moment-timezone");
var Web3 = require("web3");

class BigBetPagejs extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);

    this.contracts = context.drizzle.contracts;
    this.web3 = web3;
    this.web2 = web3;
    this.userOffers = [];
    this.currentOffers = [];
    this.scheduleStringkey = [];
    this.takekeys = {};
    this.takekeys2 = {};

    this.state = {
      contractID: "",
      betAmount: "",
      teamPick: null,
      matchPick: null,
      teamTake: false,
      showDecimalOdds: false,
      BetSize: false,
      decOddsOffered: 0,
      fundAmount: 0,
      wdAmount: "",
      bigBets: [],
      bigBetsSet: false,
      decTransform1: "",
      currW: "",
    };
  }

  componentDidMount() {
    document.title = "Big Bet Page";
    this.findValues();
    this.getUserActiveOffers();
    this.getCurrentOffers();
    setInterval(() => {
      this.findValues();
      this.getWeek();
    }, 1000);
    /*
    setTimeout(() => {
      this.getWeek();
    }, 4000);*/
  }

  openEtherscan(txhash) {
    const url = "https://testnet.snowtrace.io/tx/" + txhash;
    window.open(url, "_blank");
  }

  handleBetSize(value0) {
    this.setState({ betAmount: value0 });
  }

  handleBettorFund(value) {
    this.setState({
      fundAmount: value,
    });
  }

  handleOddsOffered(decOddsOffered) {
    this.setState({ decOddsOffered });
  }

  toggle() {
    const currentState = this.state.details;
    this.setState({ details: !currentState });
  }

  switchOdds() {
    this.setState({ showDecimalOdds: !this.state.showDecimalOdds });
  }

  takeBet() {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.bet.cacheSend(
      6,
      0,
      200,
      {
        from: this.props.accounts[0],
      }
    );
  }

  killBet(x) {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.cancelBigBet.cacheSend(x, {
      from: this.props.accounts[0],
    });
  }

  handleBettorWD(value2) {
    this.setState({
      wdAmount: value2,
    });
  }

  fundBettor(x) {
    const stackId = this.contracts["BettingMain"].methods.fundBettor.cacheSend({
      from: this.props.accounts[0],
      value: this.state.fundAmount * 1e18,

    });
  }

  withdrawBettor(x) {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.withdrawBettor.cacheSend(this.state.wdAmount*10000, {
      from: this.props.accounts[0],
    });
  }

  checkOffer(x) {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.offerContracts.cacheCall(x);
  }

  makeBigBet() {

    const stackId = this.contracts["BettingMain"].methods.postBigBet.cacheSend(
      this.state.matchPick,
      this.state.teamPick,
      this.state.betAmount * 10000,
      this.state.decOddsOffered*1000,
      {
        from: this.props.accounts[0],
      }
    );
    }

  takeBigBet() {
    const stackId = this.contracts["BettingMain"].methods.takeBigBet.cacheSend(
      this.state.contractID,
      {
        from: this.props.accounts[0],

      }
    );
  }

  getUserActiveOffers() {
    const web3b = this.context.drizzle.web3;
    const contractweb3b = new web3b.eth.Contract(
      BettingContract.abi,
      BettingContract.address
    );
    var eventdata = [];
    var takes = {};
    contractweb3b
      .getPastEvents("OfferRecord", {
        fromBlock: 2500000,
        toBlock: "latest",
        filter: { bettor: this.props.accounts[0] },
      })
      .then(
        function (events) {
          events.forEach(function (element) {
            eventdata.push({
              Hashoutput: element.returnValues.contractHash,
              BettorAddress: element.returnValues.bettor,
              Epoch: Number(element.returnValues.epoch),
              MatchNum: Number(element.returnValues.matchNum),
              MyTeamPick: Number(element.returnValues.pick),
              timestamp: Number(element.blockNumber),
            //  timestamp: element.blockNumber.timestamp,
              BetSize: Number(element.returnValues.betAmount/10000),
              Payoff: Number(element.returnValues.payoff),
            });
            takes[element.returnValues.contractHash] = this.contracts[
              "BettingMain"
            ].methods.checkOffer.cacheCall(
              element.returnValues.contractHash).toString();
          }, this);
          this.userOffers[0] = eventdata;
          this.takekeys = takes;
        }.bind(this)
      );

  }

  getCurrentOffers() {
    const web3b = this.context.drizzle.web3;
    const contractweb3b = new web3b.eth.Contract(
      BettingContract.abi,
      BettingContract.address
    );
    var eventdata2 = [];
    var takes2 = {};
    contractweb3b
      .getPastEvents("OfferRecord", {
        fromBlock: 2500000,
        toBlock: "latest",
        filter: { epoch: this.state.currW },
      })
      .then(
        function (events) {
          events.forEach(function (element) {
            eventdata2.push({
              Hashoutput2: element.returnValues.contractHash,
              BettorAddress2: element.returnValues.bettor,
              Epoch2: Number(element.returnValues.epoch),
              MatchNum2: Number(element.returnValues.matchNum),
              OfferedTeam2: Number(1 - element.returnValues.pick),
              timestamp2: Number(element.blockNumber),
              BetSize2: Number(element.returnValues.betAmount),
              Payoff2: Number(element.returnValues.payoff),
            });
            takes2[element.returnValues.contractHash] = this.contracts[
              "BettingMain"
            ].methods.checkOffer.cacheCall(
              element.returnValues.contractHash);
          }, this);
          this.currentOffers = eventdata2;
          this.takekeys2 = takes2;
        }.bind(this)
      );
  }

  radioFavePick(matchpic) {
    this.setState({ matchPick: matchpic, teamTake: false, teamPick: 0 });
  }

  radioUnderPick(matchpic) {
    this.setState({ matchPick: matchpic, teamTake: false, teamPick: 1 });
  }

  radioTeamPickTake(betamt0, hash0, odds0) {
    this.setState({
      teamTake: true,
      contractID: hash0,
      betAmount: betamt0,
      decOddsOffered: odds0,
    });
  }

  sortByBetSize() {
    if (this.state.BetSize) {
      this.state.bigBets.sort(function (a, b) {
        return a.BigBetSize - b.BigBetSize;
      });
      this.setState({ BetSize: false });
    } else {
      this.state.bigBets.sort(function (a, b) {
        return b.BigBetSize - a.BigBetSize;
      });
      this.setState({ BetSize: true });
    }
  }

  findValues() {
    this.weekKey = this.contracts["BettingMain"].methods.margin.cacheCall(3);

    this.userBalKey = this.contracts[
      "BettingMain"
    ].methods.userBalance.cacheCall(this.props.accounts[0]);

    this.betDataKey = this.contracts[
      "BettingMain"
    ].methods.showBetData.cacheCall();

    this.scheduleStringKey = this.contracts[
      "OracleMain"
    ].methods.showSchedString.cacheCall();

    this.offkey = this.contracts[
      "BettingMain"
    ].methods.betContracts.cacheCall("0xd742678f8344bbb7accc6296c8abc740f2c0508ada4c2249fa898c2877a8943c").epoch;

    this.marginKey7 = this.contracts["BettingMain"].methods.margin.cacheCall(7);

  }

  getMoneyLine(decOddsi) {
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

  translateMoneyLine(moneyline0) {
    let decTransform1 = 0;
    if (moneyline0 < 100) {
      decTransform1 = -(100 - moneyline0) / moneyline0;
    } else {
      decTransform1 = moneyline0 / 100 + 1;
    }
    decTransform1 = decTransform1.toFixed(3);
    this.setState({ decTransform1 });
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
  /*
  <td>{bet.BigMatch, this.state.matchPick, bet.OfferTeamNum, this.state.teamPick}</td>*/

  getWeek() {
    let currW = 0;
    if (this.weekKey in this.props.contracts["BettingMain"].margin) {
      currW = this.props.contracts["BettingMain"].margin[this.weekKey].value;
      currW = Number(currW);
    }
    this.setState({ currW });
    this.getCurrentOffers();
  }



  render() {
    let subcontracts = {};
    Object.keys(this.takekeys).forEach(function (id) {
      if (
        this.takekeys[id] in this.props.contracts["BettingMain"].checkOffer
      ) {
        subcontracts[id] = this.props.contracts["BettingMain"].checkOffer[
          this.takekeys[id]
        ].value;
      }
    }, this);


    console.log("bigBets", this.state.bigBets);
    console.log("currW", this.state.currW)
      console.log("decOdds", this.decOddsOffered)

    let subcontracts2 = {};
    Object.keys(this.takekeys2).forEach(function (id) {
      if (
        this.takekeys2[id] in this.props.contracts["BettingMain"].checkOffer
      ) {
        subcontracts2[id] = this.props.contracts["BettingMain"].checkOffer[
          this.takekeys2[id]
        ].value;
      }
    }, this);


    console.log("subcontracts2", subcontracts2);


    let scheduleString =  ["check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a"];

    let startTimeColumn = [1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932,];

    let odds0 = [957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957];

    let odds1 = [957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957];

    let liab0 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,];

    let liab1 = [-123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123,];





let betData = [];
    if (this.betDataKey in this.props.contracts["BettingMain"].showBetData) {
      let d0 = this.props.contracts["BettingMain"].showBetData[this.betDataKey]
        .value;
      if (d0) {
        betData = d0;
      }
    }

    let offstring = "";
        if (this.offkey in this.props.contracts["BettingMain"].betContracts) {
          let offstring = this.props.contracts["BettingMain"].betContracts[this.offkey].epoch;
        }
console.log("offstring", offstring);

    let userBalance = "0";
    if (this.userBalKey in this.props.contracts["BettingMain"].userBalance) {
      let ub = this.props.contracts["BettingMain"].userBalance[this.userBalKey]
        .value;
      if (ub) {
        userBalance = ub / 10000;
      }
    }

    let netLiab = [liab0, liab1];

    let xdecode = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let ii = 0; ii < 32; ii++) {
      xdecode = this.unpack256(betData[ii]);
      odds0[ii] = Number(xdecode[6]);
      odds1[ii] = Number(xdecode[7]);
      startTimeColumn[ii] = xdecode[5];
      netLiab[0][ii] = (Number(xdecode[2]) - Number(xdecode[1])) / 10;
      netLiab[1][ii] = (Number(xdecode[3]) - Number(xdecode[0])) / 10;
    }

      let oddsTot = [odds0, odds1];


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

    let faveSplit = [];
    let underSplit = [];
    let sport = [];
    let teamSplit = [];
    for (let i = 0; i < 32; i++) {
      if (scheduleString[i] !== "") {
        teamSplit[i] = scheduleString[i].split(":");
        sport[i] = teamSplit[i][0];
        faveSplit[i] = teamSplit[i][1];
        underSplit[i] = teamSplit[i][2];
      } else {
        sport[i] = "na";
        faveSplit[i] = "na";
        underSplit[i] = "na";
      }
    }

    let teamList = [];

    const borderCells = 5;

    for (let i = 0; i < 32; i++) {
      teamList.push(
        <tr
          className={(i + 1) % borderCells === 0 ? "border-row" : ""}
          key={i}
          style={{ width: "60%", textAlign: "left" }}
        >
          <td>{i}</td>
          <td>{sport[i]}</td>
          <td style={{ textAlign: "left", paddingLeft: "15px" }}>
            {startTimeColumn[i] > moment().unix() ? (
              <input
                type="radio"
                value={i}
                name={"teamRadio"}
                onChange={({ target: { value } }) => this.radioFavePick(value)}
                className="teamRadio"
              />
            ) : (
              <span className="circle"></span>
            )}{" "}
            {faveSplit[i]}
          </td>
          <td>
            {this.state.showDecimalOdds
              ? (1 + (95 * oddsTot[0][i]) / 100000).toFixed(3)
              : this.getMoneyLine((95 * oddsTot[0][i]) / 100)}
          </td>
          <td style={{ textAlign: "left", paddingLeft: "15px" }}>
            {startTimeColumn[i] > moment().unix() ? (
              <input
                type="radio"
                value={i}
                name={"teamRadio"}
                onChange={({ target: { value } }) => this.radioUnderPick(value)}
                className="teamRadio"
              />
            ) : (
              <span className="circle"></span>
            )}{" "}
            {underSplit[i]}
          </td>
          <td>
            {this.state.showDecimalOdds
              ? (1 + (95 * oddsTot[1][i]) / 100000).toFixed(3)
              : this.getMoneyLine(95*oddsTot[1][i]/100)}
          </td>
          <td>{moment.unix(startTimeColumn[i]).format("MMMDD-ha")}</td>
        </tr>
      );
    }

    let bigBets = [];

    this.currentOffers.map((bet) => {
      let bigBet = {
        teamAbbrevName: teamSplit[bet.MatchNum2][bet.OfferedTeam2 + 1],
        BigBetSize: Number(bet.Payoff2/10000).toFixed(3),
        BigOdds: ((0.95 * bet.Payoff2) / bet.BetSize2 + 1).toFixed(3),
        OfferHash: bet.Hashoutput2,
        OfferedEpoch: bet.Epoch2,
        OfferTeamNum: bet.OfferedTeam2,
        BigMatch: bet.MatchNum2
      };
      bigBets.push(bigBet);
    });

    // console.log("bb", this.state.bigBets);

    if (!this.state.bigBetsSet && bigBets.length > 0) {
      this.setState({ bigBets });
      this.setState({ bigBetsSet: true });
    }

    return (
      <div>
        <VBackgroundCom />
        <Split
          page={"bookies"}
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
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/bookiepage"
                      target="_blank"
                    >
                      Go to Bookie Page
                    </a>
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Flex>
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/betpage"
                      target="_blank"
                    >
                      Go to Bet Page
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
                      HomePage
                    </a>
                  </Text>
                </Flex>
              </Box>
              <Box mb="10px" mt="10px">
                <Text>Your address</Text>
                <TruncatedAddress
                  addr={this.props.accounts[0]}
                  start="8"
                  end="6"
                  transform="uppercase"
                  spacing="1px"
                />
                <Text>Your available margin: {Number(userBalance).toFixed(4)} ETH</Text>
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
                      backgroundColor: "#424242",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                    onClick={() => this.switchOdds()}
                  >
                    {this.state.showDecimalOdds
                      ? "show MoneyLine"
                      : "show DecimalOdds"}
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
              <Flex justifyContent="left">
                <Text size="15px">Active Week: {this.state.currW}</Text>
              </Flex>
              <br />
              <Flex>
                {Object.keys(this.userOffers).map((id) => (
                  <div style={{ width: "100%", float: "left" }}>

                    <Text> Your Unclaimed Offers</Text>
                    <br />
                    <table style={{ width: "100%", fontSize: "12px" }}>
                      <tbody>
                        <tr style={{ width: "50%" }}>
                          <td>Week</td>
                          <td>Bet Size</td>
                          <td>contractID</td>
                          <td>Click to Retract</td>
                        </tr>
                        {this.userOffers[id].map(
                          (event, index) =>
                            event.Epoch == this.state.currW &&
                           subcontracts[event.Hashoutput] &&
                            (
                              <tr key={index} style={{ width: "50%" }}>
                                <td>{event.Epoch}</td>
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
                                      backgroundColor: "#424242",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                    }}
                                    value={event.Hashoutput}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.killBet(event.Hashoutput);
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
                    onChange={this.handleBettorWD}
                    value={this.state.wdAmount}
                    onSubmit={this.withdrawBettor}
                    mb="20px"
                    justifyContent="flex-start"
                    buttonWidth="95px"
                    inputWidth="100px"
                    borderRadius="2px"
                    placeholder="eth"
                    buttonLabel="WithDraw"
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
                    onChange={this.handleBettorFund}
                    value={this.state.fundAmount}
                    onSubmit={this.fundBettor}
                    mb="10px"
                    justifyContent="flex-start"
                    buttonWidth="95px"
                    inputWidth="100px"
                    borderRadius="2px"
                    placeholder="eth"
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
                  <Text> MoneyLine to Decimal odds converter</Text>
                </Box>

                <Flex mt="10px" mb="10px">
                  <Text width="50%">MoneyLine: </Text>
                  <Input
                    onChange={({ target: { value } }) =>
                      this.translateMoneyLine(value)
                    }
                    width="151px"
                    placeholder={"enterML"}
                    marginLeft="10px"
                    marginRight="5px"
                  />
                </Flex>
                <Flex>
                  <Text width="50%">Decimal odds:</Text>
                  <Text> {this.state.decTransform1}</Text>
                </Flex>
              </Box>
            </Box>
          }
        >
          <Flex justifyContent="center">
            <Text size="25px">Place, Take and Cancel Big Bets</Text>
          </Flex>

          <Box mt="15px" mx="30px">
            <Flex width="100%" justifyContent="marginLeft">
              <Text size="14px" weight="300">
                {" "}
                This page is for those who want to offer or take bets larger
                than what is offered on the main betting page. Toggle the match
                and team you want to bet on, and the offers, if any, will appear
                below. You can place your showLongs large bet above. Your
                unclaimed bets are on the left tab (this sends your eth back).
                Enter odds in decimal form. For example, a MoneyLine -110 bet is
                equivalent to 1.909 decimal odds, and you would enter it as
                1.909. These are the odds you are asking for on your bet.
              </Text>
            </Flex>
          </Box>

          {this.state.teamPick != null && !this.state.teamTake ? (
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
                  color: "#0099ff",
                  fontSize: "13px",
                }}
              >
                <Text size="16px" weight="400">
                  Sport:{teamSplit[this.state.matchPick][0]}
                  {"  "}
                  pick:
                  {
                    teamSplit[this.state.matchPick][
                      Number(this.state.teamPick) + 1
                    ]
                  }
                  {"    "}
                  opponent:{" "}
                  {
                    teamSplit[this.state.matchPick][
                      2 - Number(this.state.teamPick)
                    ]
                  }
                  <br></br>
                  Standard Book Odds:{" "}
                  {(
                    95*oddsTot[this.state.teamPick][this.state.matchPick]/100000  +  1
                  ).toFixed(3)}
                  {"  (MoneyLine "}
                  {this.getMoneyLine(
                    0.95*oddsTot[this.state.teamPick][this.state.matchPick]
                  )}
                  {")   "}
                  <br></br>
                  <br></br>{" "}
                </Text>
              </Flex>
            </Flex>
          ) : null}

          <Flex>
            {this.state.teamPick != null && !this.state.teamTake ? (
              <Flex
                mt="5px"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Input
                  onChange={({ target: { value } }) =>
                    this.handleBetSize(value)
                  }
                  width="100px"
                  placeholder={"Enter Eths"}
                  marginLeft="10px"
                  marginRignt="5px"
                  value={this.state.betAmount}
                />

                <Input
                  onChange={({ target: { value } }) =>
                    this.handleOddsOffered(value)
                  }
                  width="151px"
                  placeholder={"DecOdds e.g. 1.909"}
                  marginLeft="10px"
                  marginRignt="5px"
                  value={this.state.decOddsOffered}
                />
                <Box mt="10px" mb="10px">
                  <Button
                    style={{
                      height: "30px",
                      width: "200px",
                      float: "right",
                      marginLeft: "5px",
                    }}
                    onClick={() => this.makeBigBet()}
                  >
                    Click to Submit{" "}
                  </Button>
                </Box>

                <Box mt="10px" mb="10px" ml="80px" mr="80px"></Box>
              </Flex>
            ) : null}
          </Flex>

          <Flex
            style={{
              color: "#0099ff",
              fontSize: "13px",
            }}
          >
            {this.state.teamTake === true ? (
              <Text size="14px" weight="400">
                <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
                <Box mt="10px" mb="10px" ml="40px" mr="40px">
                  <Button
                    style={{
                      height: "30px",
                      width: "500px",
                      float: "left",
                      marginLeft: "5px",
                    }}
                    onClick={() => this.takeBigBet()}
                  >
                    Take {Number(this.state.betAmount).toFixed(3)} on{" "}
                    {
                      teamSplit[this.state.matchPick][
                        1 + Number(this.state.teamPick)
                      ]
                    }{" "}
                    {"  "}
                    at odds {Number(this.state.decOddsOffered).toFixed(3)}
                    {" (MoneyLine "}
                    {this.getMoneyLine(
                      Number(this.state.decOddsOffered) * 1000 - 1000
                    )}
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
            {this.state.teamPick !== null ? (
              <div>
                <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
                <Text>Current Offers</Text>
                <Box mt="10px" mb="10px" ml="40px" mr="40px"></Box>
                <table
                  style={{
                    width: "100%",
                    fontSize: "12px",
                    tableLayout: "fixed",
                  }}
                >
                  <thead>
                    <tr style={{ width: "100%" }}>
                      <td>take </td>
                      <td
                        onClick={() => this.sortByBetSize()}
                        style={{ cursor: "pointer" }}
                      >
                        Size
                        <Triangle
                          rotation={!this.state.BetSize ? "180deg" : ""}
                          scale="0.8"
                          fill
                          color="white"
                        />
                      </td>
                      <td>Offered Odds</td>
                      <td>ContractID</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.bigBets.length > 0 &&
                  /*  bet.OfferTeamNum === this.state.teamPick &&
                     bet.BigMatch === this.state.matchPick &&*/
                      this.state.bigBets.map(
                        (bet, index) =>
                      //    bet.OfferTeamNum === this.state.teamPick &&
                      bet.BigMatch == this.state.matchPick &&
                      bet.OfferTeamNum === this.state.teamPick &&
                      subcontracts2[bet.OfferHash] && (
                            <tr style={{ width: "100%" }}>
                              <td>
                                <input
                                  type="radio"
                                  value={bet.OfferTeamNum}
                                  name={bet.teamAbbrevName}
                                  onChange={({ target: { value } }) =>
                                    this.radioTeamPickTake(
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
                          )
                      )}
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
                <table
                  style={{
                    width: "100%",
                    borderRight: "1px solid",
                    float: "left",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr style={{ width: "50%", textAlign: "left" }}>
                      <th>Match</th>
                      <th>sport</th>
                      <th style={{ textAlign: "left" }}>Favorite</th>
                      <th style={{ textAlign: "left" }}>
                        {this.state.showDecimalOdds ? "DecOdds" : "MoneyLine"}
                      </th>
                      <th style={{ textAlign: "left" }}>Underdog</th>
                      <th style={{ textAlign: "left" }}>
                        {this.state.showDecimalOdds ? "DecOdds" : "MoneyLine"}
                      </th>
                      <th style={{ textAlign: "left" }}>Start</th>
                    </tr>
                    {teamList}
                  </tbody>
                </table>
              </Flex>{" "}
            </Box>
          </div>
        </Split>
      </div>
    );
  }
}

BigBetPagejs.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
  };
};

export default drizzleConnect(BigBetPagejs, mapStateToProps);
