import React, { useState, useContext, useEffect } from "react";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import AuthContext from "../../contexts/AuthContext";

export default function EventGameoutcomes() {
  const { oracleContractReadOnly } = useContext(AuthContext);
  const [priceHistory, setPriceHistory] = useState();

  useEffect(() => {
    if (!oracleContractReadOnly) return;

    (async () => {
      const pricedata = [];

      const ResultsPostedEvent = oracleContractReadOnly.filters.ResultsPosted();
      const events = await oracleContractReadOnly.queryFilter(
        ResultsPostedEvent
      );
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          timestamp: Number(blockNumber),
          outcome: args.winner,
          Epoch: Number(args.epoch),
        });
      }
      setPriceHistory(pricedata);
    })();
  }, [oracleContractReadOnly]);

  console.log("phist", priceHistory);

  if (Object.keys(priceHistory).length === 0)
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
        Time, epoch, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13,
        m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26, m27,
        m28, m29, m30, m31
      </Text>{" "}
      <br />
      {priceHistory.map(
        (event) => (
          //      event.post1 && (
          <div>
            <Text size="12px" weight="200">
              {" "}
              {event.timestamp}, {event.Epoch}
              {": "}
              {event.outcome[0]}, {event.outcome[1]}, {event.outcome[2]},{" "}
              {event.outcome[3]}, {event.outcome[4]}, {event.outcome[5]},{" "}
              {event.outcome[6]}, {event.outcome[7]}, {event.outcome[8]},{" "}
              {event.outcome[9]}, {event.outcome[10]}, {event.outcome[11]},{" "}
              {event.outcome[12]}, {event.outcome[13]}, {event.outcome[14]},{" "}
              {event.outcome[15]}, {event.outcome[16]}, {event.outcome[17]},{" "}
              {event.outcome[18]}, {event.outcome[19]}, {event.outcome[20]},{" "}
              {event.outcome[21]}, {event.outcome[22]}, {event.outcome[23]},{" "}
              {event.outcome[24]}, {event.outcome[25]}, {event.outcome[26]},{" "}
              {event.outcome[27]}, {event.outcome[28]}, {event.outcome[29]},{" "}
              {event.outcome[30]}, {event.outcome[31]}
            </Text>
            <br />
          </div>
        )
        //    )
      )}
    </div>
  );
}
