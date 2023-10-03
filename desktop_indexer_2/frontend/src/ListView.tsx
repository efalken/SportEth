export default function ListView({
  args,
  events,
}: {
  events: any[];
  args: string[][];
}) {
  console.log(args);
  console.log(events);

  return (
    <table className="table-auto">
      <thead>
        <tr className="">
          {args.map((arg) => (
            <th key={arg[0]}>{arg[0]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={`${event.blockNumber}-${event.logIndex}`}>
            {args.map((arg) => (
              <td key={arg[0]}>{event[arg[0]].toString()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
