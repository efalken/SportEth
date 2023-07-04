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
      const {
        data: { events },
      } = await axios.get(`${indexerEndpoint}/events/betting/OfferRecord`);
      for (const event of events) {
        pricedata.push({
          blockNumber: Number(event.blockNumber),
          Hashoutput: event.contractHash,
          BettorAddress: event.bettor,
          Epoch: Number(event.epoch),
          BetSize: Number(event.betAmount),
          Payoff: Number(event.payoff),
          LongPick: Number(event.pick),
          MatchNum: Number(event.matchNum),
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
