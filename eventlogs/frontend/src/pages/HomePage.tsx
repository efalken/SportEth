import { Link } from "react-router-dom";

export default function HomePage({ events }: { events: any[] }) {
  return (
    <div className="container mx-auto">
      <div className="text-center">Select a event to view logs</div>
      <div className="">
        {events.map((event: any) => (
          <Link key={event.name} to={`/events/${event.name}`}>
            <div className="">{event.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
