import React, { useContext, useEffect, useState } from "react";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import AuthContext from "../../contexts/AuthContext";
  
export default function EventBetRecord() {
  const [priceHistory, setPriceHistory] = useState([]);
  const { bettingContractReadOnly } = useContext(AuthContext);

  useEffect(() => {
    if (!bettingContractReadOnly) return;

    (async () => {
      const pricedata = [];
      const BetRecordEvent = bettingContractReadOnly.filters.BetRecord();
      const events = await bettingContractReadOnly.queryFilter(BetRecordEvent);
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          blockNumber: Number(blockNumber),
          Epoch: Number(args.epoch),
          //Offer: Boolean(args.Offer).toString(),
          //Offer: args.offer,
          //BetSize: args.betAmount,
          BetSize: Number(args.betAmount),
          LongPick: Number(args.pick),
          MatchNum: Number(args.matchNum),
          //Payoff: args.payoff,
          Payoff: Number(args.payoff),
          Hashoutput: args.contractHash,
          BettorAddress: args.bettor,
        });
      }
      setPriceHistory(pricedata);
    })();
  }, [bettingContractReadOnly]);

  function openEtherscan() {
    const url =
      "https://rinkeby.etherscan.io/address/0x131c66DC2C2a7D1b614aF9A778931F701C4945a1";
    window.open(url, "_blank");
  }

  if (Object.keys(priceHistory).length === 0)
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
          onClick={() => openEtherscan()}
          value="Etherscan"
        />
        <Text size="12px" weight="200">
          {" "}
          Time, Epoch, MatchNum, LongPick, Betsize, Payoff, BettorAddress,
          betHash
        </Text>{" "}
        <br />
        {priceHistory.map((event) => (
          <div>
            <Text size="12px" weight="200">
              {" "}
              {event.timestamp},{event.Epoch}, {event.MatchNum},{" "}
              {event.LongPick},{event.BetSize},{event.BettorAddress},{" "}
              {event.Hashoutput},{" "}
            </Text>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
