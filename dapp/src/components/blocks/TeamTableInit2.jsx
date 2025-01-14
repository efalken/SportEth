import React from "react";
import moment from "moment";

export default function TeamTableInit2({ teamSplit, startTimeColumn }) {
  let faveSplit = [];
  let underSplit = [];
  let sport = [];

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
          <th style={{ textAlign: "left" }}>Underdog</th>
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
              <td>{faveSplit[i]}</td>
              <td>{underSplit[i]}</td>
              <td>
                {moment
                  .unix(Number(startTimeColumn[i] + 300))
                  .format("MMMDD-ha")}
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}
