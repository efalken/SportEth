import axios from "axios";
import { useEffect, useState } from "react";
import ListView from "../ListView";
import { BACKEND_ENDPOINT } from "../config";

export default function EventPage({
  contract,
  name,
  args,
}: {
  contract: string;
  name: string;
  args: string[][];
}) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { events: _events },
      } = await axios.get(`${BACKEND_ENDPOINT}/events/${contract}/${name}`);
      setEvents(_events);
    })();
  }, []);

  return (
    <div>
      <div className="">{name} Events</div>
      <div className="">
        <ListView args={args} events={events} />
      </div>
    </div>
  );
}
