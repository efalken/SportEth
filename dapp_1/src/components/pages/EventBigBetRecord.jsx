import React, { useState, useEffect } from "react";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import { useAuthContext } from "../../contexts/AuthContext";

export default function EventBigBetRecord() {
  const { bettingContractReadOnly } = useAuthContext();
  const [bigBetHistory, setBigBetHistory] = useState([]);

  useEffect(() => {
    if (!bettingContractReadOnly) return;

    (async () => {
      const pricedata = [];

      const OfferRecordEvent = bettingContractReadOnly.filters.OfferRecord();
      const events = await bettingContractReadOnly.queryFilter(
        OfferRecordEvent
      );
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          blockNumber: Number(blockNumber),
          Hashoutput: args.contractHash,
          BettorAddress: args.bettor,
          Epoch: Number(args.epoch),
          BetSize: Number(args.betAmount),
          Payoff: Number(args.payoff),
          LongPick: Number(args.pick),
          MatchNum: Number(args.matchNum),
        });
      }
      setBigBetHistory(pricedata);
    })();
  }, [bettingContractReadOnly]);

  function openEtherscan() {
    const url =
      "https://rinkeby.etherscan.io/address/0x131c66DC2C2a7D1b614aF9A778931F701C4945a1";
    window.open(url, "_blank");
  }

  console.log("bigbetHistory", bigBetHistory);
  if (Object.keys(bigBetHistory).length === 0)
    return (
      <Text size="20px" weight="200">
        Waiting...
      </Text>
    );
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
        Week, Match, Pick, BetSize, BettorAddress, Hash
      </Text>{" "}
      <br />
      {bigBetHistory.map((event) => (
        <div>
          <Text size="12px" weight="200">
            {" "}
            {event.Epoch}, {event.MatchNum}, {event.LongPick},{" "}
            {event.BetSize.toFixed(0)},{event.Payoff.toFixed(1)},{" "}
            {event.BettorAddress}, {event.Hashoutput},{" "}
          </Text>
          <br />
        </div>
      ))}
    </div>
  );
}
