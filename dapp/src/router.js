import Splash from "./components/pages/Splash";
import FAQ from "./components/pages/FAQ";
import BetPage from "./components/pages/BetPage";
import BigBetPage from "./components/pages/BigBetPage";
import BookiePage from "./components/pages/BookiePage";
import EventBetRecord from "./components/pages/EventBetRecord";
import EventBigBetRecord from "./components/pages/EventBigBetRecord";
import EventOdds from "./components/pages/EventOdds";
import EventSchedule from "./components/pages/EventSchedule";
import EventStartTime from "./components/pages/EventStartTime";
import EventGameResults from "./components/pages/EventGameResults";
import { createBrowserRouter } from "react-router-dom";
import AuthRequired from "./components/layout/AuthRequired";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Splash />,
  },
  { path: "/faqs", element: <FAQ /> },
  {
    path: "/betpage",
    element: (
      <AuthRequired>
        <BetPage />
      </AuthRequired>
    ),
  },
  {
    path: "/bigbetpage",
    element: (
      <AuthRequired>
        {" "}
        <BigBetPage />
      </AuthRequired>
    ),
  },
  {
    path: "/bookiepage",
    element: (
      <AuthRequired>
        <BookiePage />
      </AuthRequired>
    ),
  },
  { path: "/bethistory", element: <EventBetRecord /> },
  { path: "/bigbethistory", element: <EventBigBetRecord /> },
  { path: "/oddshistory", element: <EventOdds /> },
  { path: "/schedhistory", element: <EventSchedule /> },
  { path: "/starthistory", element: <EventStartTime /> },
  { path: "/resultshistory", element: <EventGameResults /> },
]);

export default router;
