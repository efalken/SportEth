import React, { useEffect, useState } from "react";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import { useAuthContext } from "../../contexts/AuthContext";

export default function EventBetRecord() {
  const [priceHistory, setPriceHistory] = useState([]);
  const { bettingContractReadOnly } = useAuthContext();

  useEffect(() => {
    if (!bettingContractReadOnly) return;

    (async () => {
      const pricedata = [];
      const {
        data: { events },
      } = await axios.get(`${indexerEndpoint}/events/betting/BetRecord`);
      for (const event of events) {
        pricedata.push({
          blockNumber: Number(event.blockNumber),
          Epoch: Number(event.epoch),
          //Offer: Boolean(event.Offer).toString(),
          //Offer: event.offer,
          //BetSize: event.betAmount,
          BetSize: Number(event.betAmount),
          LongPick: Number(event.pick),
          MatchNum: Number(event.matchNum),
          //Payoff: event.payoff,
          Payoff: Number(event.payoff),
          Hashoutput: event.contractHash,
          BettorAddress: event.bettor,
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
