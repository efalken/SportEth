import { useContractRead } from "wagmi";
import {
  abi as bettingContractABI,
  address as bettingContractAddress,
} from "../../../abis/Betting.json";
import { useEffect, useState } from "react";

export default function ActiveBetRow({ contractHash, currW4, teamSplit }) {
  const betSubContract = useContractRead({
    abi: bettingContractABI,
    address: bettingContractAddress,
    functionName: "betContracts",
    args: [contractHash],
  });

  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!betSubContract?.data) return;

    const [epoch, matchNum, pick, betAmount, payoff, bettor] =
      betSubContract.data;

    setEvent({
      epoch,
      matchNum,
      pick,
      betAmount,
      payoff,
      bettor,
    });
  }, [betSubContract?.data]);

  if (!event || event.epoch < currW4) return <></>;

  return (
    <tr style={{ width: "33%", color: "#ffffff" }}>
      <td>{teamSplit[event.matchNum][0]}</td>
      <td>{teamSplit[event.matchNum][Number(event.pick) + 1]}</td>
      <td>{(Number(event.betAmount) / 10000).toFixed(3)}</td>
      <td>
        {Number(
          (0.95 * Number(event.payoff)) / Number(event.betAmount) + 1
        ).toFixed(4)}
      </td>
    </tr>
  );
}
