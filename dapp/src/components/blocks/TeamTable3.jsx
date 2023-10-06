import React from "react";
import moment from "moment";
import { clightblue, cyellow } from "../basics/Colors";

export default function TeamTable3({
  teamSplit,
  startTimeColumn,
  showDecimalOdds,
  oddsTot,
  getMoneyLine,
  outcomev,
  subNumber,
  reviewStatus,
}) {
  let faveSplit = [];
  let underSplit = [];
  let outcome = [];
  let sport = [];
  let winner = [];
  var colorFave = "white";
  var colorUnd = "white";
  var colorOdds = "white";
  var colorStart = "white";
  var colorOutcome = "white";

  for (let i = 0; i < 32; i++) {
    if (teamSplit[i]) {
      sport[i] = teamSplit[i][0];
      outcome[i] = outcomev[i];
      faveSplit[i] = teamSplit[i][1];
      underSplit[i] = teamSplit[i][2];
      winner[i] = teamSplit[i][outcomev[i] + 1];
    } else {
      sport[i] = "na";
      outcome[i] = "na";
      faveSplit[i] = "na";
      underSplit[i] = "na";
      winner[i] = "na";
    }
  }

  if (reviewStatus === 0 && subNumber > 0) {
    colorFave = "#00ff00";
    colorUnd = "#00ff00";
    colorOdds = "#00ff00";
    colorStart = "#00ff00";
  } else if (reviewStatus === 1 && subNumber > 0) {
    colorOdds = "#00ff00";
  } else if (reviewStatus === 2 && subNumber > 0) {
    colorOutcome = "#00ff00";
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
          <th style={{ color: colorOutcome }}>Winner</th>
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

        {[...Array(32)].map((_value, i) =>
          sport[i] !== "AAA" ? (
            <tr
              className={(i + 1) % borderCells === 0 ? "border-row" : ""}
              key={i}
              style={{ width: "60%", textAlign: "left" }}
            >
              <td>{i}</td>
              <td>{winner[i]}</td>
              <td>{faveSplit[i]}</td>
              <td>
                {showDecimalOdds
                  ? (1 + (95 * oddsTot[0][i]) / 100000).toFixed(3)
                  : getMoneyLine((95 * oddsTot[0][i]) / 100)}
              </td>
              <td>{underSplit[i]}</td>
              <td>
                {showDecimalOdds
                  ? (1 + (95 * oddsTot[1][i]) / 100000).toFixed(3)
                  : getMoneyLine((95 * oddsTot[1][i]) / 100)}
              </td>
              <td>past</td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}
