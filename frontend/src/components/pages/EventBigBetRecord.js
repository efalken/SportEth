import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { autoBind } from "react-extras";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import BettingContract from "../../abis/Betting.json";

class EventBigBetRecord extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);
    this.currentContract = this.props.routeParams.contract;
    this.contracts = context.drizzle.contracts;
    this.drizzle = context.drizzle;
    this.bigBetHistory = {};
  }

  componentDidMount() {
    document.title = "Big Bet Event Logs";
    this.getbetHistoryArray();
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + "/" + month + "/" + year + " " + hour + ":" + min;
    return time;
  }

  getbetHistoryArray() {
    const web3 = this.context.drizzle.web3;
    const contractweb3 = new web3.eth.Contract(
      BettingContract.abi,
      BettingContract.address
    );
    //console.log("add", BettingContract.address);
    var pricedata = [];
    contractweb3
      .getPastEvents("OfferRecord", {
        fromBlock: 2500000,
        toBlock: 'latest',
      })
      .then(
        function (events) {
          events.forEach(function (element) {
            pricedata.push({
              Hashoutput: element.returnValues.contractHash,
              BettorAddress: element.returnValues.bettor,
              Epoch: Number(element.returnValues.epoch),
              time: Number(element.blockNumber),
              BetSize: Number(element.returnValues.betAmount),
              LongPick: Number(element.returnValues.pick),
              MatchNum: Number(element.returnValues.matchNum),
            });
          }, this);
          this.bigBetHistory = pricedata;
        }.bind(this)
      );
  }

  openEtherscan() {
    const url =
      "https://rinkeby.etherscan.io/address/0x131c66DC2C2a7D1b614aF9A778931F701C4945a1";
    window.open(url, "_blank");
  }

  render() {
    console.log("bigbetHistory", this.bigBetHistory);
    if (Object.keys(this.bigBetHistory).length === 0)
      return (
        <Text size="20px" weight="200">
          Waiting...
        </Text>
      );
    else {
      return (
        <div>
          <IndicatorD
            className="etherscanLink"
            size="15px"
            mr="10px"
            mb="10px"
            ml="5px"
            mt="10px"
            width="360px"
            label="See Contract on"
            onClick={() => this.openEtherscan()}
            value="Etherscan"
          />
          <Text size="12px" weight="200">
            {" "}
            Week, Match, Pick, BetSize, BettorAddress, Hash
          </Text>{" "}
          <br />
          {this.bigBetHistory.map((event) =>
            <div>
              <Text size="12px" weight="200">
                {" "}
                {event.Epoch}, {event.MatchNum}, {event.LongPick},{" "}
                {event.BetSize.toFixed(3)}, {event.BettorAddress},{" "}
                {event.Hashoutput}, {" "}
              </Text>
              <br />
            </div>
          )}
        </div>
      );
    }
  }
}

EventBigBetRecord.contextTypes = {
  drizzle: PropTypes.object,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
  };
};

export default drizzleConnect(EventBigBetRecord, mapStateToProps);
