import React, { useEffect, useState } from "react";
import Text from "../basics/Text";
import { useAuthContext } from "../../contexts/AuthContext";
import moment from "moment";
import { indexerEndpoint } from "../../config";
import axios from "axios";

export default function EventOdds() {
  const { oracleContractReadOnly } = useAuthContext();
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    if (!oracleContractReadOnly) return;

    (async () => {
      const pricedata = [];
      const {
        data: { events },
      } = await axios.get(
        `${indexerEndpoint}/events/oracle/probSpreadDiv2Posted`
      );
      for (const event of events) {
        pricedata.push({
          Epoch: Number(event.epoch),
          time: Number(event.blockNumber),
          probSpread: event.probSpread,
        });
      }
      setPriceHistory(pricedata);
    })();
  }, [oracleContractReadOnly]);

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
              {": "} {(1 + Number(event.probSpread[0]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[1]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[2]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[3]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[4]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[5]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[6]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[7]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[8]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[9]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[10]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[11]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[12]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[13]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[14]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[15]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[16]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[17]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[18]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[19]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[20]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[21]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[22]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[23]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[24]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[25]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[26]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[27]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[28]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[29]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[30]) / 1000).toFixed(0)},{" "}
              {(1 + Number(event.probSpread[31]) / 1000).toFixed(0)}
            </Text>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
