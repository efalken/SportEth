import React from "react";
import moment from "moment";

export default function TeamTable({
  teamSplit,
  startTimeColumn,
  radioFavePick,
  showDecimalOdds,
  oddsTot,
  radioUnderPick,
}) {
  let faveSplit = [];
  let underSplit = [];
  let sport = [];
  let bettingOver = "no new bets";

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
          <th>Sport</th>
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
        {[...Array(32)].map((_value, i) =>
          sport[i] !== "AAA" ? (
            <tr
              className={(i + 1) % borderCells === 0 ? "border-row" : ""}
              key={i}
              style={{ width: "60%", textAlign: "left" }}
            >
              <td>{i}</td>
              <td>{sport[i]}</td>
              <td style={{ textAlign: "left", paddingLeft: "2px" }}>
                {startTimeColumn[i] > moment().unix() ? (
                  <input
                    type="radio"
                    value={i}
                    name={"teamRadio"}
                    onChange={({ target: { value } }) => radioFavePick(value)}
                    className="teamRadio"
                  />
                ) : (
                  <span className="circle"></span>
                )}{" "}
                {faveSplit[i]}
              </td>
              <td>
                {showDecimalOdds
                  ? (1 + (0.95 * oddsTot[0][i]) / 1e4).toFixed(3)
                  : getMoneyLineTable(0.95 * oddsTot[0][i])}
              </td>
              <td style={{ textAlign: "left", paddingLeft: "2px" }}>
                {startTimeColumn[i] > moment().unix() ? (
                  <input
                    type="radio"
                    value={i}
                    name={"teamRadio"}
                    onChange={({ target: { value } }) => radioUnderPick(value)}
                    className="teamRadio"
                  />
                ) : (
                  <span className="circle"></span>
                )}{" "}
                {underSplit[i]}
              </td>
              <td>
                {showDecimalOdds
                  ? (1 + (0.95 * oddsTot[1][i]) / 1e4).toFixed(3)
                  : getMoneyLineTable(0.95 * oddsTot[1][i])}
              </td>
              <td>
                {startTimeColumn[i] < moment().unix()
                  ? bettingOver
                  : moment
                      .unix(Number(startTimeColumn[i] + 300))
                      .format("ddd h:mm a")}
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}
