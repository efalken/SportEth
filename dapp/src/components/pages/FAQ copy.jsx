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

        <h2 id="pythontools">Python Tools</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>
          In the Python directory, there are several useful programs. Given the
          inputs needed for data submissions, these are best done via Python as
          opposed to Remix, as it is easy to miss a set of quotes or commas, and
          then one gets an error that is not explained. Further, this should be
          automated as much as possible, as this investment makes it easier to
          evaluate the data.
        </p>
        <ul>
          <li>getBettingData.py</li>
        </ul>
        <p>Pulls betting contract state data.</p>
        <ul>
          <li>oddsPost.py</li>
        </ul>
        <p>
          Sends weekly odds, formatted in the probability difference between the
          two teams, multiplied by 1000.
        </p>
        <ul>
          <li>settleRefresh.py</li>
        </ul>
        <p>
          Sends the outcomes of the prior week and the upcoming schedule for the
          next weekend.
        </p>
        <ul>
          <li>Createjson.xlm.</li>
        </ul>
        <p>
          Contains macros that create. You can pull raw data to be pasted into
          the ASB.accdb database and then take the query from the final query
          and paste it back into this spreadsheet. A worksheet-embedded macros
          create the .json files used for sending odds and settleRefresh to the
          oracle contract using the Python files above.
        </p>
        <ul>
          <li>ASB.accdb</li>
        </ul>
        <p>
          This database takes in raw data on schedules and odds, which is in
          decimal odds, and generates the data in the format the contract
          requires
        </p>
        <p>Puts the favorite in the first position</p>
        <p>
          Translates decimal odds into the probability of winning for the
          favorite, which is the difference between the favorite's probability
          of winning and the base probability of winning (51.2%).
        </p>
        <ul>
          <li>oddsTranslation:</li>
        </ul>
        <p>
          Contains functions for translating between decimal, moneyline,
          fractional, and probability of winning. It gives an example of how raw
          decimal odds are transformed into the probability of a win.
        </p>
        <p>To create a set of data for a settle/refresh submission.</p>
        <ul>
          <li>ContractTests.xlsm</li>
        </ul>
        <p>
          Contains worksheets that match the testing scenarios in smart/testLib.
        </p>
        <h2 id="todownloadtherepogotoacommandlineandtype">
          To download the repo, go to a command line and type
        </h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Git clone</p>
        <h2 id="howtorunlocaltestsonthecontract">
          How to run local tests on the contract
        </h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Go to the 'smart' director</p>
        <p>type</p>
        <p>cd smart</p>
        <p>Type "npm I" to install node modules.</p>
        <p>Take the 'dotenv' file in smart to ".env"</p>
        <p>
          Add your seed phrase. This will create a wallet used by the test
          contracts.
        </p>
        <h2 id="howtorunlocalfrontendtocontracts">
          How to run local front end to contracts
        </h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Go to the 'dapp' directory</p>
        <p>Cd dapp</p>
        <p>Type "npm I" to install node modules.</p>
        <p>Yarn dev</p>
        <h2 id="howtoruneventlogqueriesusingrepo">
          How to run event log queries using repo
        </h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Go to eventLogQueries directory.</p>
        <p>Go to backend, type "npm i"</p>
        <p>Got to frontend, type "npm I"</p>
        <h2 id="howtoruncontracttests">How to run contract tests</h2>
        <HashLink to="#topofpage">back to top </HashLink>
        <p>Go to smart directory</p>
        <p>
          Type "npx hardhat test" and it will run the files in the 'test'
          folder.
        </p>
      </div>
    </>
  );
}

export default FAQ;
