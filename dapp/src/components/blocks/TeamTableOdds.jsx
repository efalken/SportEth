import React from "react";
import moment from "moment";
import { clightblue, cyellow } from "../basics/Colors";

export default function TeamTableOdds({
  teamSplit,
  startTimeColumn,
  showDecimalOdds,
  oddsTot,
  outcomev,
  subNumber,
  reviewStatus,
}) {
  let faveSplit = [];
  let underSplit = [];
  let outcome = [];
  let sport = [];
  var colorFave = "white";
  var colorUnd = "white";
  var colorOdds = "white";
  var colorStart = "white";
  var colorOutcome = "white";

  function getMoneyLineTable(decOddsi) {
    if (decOddsi < 1e4) {
      return (-1e6 / decOddsi).toFixed(0);
      //return decOddsi;
    } else {
      return Number((decOddsi - 1) / 1e2).toFixed(0);
    }
  }

  for (let i = 0; i < 32; i++) {
    if (teamSplit[i]) {
      sport[i] = teamSplit[i][0];
      outcome[i] = outcomev[i];
      faveSplit[i] = teamSplit[i][1];
      underSplit[i] = teamSplit[i][2];
    } else {
      sport[i] = "na";
      outcome[i] = "na";
      faveSplit[i] = "na";
      underSplit[i] = "na";
    }
  }

  if (reviewStatus && subNumber > 0) {
    colorFave = "#00ff00";
    colorUnd = "#00ff00";
    colorStart = "#00ff00";
  } else if (!reviewStatus && subNumber > 0) {
    colorOdds = "#00ff00";
  }

  const borderCells = 5;

  return (
    <table
      style={{
        width: "100%",
        borderRight: "1px solid",
        float: "left",
        borderCollapse: "collapse",
        fontSize: "14px",
      }}
    >
      <tbody className="style">
        <tr style={{ width: "50%", textAlign: "left" }}>
          <th>Match</th>
          <th style={{ color: colorOutcome }}>Sport</th>
          <th style={{ textAlign: "left", color: colorFave }}>Favorite</th>
          <th style={{ textAlign: "left", color: colorOdds }}>
            {showDecimalOdds ? "DecOdds" : "MoneyLine"}
          </th>
          <th style={{ textAlign: "left", color: colorUnd }}>Underdog</th>
          <th style={{ textAlign: "left", color: colorOdds }}>
            {showDecimalOdds ? "DecOdds" : "MoneyLine"}
          </th>
          <th style={{ textAlign: "left", color: colorStart }}>Start</th>
        </tr>

        {[...Array(32)].map((_value, i) => (
          <tr
            className={(i + 1) % borderCells === 0 ? "border-row" : ""}
            key={i}
            style={{ width: "60%", textAlign: "left" }}
          >
            <td>{i}</td>
            <td>{sport[i]}</td>
            <td>{faveSplit[i]}</td>
            <td>
              {showDecimalOdds
                ? (1 + (0.95 * oddsTot[0][i]) / 1e4).toFixed(3)
                : getMoneyLineTable(0.95 * oddsTot[0][i])}
            </td>
            <td>{underSplit[i]}</td>
            <td>
              {showDecimalOdds
                ? (1 + (0.95 * oddsTot[1][i]) / 1e4).toFixed(3)
                : getMoneyLineTable(0.95 * oddsTot[1][i])}
            </td>
            <td>
              {moment.unix(Number(startTimeColumn[i]) + 60).format("MMMDD-ha")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
