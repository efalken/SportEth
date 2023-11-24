import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Icon from "../basics/Icon";
import Logo from "../basics/Logo";
import { Black, G } from "../basics/Colors";
import Text from "../basics/Text";

import bettorFund from "../../assets/media/30839efc9a9798f3ed3a599478586920.gif";
import bettorWD from "../../assets/media/a47621a42e8af1b8b995d349ad3feddd.gif";
import claimRewards from "../../assets/media/4d6a8cb7b986a87bc5d4c174454e7f02.gif";
import LPexposure from "../../assets/media/4f278544f60a28920649cef53dc9cd7d.png";
import LPfund from "../../assets/media/252d0fcb378d2a08da1268a9d8db43a3.gif";
import LPshareVal from "../../assets/media/96fc6a4340df566966d9524061b3cdef.png";
import LPWD from "../../assets/media/3bae482de52c8023a43be5d6484316e7.gif";
import maxBet from "../../assets/media/2418fc8e423ecdc18c4180e86179dadd.png";
import noRedeem from "../../assets/media/5d154464d5d9b8b7044c9947a2b55740.png";
import oracleAcctState from "../../assets/media/41e6514f259cf0bea7660928f2a5966d.png";
import oracleKState from "../../assets/media/5567ba8d59306412ac4389b0f5fc1188.png";
import placeBet from "../../assets/media/c10518bc72a739a5b642033d2fa0d75e.gif";
import redeem from "../../assets/media/09b972eb336758e7cd077735c4ee63eb.gif";
import yesRedeem from "../../assets/media/6bf927c46c070f047e82bbae9e29997d.png";

