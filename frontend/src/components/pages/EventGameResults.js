import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { autoBind } from "react-extras";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import Oracle from "../../abis/Oracle.json";

class EventGameoutcomes extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);
    this.currentContract = this.props.routeParams.contract;
    this.contracts = context.drizzle.contracts;
    this.drizzle = context.drizzle;
    this.priceHistory = {};
  }

  componentDidMount() {
    document.title = "Match Result Event Logs";
    this.getgameHistoryArray();
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

  translateOutcome(x) {
    if (x === "2") {
      return "tie";
    } else if (x === "0") {
      return "team0";
    } else {
      return "team1";
    }
  }

  getgameHistoryArray() {
    const web3 = this.context.drizzle.web3;
    const contractweb3 = new web3.eth.Contract(Oracle.abi, Oracle.address);
    var pricedata = [];
    contractweb3
      .getPastEvents("ResultsPosted", {
        fromBlock: 2500000,
        toBlock: 'latest',
        //  filter: { posted: true },
      })
      .then(
        function (events) {
          events.forEach(function (element) {
            pricedata.push({
              timestamp: Number(element.blockNumber),
              outcome: element.returnValues.winner,
              Epoch: Number(element.returnValues.epoch),
              //    post1: element.returnValues.posted,
            });
          }, this);
          this.priceHistory = pricedata;
        }.bind(this)
      );
  }

  openEtherscan() {
    const url =
      "https://rinkeby.etherscan.io/address/0xF2a86D7F05d017e0A82F06Ee59b4098FE8B07826";
    window.open(url, "_blank");
  }

  render() {
    console.log("phist", this.priceHistory);


    if (Object.keys(this.priceHistory).length === 0)
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
            Time, epoch, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12,
            m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25,
            m26, m27, m28, m29, m30, m31
          </Text>{" "}
          <br />
          {this.priceHistory.map(
            (event) =>
              //      event.post1 && (
              <div>
                <Text size="12px" weight="200">
                  {" "}
                  {event.timestamp}, {event.Epoch}
                  {": "}{event.outcome[0]}, {event.outcome[1]},{" "}
                  {event.outcome[2]}, {event.outcome[3]}, {event.outcome[4]},{" "}
                  {event.outcome[5]}, {event.outcome[6]}, {event.outcome[7]},{" "}
                  {event.outcome[8]}, {event.outcome[9]}, {event.outcome[10]},{" "}
                  {event.outcome[11]}, {event.outcome[12]},{" "}
                  {event.outcome[13]}, {event.outcome[14]},{" "}
                  {event.outcome[15]}, {event.outcome[16]},{" "}
                  {event.outcome[17]}, {event.outcome[18]},{" "}
                  {event.outcome[19]}, {event.outcome[20]},{" "}
                  {event.outcome[21]}, {event.outcome[22]},{" "}
                  {event.outcome[23]}, {event.outcome[24]},{" "}
                  {event.outcome[25]}, {event.outcome[26]},{" "}
                  {event.outcome[27]}, {event.outcome[28]},{" "}
                  {event.outcome[29]}, {event.outcome[30]},{" "}
                  {event.outcome[31]}
                </Text>
                <br />
              </div>
            //    )
          )}
        </div>
      );
    }
  }
}

EventGameoutcomes.contextTypes = {
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

export default drizzleConnect(EventGameoutcomes, mapStateToProps);
