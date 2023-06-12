import React, { useEffect, useState, useContext } from "react";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import AuthContext from "../../contexts/AuthContext";
import moment from "moment";


export default function EventOdds() {
  const { oracleContractReadOnly } = useContext(AuthContext);
  const [priceHistory, setPriceHistory] = useState([]);
  
  useEffect(() => {
    if (!oracleContractReadOnly) return;

    (async () => {
      const pricedata = [];
      const DecOddsPostedEvent = oracleContractReadOnly.filters.DecOddsPosted();
      const events = await oracleContractReadOnly.queryFilter(
        DecOddsPostedEvent
      );
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          Epoch: Number(args.epoch),
          time: Number(blockNumber),
          decOdds: args.decOdds,
        });
      }
      setPriceHistory(pricedata);
    })();
  }, [oracleContractReadOnly]);

  console.log("decodds", priceHistory);


  if (Object.keys(priceHistory).length === 0)
    return (
      <Text size="20px" weight="200">
        Waiting...
      </Text>
    );
  else {
    return (
      <div>
        {/* <IndicatorD
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
        /> */}
        <Text size="12px" weight="200">
          {" "}
          Time, Week, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12,
          m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26,
          m27, m28, m29, m30, m31
        </Text>{" "}
        <br />
        {priceHistory.map((event) => (
          <div>
            <Text size="12px" weight="200">
              {" "}
              {moment.unix(event.time).format("DD-MM-YYTHH:mm")}, {event.Epoch}
              {": "} {(1 + Number(event.decOdds[0]) / 1000).toFixed(3)},{" "}
             {(1 + Number(event.decOdds[1]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[2]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[3]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[4]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[5]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[6]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[7]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[8]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[9]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[10]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[11]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[12]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[13]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[14]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[15]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[16]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[17]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[18]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[19]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[20]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[21]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[22]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[23]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[24]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[25]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[26]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[27]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[28]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[29]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[30]) / 1000).toFixed(3)},{" "}
              {(1 + Number(event.decOdds[31]) / 1000).toFixed(3)}  
            </Text>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