import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function FAQ() {
  document.title = "FAQs";
  return (
    <>
      <Split
        page={"FAQ"}
        side={
          <Box mt="30px" ml="25px" mr="30px">
            <div style={{ display: "flex", background: Black }}>
              <Icon />
              <Logo />
            </div>
            <Box>
              <Flex
                mt="20px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
              <Flex style={{ borderTop: `thin solid ${G}` }}></Flex>
            </Box>
            <Box>
              <Flex
                mt="20px"
                flexdirection="row"
                justifycontent="space-between"
              ></Flex>
            </Box>
          </Box>
        }
      ></Split>
      <div style={{ color: "black" }}>
        <Box>
          <Flex width="100%" alignitems="center" justifycontent="marginLeft">
            <Text size="16px">
              <Link
                className="nav-header"
                style={{
                  // textDecoration: "none",
                  cursor: "pointer",
                  color: "#00004d",
                  fontStyle: "italic",
                }}
                to="/betpage"
              >
                Back to Betting Page
              </Link>
            </Text>
          </Flex>
        </Box>
        <h2 id="topofpage">Links go to bookmarks on this page</h2>

        <p>
          <HashLink to="#howtobet">How to bet</HashLink>
          <br />
          <HashLink to="#howtoredeemyourbets">How to redeem your bets</HashLink>
          <br />
          <HashLink to="#howtowithdrawfromyourbettingaccount">
            How to withdraw from your betting account
          </HashLink>
          <br />
          <HashLink to="#betsizelimit">bet size limit</HashLink>
          <br />
          <HashLink to="#howtoinvestinthehouse">
            How to invest in the house
          </HashLink>
          <br />
          <HashLink to="#withdrawingaslp">Withdrawing as LP</HashLink>
          <br />
          <HashLink to="#howtoclaimoracletokenrewards">
            How to claim Oracle Token Rewards
          </HashLink>
          <br />
          <HashLink to="#oraclepageexplainer">Oracle page explainer</HashLink>
          <br />
          <HashLink to="#bettingrestrictions">Betting Restrictions</HashLink>
          <br />
          <HashLink to="#lprestrictions">LP Restrictions</HashLink>
          <br />
          <HashLink to="#oddsrestrictions">Odds Restrictions</HashLink>
          <br />
          <HashLink to="#oddstranslation">Odds Translation</HashLink>
          <br />
          <HashLink to="#oddsinthecontract">Odds in the contract</HashLink>
          <br />
          <HashLink to="#lpaccounting">LP Accounting</HashLink>
          <br />
          <HashLink to="#oracleaccounting">Oracle Accounting</HashLink>
        </p>
        <h2 id="howtobet">How to bet.</h2>
        <p>
          Betting can only occur once the oracle has voted on the odds. This
          should happen around 10 am NY Time, Friday (potentially Saturday,
          depending on data rejections). It can also only happen before the game
          starts.
        </p>
        <p>
          To bet, you first need to deposit money into the contract. Bettors and
          LPs only use native avax, so no token approvals are needed to fund the
          contract (one click). Users can deposit and withdraw from their
          betting accounts at any time.
        </p>
        <p>
          <strong>Funding to bet</strong>
        </p>
        <p>
          <strong>
            <img src={bettorFund} alt="" />
          </strong>
        </p>
        <p>
          A bet removes avax from a bettor's account and is unavailable for
          withdrawals or other bets. If you win, you receive your bet and payoff
          after redeeming your bets. To bet, you toggle on the yellow circle of
          the team/player you think will win, enter the amount of avax you wish
          to bet in the above box, and click the 'bet now' button (yellow
          buttons are for doing stuff; white is just information).
        </p>
        <p>
          <strong>Betting</strong>
        </p>
        <strong>
          <img src={placeBet} alt="" />
        </strong>
        <h2 id="howtoredeemyourbets">How to redeem your bets</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          An account can have up to 16 active and unredeemed old bets (whether
          wins or losses), after which no further bets can be made until they
          are redeemed. Redemptions can only occur when a bettor has no active
          bets, so a bettor should redeem his bets after settlement if he
          anticipates betting again. At settlement, a bets hash refers to a
          struct containing this information, and a mapping generated at
          settlement allows redemption. Users redeem bets by clicking a single
          button (it is one transaction). All unredeemed bets in a user's
          account are redeemed in a redemption.
        </p>
        <p>
          <strong>Redeeming</strong>
        </p>
        <p>
          <strong>
            <img src={redeem} alt="redeeming" />
          </strong>
        </p>
        <p>
          If you have active bets (below), you cannot withdraw. If all of your
          bets are settled, the redeem button is displayed. Click once to redeem
          all bets. At 16 unredeemed bets, the user must redeem so the account
          can bet again. One can redeem whenever. Funds do not disappear if
          never claimed.
        </p>
        <p>
          Here the redeem button is hidden because the user cannot redeem due to
          active bets.
        </p>
        <p>
          <strong>
            <img src={noRedeem} alt="" />
          </strong>
        </p>
        <p>
          Here the user has no active bets, so the redeem button is presented.
        </p>
        <p>
          <strong>
            <img src={yesRedeem} alt="" />
          </strong>
        </p>
        <h2 id="howtowithdrawfromyourbettingaccount">
          How to withdraw from your betting account
        </h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Enter how much avax you wish to withdraw and click enter.</p>
        <p>
          <strong>Withdraw after betting</strong>
        </p>
        <p>
          <strong>
            <strong>
              <img src={bettorWD} alt="" />
            </strong>
          </strong>
        </p>
        <h2 id="betsizelimit">bet size limit</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          Two constraints limit bet size. One is the amount of free LP capital
          remaining as if nothing is left; no one can bet until bettors take the
          other side of maxed out contests. This is because a new bettor on the
          other side replaces LP capital, allowing it to back different
          contests. The other constraint is an exogenous limit of the LP's total
          capital divided by a constant, which prevents a single contest from
          using all the LP capital, which would also expose the LPs to
          significant risk. The limit is presented under 'MaxBet", and any bets
          sent for that amount or above will be rejected.
        </p>
        <p>
          <strong>MaxBet presented in Gui</strong>
        </p>
        <p>
          <strong>
            <img src={maxBet} alt="" />
          </strong>
        </p>
        <h2 id="howtoinvestinthehouse">How to invest in the house</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          LP funding and withdrawals can only be made when betting is not
          active. Betting is active when the odds are sent to the betting
          contract after voting. This will be around 10 am NY time on Tuesday
          through 10 am NY Friday, though these can move by a day in either
          direction. Thursday, Friday, or Saturday. It only uses native avax, so
          no token approval is needed. Just click the amount you want to deposit
          and click 'fund.'
        </p>
        <p>
          <strong>Funding as an LP</strong>
        </p>
        <p>
          <strong>
            <img src={LPfund} alt="" />
          </strong>
        </p>
        <h2 id="withdrawingaslp">Withdrawing as LP</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          If you invest 123.45 avax, it is translated into 'shares' representing
          your pro-rata ownership of the total LP capital, which will look
          nothing like 123.45. The user has 300k of 416k shares, or 72%, in the
          case below. It is multiplied by the total LP capital amount of 50.35,
          which gets you to 36.2 avax.
        </p>
        <p>
          Copy and paste from the LP share box, but remove the comma. There are
          no decimals for shares; shares are nonfungible and nontradeable.
        </p>
        <p>
          <strong>
            <img src={LPWD} alt="" />
          </strong>
        </p>

        <h2 id="howtoclaimoracletokenrewards">
          How to claim Oracle Token Rewards
        </h2>
        <p>
          The betting contract contains 50% of the lifetime supply of tokens,
          which are allotted weekly based on pro-rata LP size (e.g., if you are
          33% of the LP liquidity, you get 33% of the token rewards that week).
          This gets immediately sent to your EOA (i.e., check MetaMask and
          import the token). Users need 10k tokens to deposit in the oracle
          contract to earn oracle dividends. Someone should create a vault
          contract to aggregate smaller token holders (alternatively, sell
          them). Once tokens are claimed, an LP cannot withdraw until after
          settlement.
        </p>
        <p>
          <strong>LP claiming rewards</strong>
        </p>
        <p>
          <strong>
            <img src={claimRewards} alt="" />
          </strong>
        </p>
        <p>LP exposure</p>
        <p>
          The LP page tells the LPs their exposure to various contests. The raw
          bets are in the first two columns, and the net liability to the LPs is
          how much they would owe if the favorite or underdog wins. Thus,
          positive is bad for the LPs, negative good; the liability is positive
          if the LPs pay out on a win. The net liability is the total payout to
          the bettors, minus the bettors initial bet (which doesn’t come from
          the LPs), and minus the bet amount on the opponent (which would be
          revenue for the LPs).
        </p>
        <p>
          <strong>
            <img src={LPexposure} alt="" />
          </strong>
        </p>
        <h2 id="oraclepageexplainer">Oracle page explainer</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          The oracle page gives all users more information about the contract's
          state. I initially thought it would be a portal for oracle
          transactions, but decided oracle depositors should use automated
          methods, like my Python programs. The information is still potentially
          useful for the oracle.
        </p>
        <p>
          <strong>Contract State</strong> refers to parameters independent of
          any user.
        </p>
        <p>
          <strong>Last submitter</strong> is the last account to send oracle
          data. Accounts cannot send consecutive oracle data submissions. This
          is to encourage all oracle accounts to prepare data, which is helpful
          to validate submissions even when not sending (no waste!).
        </p>
        <p>
          <strong>Concentration factor</strong> sets a ceiling on how much LP
          exposure is to any match. For example, if the total LP capital is 15,
          and the concentration factor is 10, the most the house can lose in any
          contest is 1.5.
        </p>
        <p>
          <strong>ReviewStatus</strong> is a boolean in the oracle contract that
          tracks whether the next submission is "odds" or "settleRefresh." When
          true, a settleRefresh submission is next; when false an odds
          submission is next. It changes when the submission is processed.
        </p>
        <p>
          <strong>BettingActive</strong> is a boolean in the betting contract
          and is true when odds are sent to the betting contract, and false when
          the outcomes and new schedule are sent.
        </p>
        <p>
          <strong>subNumber</strong> is the submission number. An initial
          submission takes this to 1; that same agent can resubmit if he
          discovers an error. Additional submissions generate event logs, and
          the submission number is presented. Only the last submission is voted
          on and potentially sent to the betting contract.
        </p>
        <p>
          <strong>current epoch</strong> is the current week. Linking event logs
          by epoch is necessary for auditing, and the epoch is also essential in
          mapping an event to its outcome.
        </p>
        <p>
          <strong>Current prop number</strong>. This number increments with each
          data submission. If everything goes well, there will be increments in
          a week. This makes it easy to see which oracle accounts have voted is
          used to calculate an oracle account's voting frequency.
        </p>
        <p>
          <strong>
            <img src={oracleKState} alt="" />
          </strong>
        </p>
        <p>
          Connected Account State presents data for the viewer's oracle account.
        </p>
        <p>
          <strong>Base prop number</strong> is the propNumber when the account
          last claimed ether.
        </p>
        <p>
          <strong>Probation</strong> number tracks if a user sends bad data. If
          the accounts proposal is rejected, it is put into a "time out": they
          cannot withdraw or send oracle submissions for 3 epochs. This is to
          prevent a single, mischievous account from monopolizing the contract.
          Such a person would be unable to stop a majority from administering
          the contract as intended.
        </p>
        <p>
          <strong>Probation2</strong> tracks if an oracle account changed the
          concentration factor or halted betting on a single match. It limits
          accounts to one such change per epoch, and users cannot withdraw until
          the next epoch. This prevents a malicious account from turning the
          slate off.
        </p>
        <p>
          <strong>Last vote</strong> tells the oracle account the last proposal
          they voted on.
        </p>
        <p>
          <strong>Total votes</strong> is the number of votes by this account
          since their last ether claim. Total votes divided by the number of
          proposals since the last ether claim gives the percentage used to
          adjust an oracle account's earnings.
        </p>
        <p>
          <strong>Voting record</strong> puts the voting into percentages, so
          they know what to expect when claiming avax.
        </p>
        <p>
          <strong>Tokens in EOA</strong> tell the user how many tokens their
          account currently has in their wallet, off the contract.
        </p>
        <p>
          <strong>
            <img src={oracleAcctState} alt="" />
          </strong>
        </p>

        <h2 id="bettingrestrictions">Betting Restrictions</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <h3 id="-1"> </h3>
        <h3 id="minbetsize1avax">Min bet size 1 avax</h3>
        <p>
          While testing with trace amounts can be fun, there are DDOS-type of
          risks generated by allowing trace-amount transactions.
        </p>
        <h3 id="nobettingafterthegamestarttime">
          No betting after the game start time
        </h3>
        <p>
          A match with fixed odds is easier to bet on when it is partially
          completed. The ambiguity of block time is insignificant to this
          requirement, as a mere couple of seconds would not expose the contract
          to risk. Oracles should be aware that times for MMA fights are often
          wrong by 2 or 3 hours, so check multiple sources, especially when
          these are in Dubai.
        </p>
        <h3 id="betsconstrainedbybookiecapital">
          bets constrained by bookie capital
        </h3>
        <ul>
          <li>
            ex-ante limit of LPcapital/x per match, where x is a number the
            oracle chooses. For example, if x=10 and total capital were 100,
            then the LPs would have at most 10 avax at risk to any one event. X
            must be between 2 and 16.
            <ul>
              <li>
                If 10 units were available, and the concentration parameter was
                set to 5, then five matches could have 2 units of exposure to
                the LPs and use up all of the LP capital. A further bet of 1
                unit would not be possible because no more free LP capital would
                be left. If bettors take the other side of the bet this frees up
                LP capital, betting would then be feasible again.
              </li>
            </ul>
          </li>
        </ul>
        <h2 id="lprestrictions">LP Restrictions</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <h3 id="lpsarechargeda1feeiftheywithdrawinthesameepoch">
          LPs are charged a 1% fee if they withdraw in the same epoch
        </h3>
        <p>
          If LPs could deposit and withdraw quickly without a fee, some LPs
          might find it profitable to scare away other LPs by depositing large
          amounts to discourage other LPs, who would see low expected returns
          given a large capital base. Once scared away, the malicious LP would
          withdraw capital to make the return attractive. This tactic would not
          help the LP collective, so this tactic is explicitly discouraged via
          this fee.
        </p>
        <h3 id="lpscannotwithdrawinthesameepochtheyclaimtokenrewards">
          LPs cannot withdraw in the same epoch they claim token rewards
        </h3>
        <p>
          This prevents LPs from claiming rewards multiple times. There is a
          fixed amount of token rewards in the betting contract, and 3k are
          distributed each week until they are gone. Thus, if 50% of LP tokens
          do not claim their reward tokens, they are effectively pushed out to
          later weeks.
        </p>
        <h3 id="lpscannotfundorwithdrawwhenbettingisactive">
          LPs cannot fund or withdraw when betting is active
        </h3>
        <p>
          This prevents LPs from avoiding or taking advantage of information
          about bet outcomes as they accrue. Betting is active from the time
          odds are sent to the betting contract upon a successful oracle vote,
          through to when the settlement/new scedule is posted (about Friday
          through Monday).
        </p>
        <h3 id="lpcapitalexposureislimitedonanyonematch">
          LP capital exposure is limited on any one match.
        </h3>
        <p>
          If the LPs have 100 ETH, an adjustable concentration factor, cf,
          prevents the LPs from having an exposure greater than 100/cf in any
          event. This helps control diversification risk. The concentration
          factor is constrained to be between 2 and 16, as the optimal number
          will be determined by experience.
        </p>
        <p>
          This protects LPs as diversification lowers risk in the standard
          way--This factor can be adjusted, as experience will generate useful
          information on the best diversification factor. It can also be used to
          concentrate LP capital on big events like the Super Bowl, as the other
          events that weekend would be of much less interest.
        </p>
        <h2 id="oddsrestrictions">Odds Restrictions</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <h3 id="oneoddsnumberinthecontract">One odds number in the contract</h3>
        <p>
          Standard odds are presented as a pair, with a spread so that
          simultaneous bets on both teams lose money for the bettor and make
          money for the house. A prominent attack surface for a smart contract
          would be for the odds to imply an arbitrage, as the offsetting bets
          would generate a sure profit, enabling the hacker to drain virtually
          all the LP's capital at settlement. By using a single number, that
          attack is eliminated. The 4.6% vig creates a competitive two-sided
          offer, a standard requirement for market makers on centralized
          exchanges.
        </p>
        <p>
          The odds for the opponent are calculated via an algorithm. By
          restricting the odds to apply to the favorite, we can restrict the
          range of allowable odds, as no favorite has decimal odds greater than
          2.000. This makes it easier to exclude bogus odds.
        </p>
        <h3 id="noextremeodds">No extreme odds</h3>
        <p>
          Odds greater than 5.65 decimal (465 moneyline), or less than 1.181
          decimal (-554 ML) are not permitted. Often such matches are obscure,
          and so more subject to manipulation. Further, extreme payouts make it
          easier for a hack, as it would take less hacker capital. This would
          eliminate about 5% of NFL games historically but is common among
          college football and MMA. This also eliminates bets like "who will win
          the next golfing event" because even the favorites have long odds.
        </p>
        <p>
          The frontend is helpful but not necessary. One can use Remix, Python,
          or any other method of transacting with the contract, which is
          permissionless.
        </p>
        <h2 id="oddstranslation">Odds Translation</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          To convert moneyline odds into Decimal odds, we have the following.
        </p>
        <p>
          For positive moneyline odds: (Moneyline odds/100) + 1 = Decimal odds
        </p>
        <p>
          For negative moneyline odds: (100/Moneyline odds) + 1 = Decimal odds
        </p>
        <p>
          To translate decimal odds into moneyline odds that are prominent on
          NFL betting sites, we have the following adjustment mechanism:
        </p>
        <p>
          If decimal odds are greater than 2.0: 100 × (decimal odds – 1) =
          Moneyline odds
        </p>
        <p>
          If decimal odds are less than 2.0: -100/(decimal odds -1) = Moneyline
          odds
        </p>
        <p>To translate moneyline odds to fractional odds:</p>
        <p>For positive moneyline odds: Moneyline odds/100 = Fractional odds</p>
        <p>
          For negative moneyline odds: -100/Moneyline odds = Fractional odds
        </p>
        <p>To convert decimal odds into winning probability.</p>
        <p>prob(win) = 1 / Decimal odds</p>
        <p>Decimal odds = 1 / prob(win)</p>
        <p>
          The most common odds offered for the NFL are presented in moneyline
          form as 110 for both teams, which would be 1.909 in decimal odds or
          10/11 in fractional odds. A flat book on such a wager would receive
          220 and payout 210. In this way, the 'house' makes money used to pay
          for various costs and a profit from the house. In this case, the
          implicit profit ('vig') would be 4.55%, 10/220. The general formula
          for estimating the vig is given by the following formula: <em>p</em>{" "}
          and <em>q</em> are decimal payouts (e.g., 1.909 for a standard even
          money bet) for opposing teams.
        </p>
        <p>vig = 1 – pq/(p+q)</p>
        <p>
          The spreadsheet 'OddsTransforms.xlsx' in the docs section of the repo
          shows how these transformations are applied. Those interested in
          sending odds to the contract will find it a helpful template.
        </p>
        <h2 id="oddsinthecontract">Odds in the contract</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          The odds format is based on two primitives. First, the reciprocal of
          decimal odds is the fair probability of winning that would make the
          bet have zero expected value.
        </p>
        <p>Prob(win) = 1 / decimalOdds</p>
        <p>
          The second is that the sum probability of betting on both teams equals
          "1 + vig', or 1.048.
        </p>
        <p>Prob(win|teamA) + prob(win|teamB) = 1 + vig</p>
        <p>
          Thus, for an even bet, the odds for both teams would be 52.4%, as
          0.524+0.524=1.048. Both teams cannot have 52.4% win probabilities, so
          the 2.4% premium reflects the vig and tells one how much of an edge
          one needs to beat the house.
        </p>
        <p>
          We need the LPs and oracle to split the vig. This is done by setting
          the vig at 2.25% regarding the odds the LPs experienced in the betting
          contract. This implies the even bet probability of winning is 51.2%.
          The contract applies this logic at the time of the bet.
        </p>
        <p>
          When a bettor wins, his payout is then taxed at 5%. As payouts on
          average are 50% of the total amount bet on both teams, one-half of 5%
          is 2.5%, which is the total vig in the contract, 4.8%. This is applied
          at redemption.
        </p>
        <p>
          By sending a single number representing the difference in win
          probability between the favorite and underdog, we get a number from
          zero to one. ASB adds this probability spread, divided by two, to the
          base 51.2% probability for the favorite and subtracts the same
          'probability spread divided by two' from the win probability of the
          underdog. One then takes the reciprocal to get the decimal odds for
          the favorite and underdog.
        </p>
        <p>
          The ASB repo contains an MS Access database that takes raw decimal
          odds data and transforms it into the probability difference divided by
          two. When pasted into its Excel spreadsheet, it generates the data in
          the correct format for sending via a Python program. The basic
          algorithm is this:
        </p>
        <ol>
          <li>
            Take an initial set of odds
            <ul>
              <li>Home team: +135 moneyline, 2.350 decimal</li>
              <li>Away team: -150 moneyline, 1.667 decimal</li>
            </ul>
          </li>
          <li>
            rearrange so that the favorite team is first
            <ol>
              <li>team[0]: 1.667, team[1]: 2.350</li>
            </ol>
          </li>
          <li>
            Translate into win probability
            <ol>
              <li>Prob(win) = 1/decimalOdds</li>
              <li>team[0]: 60.00%, team[1]: 42.55%</li>
            </ol>
          </li>
          <li>
            calculate probability spread/2
            <ol>
              <li>spread = 0.60 – 0.4255 = 0.1745</li>
              <li>spread/2 = 0.0872</li>
            </ol>
          </li>
          <li>
            Calculate new favorite, team[0], prob(win)
            <ol>
              <li>prob(team[0] win) = 51.2% + 8.72% = 59.92%</li>
              <li>prob(team[1] win) = 51.2% - 8.72% = 42.48%</li>
            </ol>
          </li>
          <li>
            Translate prob(team[0] win) into decimal odds.
            <ol>
              <li>Gross decimal Odds(team[0]) = 1 / 0.5993 = 1.669</li>
              <li>Gross decimal Odds(team[0]) = 1 / 0.4248 = 2.354</li>
            </ol>
          </li>
          <li>
            Adjust for the 5% oracle fee applied to winnings
            <ol>
              <li>Net decimal Odds(team[0]) = 1+0.6690.95=1.635</li>
              <li>Net decimal Odds(team[1]) = 1+1.3540.95=2.287</li>
            </ol>
          </li>
        </ol>
        <p>
          In this example, the vig is 4.66%: 1 - 1.635 2.287 / (2.287 + 1.635).
          The above algorithm generates a vig near 4.5% across the range of odds
          covered in this contract. The tricky part of the above algorithm is
          that the raw odds spread, in the probability of a win, is added to
          51.2%. If there were no oracle payment, this number would be 52.5%.
        </p>
        <p>
          The website avaxsportsbook.com displays the decimal odds users receive
          if they win. For example, a user seeing odds of 1.900 will receive
          back 1.900 times their bet amount.
        </p>
        <h2 id="lpaccounting">LP Accounting</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          LPs own a pro-rata portion of the contract's revenue based on their
          percentage of LP capital before that week's events. Statistically, the
          LP capital will grow each settlement due to the vig; this is how LPs
          make money. As the relevant LP credit/debit occurs at settlement, the
          LP's AVAX/share value is fixed each week when users can withdraw or
          invest.
        </p>
        <p>An initial investment generates the following shares:</p>
        <p>LPshares = AVAX invested × TotalLpShares / TotalLpAvax</p>
        <p>
          For example, assume the contract has 123 AVAX owned by its LPs, who
          have 100 shares. This AVAX may be free or locked up as collateral for
          upcoming contests. This implies each LP share is worth 1.23 AVAX.
        </p>
        <p>
          LP AVAX: 123.0
          <br />
          LP TotalShares: 100
          <br />
          AVAX/Share: 1.23
        </p>
        <p>
          Suppose Alice wishes to invest 10 AVAX into this pool. The above
          formula implies she would receive 8.13 shares (10/1.23). This would
          change the pool's balance sheet to
        </p>

        <p>
          LP AVAX: 133.0
          <br />
          LP TotalShares: 108.13
          <br />
          AVAX/Share: 1.23
        </p>
        <p>
          Note the ratio of AVAX/share is the same after Alice's investment, so
          existing shareholders do not lose or gain money via Alice's new
          investment.
        </p>
        <p>
          If we assume the LP collective gained 13.3 AVAX that week, the new
          balance sheet after a settlement will look like this:
        </p>
        <p>
          LP AVAX: 143.3
          <br />
          LP TotalShares: 108.13
          <br />
          AVAX/Share: 1.353
        </p>
        <p>
          The increase from 133 to 143.3 reflects a 10% profit from that epoch's
          games. If Alice then sold her shares, she would receive AVAX using a
          transformation of the above formula:
        </p>
        <p>AVAX Withdrawal = TotalLpAvax × SharesSold / TotalLpShares</p>
        <p>
          Selling 8.13 shares would generate 11.0 AVAX, a 10% return on their
          investment, identical to how much the AVAX LP pool rose over that
          period.
        </p>
        <p>
          In this way, any LP investment or withdrawal reflects the percent
          change in the size of the LP pool's AVAX/share over the investment
          period.
        </p>
        <h2 id="oracleaccounting">Oracle Accounting</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          Oracle token holders must deposit their tokens in the oracle contract
          to vote and vote to receive revenue. When a weekly settlement
          transaction is executed, the oracle's 5% fee is applied to the
          winnings and sent to the oracle contract. The '<em>feePool'</em> state
          variable reflects the lifetime amount of AVAX per token paid to the
          oracle contract, like how an LP's fees are calculated on Uniswap.
        </p>
        <p>
          When an oracle token holder deposits into the contract, their account
          notes the current value of <em>feePool</em>. When that oracle token
          holder withdraws or adds to their account, the token holder is sent
          their entire accrued AVAX using the formula
        </p>
        <p>PotentialTokenRevenue = tokens (feePool(now) feePool(initial))</p>
        <p>
          Having tokens in the oracle is a necessary but insufficient condition
          for being paid. The contract then takes the total number of tokens
        </p>
        <p>OraclePayout = votesCast / VotesPossible * PotentialTokenRevenue</p>
        <p>OraclePloughBack = PotentialTokenRevenue OraclePayout</p>
        <p>
          This account's <em>OraclePoughback</em> is sent to the Oracle{" "}
          <em>feePool</em> as if it were revenue from a settlement.
        </p>
        <p>
          There is no scenario where the token holders can lose accrued revenue,
          either due to a lucky win streak by bettors or an oracle hack. Token
          holders can be sure the contract is in balance, where accounts payable
          are always equal to AVAX in the contract.
        </p>
      </div>
    </>
  );
}

export default FAQ;
