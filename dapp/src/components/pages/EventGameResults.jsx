import React, { useState, useContext, useEffect } from "react";
import Text from "../basics/Text";
import AuthContext from "../../contexts/AuthContext";
import moment from "moment";

export default function EventGameoutcomes() {
  const { oracleContractReadOnly } = useContext(AuthContext);
  const [priceHistory, setPriceHistory] = useState([][]);

  useEffect(() => {
    if (!oracleContractReadOnly) return;
    console.log(oracleContractReadOnly);
    (async () => {
      const pricedata = [];
      const ResultsPostedEvent = oracleContractReadOnly.filters.ResultsPosted();
      const events = await oracleContractReadOnly.queryFilter(
        ResultsPostedEvent
      );
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          timestamp: (blockNumber),
          outcome: Number(args.winner),
          Epoch: Number(args.epoch),
          outcome: args.winner,
        });
      }
      setPriceHistory(pricedata);
    })();
  }, [oracleContractReadOnly]);

  if (priceHistory.length === 0)
    return (
      <Text size="20px" weight="200">
        Waiting...
      </Text>
    );
    else {
  return (
    <div>
      <Text size="12px" weight="200">
        {" "}
        Time, epoch, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13,
        m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26, m27,
        m28, m29, m30, m31
      </Text>{" "}
      <br />
      {priceHistory.map(
        (event) => (
          <div>
            <Text size="12px" weight="200">
              {" "}
              {event.timestamp}, {event.Epoch}
              {": "}
              {Number(event.outcome[0])}{" "}, {Number(event.outcome[1])}{" "}, {Number(event.outcome[2])}{" "},
              {Number(event.outcome[3])}{" "}, {Number(event.outcome[4])}{" "}, {Number(event.outcome[5])}{" "},
              {Number(event.outcome[6])}{" "}, {Number(event.outcome[7])}{" "}, {Number(event.outcome[8])}{" "},
              {Number(event.outcome[9])}{" "}, {Number(event.outcome[10])}{" "}, {Number(event.outcome[11])}{" "},
              {Number(event.outcome[12])}{" "}, {Number(event.outcome[13])}{" "}, {Number(event.outcome[14])}{" "},
              {Number(event.outcome[15])}{" "}, {Number(event.outcome[16])}{" "}, {Number(event.outcome[17])}{" "},
              {Number(event.outcome[18])}{" "}, {Number(event.outcome[19])}{" "}, {Number(event.outcome[20])}{" "},
              {Number(event.outcome[21])}{" "}, {Number(event.outcome[22])}{" "}, {Number(event.outcome[23])}{" "},
              {Number(event.outcome[24])}{" "}, {Number(event.outcome[25])}{" "}, {Number(event.outcome[26])}{" "},
              {Number(event.outcome[27])}{" "}, {Number(event.outcome[28])}{" "}, {Number(event.outcome[29])}{" "},
              {Number(event.outcome[30])}{" "}, {Number(event.outcome[31])}
            </Text>
            <br />
          </div>
        )
        //    )
      )}
    </div>
  );
}
}
