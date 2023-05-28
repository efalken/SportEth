import React, { Component } from "react";
// test
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import Split from "../layout/Split";
import web3 from "web3-utils";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import Form from "../basics/Form.js";
import { G } from "../basics/Colors";
import { autoBind } from "react-extras";
import ButtonEthScan from "../basics/ButtonEthScan.js";
import Input from "../basics/Input.js";
import Button from "../basics/Button.js";
import TruncatedAddress from "../basics/TruncatedAddress.js";
import VBackgroundCom from "../basics/VBackgroundCom";
import BettingContract from "../../abis/Betting.json";


var moment = require("moment");

class BetPagejs extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);

    this.contracts = context.drizzle.contracts;
    this.web3 = web3;
    this.currentOfferts = [];
    this.takekeys = {};
    this.chainID = [];

    this.state = {
      betAmount: "",
      fundAmount: "",
      wdAmount: "",
      sharesToSell: "",
      teamPick: null,
      matchPick: null,
      showDecimalOdds: false,
      viewedTxs: 0,
      betHistory: []
    };
  }

  componentDidMount() {
    document.title = "Bet Page";
    this.getbetHistoryArray();
    setInterval(() => {
      this.findValues();
      //  this.getbetHistoryArray();
      //  this.checkRedeem();
    }, 1000);
    setInterval(() => {
      this.getbetHistoryArray();
    }, 5000)
  }

  handleBetSize(value) {
    this.setState({ betAmount: value });
  }

  handleBettorFund(value) {
    this.setState({
      fundAmount: value,
    });
  }

  handleBettorWD(value2) {
    this.setState({
      wdAmount: value2,

    });
  }

  async fundBettor(x) {
    try {
      const stackId = await this.contracts["BettingMain"].methods.fundBettor.cacheSend({
        from: this.props.accounts[0],
        value: this.state.fundAmount * 1e18,
      });
      console.log("stackid", stackId);
    } catch (error) { console.log("igotanerror", error) }
  }

  withdrawBettor(x) {
    this.contracts[
      "BettingMain"
    ].methods.withdrawBettor.cacheSend(this.state.wdAmount * 10000, {
      from: this.props.accounts[0],
    });
  }

  async takeBet() {
    const stackId = await this.contracts[
      "BettingMain"
    ].methods.bet.cacheSend(
      this.state.matchPick,
      this.state.teamPick,
      this.state.betAmount * 10000,
      {
        from: this.props.accounts[0],
      }
    );
    console.log("World", stackId)
  }

  redeemBet(x) {
    this.contracts["BettingMain"].methods.redeem.cacheSend(
      x,
      { from: this.props.accounts[0] }
    );
  }

  switchOdds() {
    this.setState({ showDecimalOdds: !this.state.showDecimalOdds });
  }

  openEtherscan(txhash) {
    // const url = "https://testnet.snowtrace.io/tx/" + txhash;
    const urltest = "https://testnet.snowtrace.io/tx/" + txhash;
    console.log("urleric", urltest);
    window.open(urltest, "_blank");
    this.setState({ viewedTxs: this.state.viewedTxs + 1 });
  }

  handletakeBookTeam(teamPick) {
    this.setState({ teamPick });
  }

  getbetHistoryArray() {
    const web3b = this.context.drizzle.web3;
    const contractweb3b = new web3b.eth.Contract(
      BettingContract.abi,
      BettingContract.address
    );
    var eventdata = [];
    var takes = {};

    contractweb3b
      .getPastEvents("BetRecord", {
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
              timestamp: Number(element.blockNumber.timestamp),
              BetSize: Number(element.returnValues.betAmount / 10000),
              //    Offer: element.returnValues.Offer,
              LongPick: Number(element.returnValues.pick),
              MatchNum: Number(element.returnValues.matchNum),
              Payoff: Number(0.95 * element.returnValues.payoff / 10000),

            });
            takes[element.returnValues.contractHash] = this.contracts[
              "BettingMain"
            ].methods.checkRedeem.cacheCall(element.returnValues.contractHash).toString();
          }, this);
          const betHistory = this.state.betHistory;
          betHistory[0] = eventdata;
          this.takekeys = takes;
          this.setState({ betHistory });
        }.bind(this)
      );
  }

  radioFavePick(teampic) {
    this.setState({ matchPick: teampic, teamPick: 0 });
  }

  radioUnderPick(teampic) {  
    this.setState({ matchPick: teampic, teamPick: 1 });
  }

  findValues() {
    this.betDataKey = this.contracts[
      "BettingMain"
    ].methods.showBetData.cacheCall();

    this.tokenKey = this.contracts["TokenMain"].methods.balanceOf.cacheCall(
      "0x2572eE2A871fCC586722C3E57d43831d78E7219c"
    );

    this.userBalKey = this.contracts[
      "BettingMain"
    ].methods.userBalance.cacheCall(this.props.accounts[0]);

    this.sharesKey = this.contracts["BettingMain"].methods.lpStruct.cacheCall(
      this.props.accounts[0]
    );

    this.marginKey0 = this.contracts["BettingMain"].methods.margin.cacheCall(0);

    this.marginKey1 = this.contracts["BettingMain"].methods.margin.cacheCall(1);

    this.marginKey2 = this.contracts["BettingMain"].methods.margin.cacheCall(2);

    this.marginKey3 = this.contracts["BettingMain"].methods.margin.cacheCall(3);

    this.marginKey4 = this.contracts["BettingMain"].methods.margin.cacheCall(4);

    this.marginKey5 = this.contracts["BettingMain"].methods.margin.cacheCall(5);

    this.marginKey6 = this.contracts["BettingMain"].methods.margin.cacheCall(6);

    this.marginKey7 = this.contracts["BettingMain"].methods.margin.cacheCall(7);

    this.scheduleStringKey = this.contracts[
      "OracleMain"
    ].methods.showSchedString.cacheCall();
  }

  getMaxSize(unused0, used0, climit0, long0) {
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

  render() {
    let subcontracts = {};
    Object.keys(this.takekeys).forEach(function (id) {
      if (
        this.takekeys[id] in this.props.contracts["BettingMain"].checkRedeem
      ) {
        subcontracts[id] = this.props.contracts["BettingMain"].checkRedeem[
          this.takekeys[id]
        ].value;
      }
    }, this);

    let concentrationLimit = 0;
    if (this.marginKey5 in this.props.contracts["BettingMain"].margin) {
      concentrationLimit = this.props.contracts["BettingMain"].margin[
        this.marginKey5
      ].value;
    }

    let currW4 = 0;
    if (this.marginKey3 in this.props.contracts["BettingMain"].margin) {
      currW4 = this.props.contracts["BettingMain"].margin[this.marginKey3]
        .value;
    }
    let usedCapital = "0";
    if (this.marginKey1 in this.props.contracts["BettingMain"].margin) {
      let usedCapital0 = this.props.contracts["BettingMain"].margin[
        this.marginKey1
      ].value;
      if (usedCapital0) {
        usedCapital = usedCapital0;
      }
    }

    let unusedCapital = "0";
    if (this.marginKey0 in this.props.contracts["BettingMain"].margin) {
      let unusedCapital0 = this.props.contracts["BettingMain"].margin[
        this.marginKey0
      ].value;
      if (unusedCapital0) {
        unusedCapital = unusedCapital0;
      }
    }

    let newBets = false;
    if (this.marginKey7 in this.props.contracts["BettingMain"].margin) {
      let newBets0 = this.props.contracts["BettingMain"].margin[
        this.marginKey7
      ].value;
      if (newBets0 != 2000000000) {
        newBets = true;
      }
    }
    // console.log("newBets", newBets);

    // let tokenAmount = "0";
    // if (this.tokenKey in this.props.contracts["TokenMain"].balanceOf) {
    //   let ta = this.props.contracts["TokenMain"].balanceOf[this.tokenKey].value;
    //   if (ta) {
    //     tokenAmount = ta;
    //   }
    // }

    let betData = [];
    if (this.betDataKey in this.props.contracts["BettingMain"].showBetData) {
      let st = this.props.contracts["BettingMain"].showBetData[this.betDataKey]
        .value;
      if (st) {
        betData = st;
      }
    }


    let scheduleString = ["check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a", "check later...: n/a: n/a"];

    let startTimeColumn = [1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932];

    let odds0 = [957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957];

    let odds1 = [957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957, 957];

    let liab0 = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    let liab1 = [-123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123, -123];




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

    let netLiab = [liab0, liab1];

    let xdecode = [0, 1, 2, 3, 4, 5, 6, 7];
    xdecode = this.unpack256(betData[0]);

    if (xdecode[6] > 0) {
      for (let ii = 0; ii < 32; ii++) {
        xdecode = this.unpack256(betData[ii]);
        odds0[ii] = Number(xdecode[6]);
        odds1[ii] = Number(xdecode[7]);
        startTimeColumn[ii] = xdecode[5];
        netLiab[0][ii] = (Number(xdecode[2]) - Number(xdecode[1])) / 10;
        netLiab[1][ii] = (Number(xdecode[3]) - Number(xdecode[0])) / 10;
      }
    }


    let oddsTot = [odds0, odds1];
    //console.log("subcon", subcontracts);
    //console.log("bethist", this.betHistory);

    let userBalance = "0";
    if (this.userBalKey in this.props.contracts["BettingMain"].userBalance) {
      let ub = this.props.contracts["BettingMain"].userBalance[this.userBalKey]
        .value;
      if (ub) {
        userBalance = ub / 10000;
      }
    }

    let teamSplit = [];
    let faveSplit = [];
    let underSplit = [];
    let sport = [];

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
              ? (1 + 95 * oddsTot[0][i] / 100000).toFixed(3)
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
              ? (1 + 95 * oddsTot[1][i] / 100000).toFixed(3)
              : this.getMoneyLine((95 * oddsTot[1][i]) / 100)}
          </td>
          <td>{moment.unix(startTimeColumn[i]).format("MMMDD-ha")}</td>
        </tr>
      );
    }

    // console.log("offers", oddsTot[1][1]);

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
                <Flex
                  mt="20px"
                  flexDirection="row"
                  justifyContent="space-between"
                ></Flex>
              </Box>
              <Box>
                <Flex>
                  <Text size="20px" color="#707070">
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
                      href="/bigbetpage"
                      target="_blank"
                    >
                      Go to Big Bet Page
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
                <Text>Your available margin: {Number(userBalance).toFixed(3)} ETH</Text>
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
                      backgroundColor: "#707070",
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

              {this.props.transactionStack.length > 0 &&
                this.state.viewedTxs < this.props.transactionStack.length &&
                this.props.transactionStack[
                  this.props.transactionStack.length - 1
                ].length === 66 ? (
                <Flex alignItems="center">
                  <ButtonEthScan
                    onClick={() =>
                      this.openEtherscan(
                        this.props.transactionStack[
                        this.props.transactionStack.length - 1
                        ]
                      )
                    }
                    style={{ height: "30px" }}
                  >
                    See Transaction Detail on Ethscan
                  </ButtonEthScan>
                </Flex>
              ) : null}
              <Box>
                <Flex>
                  {Object.keys(this.state.betHistory).map((id) => (
                    <div key={id} style={{ width: "100%", float: "left" }}>
                      <Text> Your active bets</Text>
                      <br />
                      <table style={{ width: "100%", fontSize: "12px" }}>
                        <tbody>
                          <tr style={{ width: "33%" }}>
                            <td>Epoch</td>
                            <td>Match</td>
                            <td>Pick</td>
                            <td>BetSize</td>
                            <td>DecOdds</td>
                          </tr>
                          {this.state.betHistory[id].map(
                            (event, index) => event.Epoch == currW4 && (
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
                                <td>
                                  {parseFloat(event.BetSize).toFixed(4)}
                                </td>
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
                  {Object.keys(this.state.betHistory).map((id) => (
                    <div key={id} style={{ width: "100%", float: "left" }}>
                      <Text size="15px">Active Epoch: {currW4}</Text>
                      <br />
                      <Text> Your unclaimed winning bets</Text>
                      <br />
                      <table
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          float: "left",
                        }}
                      >
                        <tbody>
                          <tr style={{ width: "33%" }}>
                            <td>Epoch</td>
                            <td>Match</td>
                            <td>Pick</td>
                            <td>Your Payout</td>
                            <td>Click to Claim</td>
                          </tr>
                          {this.state.betHistory[id].map(
                            (event, index) =>
                              //  (event.Epoch = currW4) &&
                              subcontracts[event.Hashoutput] && (
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
                                  <td>
                                    {(
                                      (event.Payoff +
                                        event.BetSize)
                                    ).toFixed(3)}
                                  </td>
                                  <td>
                                    <button
                                      style={{
                                        backgroundColor: "#707070",
                                        borderRadius: "2px",
                                        cursor: "pointer",
                                      }}
                                      value={event.Hashoutput}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.redeemBet(event.Hashoutput);
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
                    onChange={this.handleBettorFund}
                    value={this.state.fundAmount}
                    onSubmit={this.fundBettor}
                    mb="20px"
                    justifyContent="flex-start"
                    buttonWidth="95px"
                    inputWidth="100px"
                    borderRadius="2px"
                    placeholder="eth"
                    buttonLabel="Fund"
                  />
                </Box>
              </Flex>
            </Box>
          }
        >
          <Flex justifyContent="center">
            <Text size="25px">Place Bets Here</Text>
          </Flex>
          <Box mt="15px" mx="30px">
            <Flex width="100%" justifyContent="marginLeft">
              <Text size="14px" weight="300">
                {" "}
                Toggle radio button on the team/player you want to bet on to
                win. Enter eths bet in the box (eg, 1.123). Prior wins, tie, or
                cancelled bets are redeemable on the left panel. This sends eth
                directly to your eth address. Scroll down to see all of the
                week's contests.
              </Text>
            </Flex>
          </Box>

          <Box mt="15px" mx="30px"></Box>

          <Flex
            mt="10px"
            pt="10px"
            alignItems="center"
            style={{
              borderTop: `thin solid ${G}`,
            }}
          ></Flex>
          {this.state.teamPick != null ? (
            <Flex
              mt="5px"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Text size="16px" weight="400" style={{ paddingLeft: "10px" }}>
                Bet Amount
              </Text>

              <Input
                onChange={({ target: { value } }) => this.handleBetSize(value)}
                width="100px"
                placeholder={"Enter Eths"}
                marginLeft="10px"
                marginRignt="5px"
                value={this.state.betAmount}
              />
              <Box mt="10px" mb="10px">
                <Button
                  style={{
                    height: "30px",
                    width: "100px",
                    float: "right",
                    marginLeft: "5px",
                  }}
                  onClick={() => this.takeBet()}
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
              color: "#B0B0B0",
              fontSize: "12px",
            }}
          >
            {this.state.teamPick != null ? (
              <Text size="16px" weight="400">
                pick: {teamSplit[this.state.matchPick][this.state.teamPick + 1]}
                {"  "}
                Odds:{" "}
                {(
                  0.95 * oddsTot[this.state.teamPick][this.state.matchPick] / 1000 +
                  1
                ).toFixed(3)}
                {" (MoneyLine "}
                {this.getMoneyLine(
                  0.95 * oddsTot[this.state.teamPick][this.state.matchPick]
                )}
                {"),  "}
                MaxBet:{" "}
                {parseFloat(
                  this.getMaxSize(
                    unusedCapital,
                    usedCapital,
                    concentrationLimit,
                    netLiab[this.state.teamPick][this.state.matchPick]
                  ) / 1e3
                ).toFixed(2)}
                {"  "}
                opponent:{" "}
                {teamSplit[this.state.matchPick][2 - this.state.teamPick]}
                {"  "}
                Odds:{" "}
                {(
                  0.95 *
                  oddsTot[1 - this.state.teamPick][this.state.matchPick] / 1000 +
                  1
                ).toFixed(3)}
                {"  "}
                MoneyLine:{" "}
                {this.getMoneyLine(
                  0.95 * oddsTot[1 - this.state.teamPick][this.state.matchPick]
                )}
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

BetPagejs.contextTypes = {
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

export default drizzleConnect(BetPagejs, mapStateToProps);
