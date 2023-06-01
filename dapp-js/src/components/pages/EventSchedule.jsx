import React, { useEffect, useState, useContext } from "react";
import Text from "../basics/Text";
import { Box, Flex } from "@rebass/grid";
import AuthContext from "../../contexts/AuthContext";

export default function EventSchedule() {
  const { oracleContractReadOnly } = useContext(AuthContext);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    if (!oracleContractReadOnly) return;

    (async () => {
      const SchedulePostedEvent =
        oracleContractReadOnly.filters.SchedulePosted();
      const events = await oracleContractReadOnly.queryFilter(
        SchedulePostedEvent
      );
      for (const event of events) {
        const { args, blockNumber } = event;
        pricedata.push({
          games: args.sched,
          Epoch: args.epoch,
          time: Number(blockNumber),
        });
      }
      setMatchHistory(pricedata);
    })();
  }, [oracleContractReadOnly]);

  if (Object.keys(matchHistory).length === 0)
    return (
      <Text size="20px" weight="200">
        Waiting...
      </Text>
    );
  else {
    return (
      <div>
        <Text size="20px">
          <a
            className="nav-header"
            style={{
              cursor: "pointer",
            }}
            href="/"
          >
            Back
          </a>
        </Text>
        <Box mt="15px" mx="30px">
          <Flex width="100%" justifyContent="marginLeft">
            <Text size="14px" weight="300">
              {" "}
              These event logs are created with every new epoch. Their order is
              consistent with the odds, results, and start time orders. Each
              item represents a match, and has the format
              "sport:homeTeam:awayTeam". Thus to validate the oracle, apply the
              most recent schedule data listed here to odds, results, and start
              times.
            </Text>
          </Flex>
        </Box>
        <br />
        <Text size="12px" weight="200">
          {" "}
          Time, Week, match0, match1, match2, match3, match4, match5, match6,
          match7, match8, match9, match10, match11, match2, match13, match14,
          match15, match16, match17, match18, match19, match20, match21,
          match22, match23, match24, match25, match26, match27, match28,
          match29, match30, match31
        </Text>{" "}
        <br />
        {matchHistory.map((event) => (
          //          event.post1 && (
          <div>
            <Text size="12px" weight="200">
              {" "}
              {event.time}, ,{event.Epoch},{event.games[0]},{event.games[1]},
              {event.games[2]},{event.games[3]},{event.games[4]},
              {event.games[5]},{event.games[6]},{event.games[7]},
              {event.games[8]},{event.games[9]},{event.games[10]},
              {event.games[11]},{event.games[12]},{event.games[13]},
              {event.games[14]},{event.games[15]},{event.games[16]},
              {event.games[17]},{event.games[18]},{event.games[19]},
              {event.games[20]},{event.games[21]},{event.games[22]},
              {event.games[23]},{event.games[24]},{event.games[25]},
              {event.games[26]},{event.games[27]},{event.games[28]},
              {event.games[29]},{event.games[30]},{event.games[31]}
            </Text>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
