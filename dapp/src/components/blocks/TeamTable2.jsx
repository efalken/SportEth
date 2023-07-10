import React from "react";
import moment from "moment";

export default function TeamTable2({
  teamSplit,
  startTimeColumn,
  showDecimalOdds,
  oddsTot,
  getMoneyLine,
  outcomev,
  getOutcome,
}) {
  let faveSplit = [];
  let underSplit = [];
  let sport = [];


  for (let i = 0; i < 32; i++) {
    if (teamSplit[i]) {
      sport[i] = outcomev[i];
      faveSplit[i] = teamSplit[i][1];
      underSplit[i] = teamSplit[i][2];
    } else {
      sport[i] = "na";
      faveSplit[i] = "na";
      underSplit[i] = "na";
    }
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
          <th>Fave Outcome</th>
          <th style={{ textAlign: "left" }}>Favorite</th>
          <th style={{ textAlign: "left" }}>
            {showDecimalOdds ? "DecOdds" : "MoneyLine"}
          </th>
          <th style={{ textAlign: "left" }}>Underdog</th>
          <th style={{ textAlign: "left" }}>
            {showDecimalOdds ? "DecOdds" : "MoneyLine"}
          </th>
          <th style={{ textAlign: "left" }}>Start</th>
        </tr>
        {[...Array(32)].map((_value, i) => (
          <tr
            className={(i + 1) % borderCells === 0 ? "border-row" : ""}
            key={i}
            style={{ width: "60%", textAlign: "left" }}
          >
            <td>{i}</td>
            <td>{getOutcome(sport[i])}</td>
            <td>{faveSplit[i]}
            </td>
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
            <td>{moment.unix(startTimeColumn[i]).format("MMMDD-ha")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
