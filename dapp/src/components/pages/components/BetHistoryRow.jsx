import { useContractRead } from "wagmi";
import {
  abi as bettingContractABI,
  address as bettingContractAddress,
} from "../../../abis/Betting.json";
import { useEffect, useState } from "react";

export default function BetHistoryRow({ contractHash, currW4, teamSplit }) {
  const betSubContract = useContractRead({
    abi: bettingContractABI,
    address: bettingContractAddress,
    functionName: "betContracts",
    args: [contractHash],
  });

  const redeemable = useContractRead({
    abi: bettingContractABI,
    address: bettingContractAddress,
    functionName: "checkRedeem",
    args: [contractHash],
  });

  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!betSubContract || !betSubContract.data || !redeemable) return;

    const [epoch, matchNum, pick, betAmount, payoff, bettor] =
      betSubContract.data;

    setEvent({
      epoch,
      matchNum,
      pick,
      betAmount,
      payoff,
      bettor,
      redeemable: redeemable.data,
    });
  }, [betSubContract?.data, redeemable?.data]);

  if (!event || event.epoch >= currW4) return <></>;

  return (
    <tr style={{ width: "33%", color: "#ffffff" }}>
      <td>{event.epoch}</td>
      <td>{teamSplit[event.matchNum][Number(event.pick) + 1]}</td>
      <td>
        {(
          (0.95 * Number(event.payoff) + Number(event.betAmount)) /
          10000
        ).toFixed(3)}
      </td>
      <td>{event.redeemable ? "yes" : "no"}</td>
    </tr>
  );
}
