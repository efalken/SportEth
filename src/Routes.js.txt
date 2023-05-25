import Splash from './components/pages/Splash'
import FAQ from './components/pages/FAQ'
import BetHistory from './components/pages/EventBetRecord'
import GameOutcomeHistory from './components/pages/EventGameResults'
import OddsHistory from './components/pages/EventOdds'
import SchedHistory from './components/pages/EventSchedule'
import StartHistory from './components/pages/EventStartTime'
import BetPage from './components/pages/BetPage'
import BigBetPage from './components/pages/BigBetPage'
import BigBetHistory from './components/pages/EventBigBetRecord'
import BookiePage from './components/pages/BookiePage';


const Routes = [
    { path: "/", component: Splash },
    { path: "/faqs", component: FAQ },
    { path: "/bethistory", component: BetHistory },
    { path: "/bigbethistory", component: BigBetHistory },
    { path: "/oddshistory", component: OddsHistory },
    { path: "/schedhistory", component: SchedHistory },
    { path: "/starthistory", component: StartHistory },
    { path: "/resultshistory", component: GameOutcomeHistory },
    { path: "/betpage", component: BetPage },
    { path: "/bigbetpage", component: BigBetPage },
    { path: "/bookiepage", component: BookiePage }
]

export default Routes
