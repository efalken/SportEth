import "./App.css";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";

function App() {
  const supportedEvents = [
    {
      name: "probSpreadDiv2Posted",
      contract: "oracle",
      args: [
        ["epoch", "int"],
        ["propnum", "int"], 
        ["probSpread", "int[]"],
      ],
    },
    {
      name: "ResultsPosted",
      contract: "oracle",
      args: [
        ["epoch", "int"],
        ["propnum", "int"],
        ["winner", "int[]"],
      ],
    },
    {
      name: "SchedulePosted",
      contract: "oracle",
      args: [
        ["epoch", "int"],
        ["propnum", "int"],
        ["sched", "string[]"],
      ],
    },
    {
      name: "StartTimesPosted",
      contract: "oracle",
      args: [
        ["epoch", "int"],
        ["propnum", "int"],
        ["starttimes", "int[]"],
      ],
    },
  ];

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<HomePage events={supportedEvents} />} />
        {supportedEvents.map((event) => (
          <Route
            key={event.name}
            path={`/events/${event.name}`}
            element={
              <EventPage
                args={event.args}
                contract={event.contract}
                name={event.name}
              />
            }
          />
        ))}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
