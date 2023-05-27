return (
  <div>
  <VBackgroundCom / >
    <Split
    page={"bookies"}
    side={
    <Box
      mt="30px"
      ml="25px"
      mr="35px">
      <Logo />


    <Box >
    <Flex
      mt="20px"
      flexDirection="row"
      justifyContent="space-between" >
      </Flex>
    <Flex
    style={{borderTop: `thin solid ${G}`}} >
    </Flex>
    </Box>
    <Box>
          <Flex>
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/NFL/bookiepage"
                    >
                      Go to Bookie Page
                    </a>
                  </Text>

                </Flex>
                </Box>
                <Box>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="marginLeft"
                >
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/"
                    >
                      HomePage
                    </a>
                  </Text>
                </Flex>
                </Box>

    <Box mb="10px"
    mt="10px" >
    <Text>Your address</Text>
    <TruncatedAddress
      addr={this.props.accounts[0]}
      start="8"
      end="6"
      transform="uppercase"
      spacing="1px" />
    </Box>


    <Box>
      <Flex
        mt="5px"
        flexDirection="row"
        justifyContent="space-between" >
      </Flex>
    </Box>

    <Box >
    <Flex
    style={
      {
        borderTop: `thin solid ${G}`
      }
    } >
    </Flex>
    </Box>
    <Box>
              {" "}
              <Text size="14px" > {
                "Cancel Active or Redeem Expired Offers"
              } </Text>
    </Box>
    <Box mt="10px"
    mb="10px" >
    <Input
    onChange={
      ({
        target: {
          value
        }
      }) =>
      this.handleKill(value)
    }
    width="100px"
    placeholder={
      "enter hash"
    }
    marginLeft="10px"
    marginRignt="5px"
    value={
      this.state.contractID
    }
    />




    <Button
    style={
      {height: "30px",
        width: "100px",
        float: "right",
       marginLeft: "5px"
       }
    }
    onClick={
      () => this.killBet()
    } >
    Cancel </Button>
    </Box>



    <Box>
    <Flex
      mt="20px"
      flexDirection="row"
      justifyContent="space-between" >
      </Flex>
    <Flex
    style={
      {
        borderTop: `thin solid ${G}`
      }
    } >
    </Flex>
    </Box>

<Box>

{this.checker != 0 ? (
<Flex>
{Object.keys(this.betHistory).map(id => (
<div key={id} style={{ width: "100%", float: "left" }}>
<Text> Your active & unclaimed bets</Text>

<br />

<table style={{ width: "100%", fontSize: "12px" }}>
  <tr style={{ width: "33%" }}>
    <td>Week</td>
    <td>LongPick</td>
    <td>Big Bet Amount</td>
    <td>betHash</td>
    <td>Outcome</td>
  </tr>

{this.betHistory[id].map((event, index) => (
  <tr style={{ width: "33%" }}>
      <td>{event.NFLWeek}</td>
      <td>{teamList[event.LongPick]}</td>
      <td>{(event.BetSize/(event.DecOdds/1000+1)).toFixed(2)}</td>
      <td><TruncatedAddress
        addr={event.Hashoutput}
        start="5"
        end="2"
        transform="uppercase"
        spacing="1px" /> </td>
        <td>
        {8888}</td>
</tr>

))}
</table>

</div>
))}

</Flex>
) : <Text size="14px">you have no active bets</Text> }
</Box>

<Box >
<Flex
mt="20px"
flexDirection="row"
justifyContent="space-between" >
</Flex>
<Flex
style={
{
  borderTop: `thin solid ${G}`
}
} >
</Flex>
</Box>




</Box>
  } >

<Flex justifyContent="center">
<Text size="25px">Withdraw Winnings, Place Bets</Text>
</Flex>
<Flex justifyContent="center">
<Text size="15px">Active Week: {week}</Text>
</Flex>

<Box mt="15px"
mx="30px" >
<Flex width="100%"
justifyContent="marginLeft" >
<Text size="12px" weight="300"> Toggle the team you think will win. Moneyline odds
correspond to Decimal odds, though the contracts are executed using the Decimal odds
to three significant digits (eg. 1.909). To make a bet, toggle the team you wish to win,
and enter the eth you want to bet. Bets are constrained by the size of the bookie capital and existing
positions, so there is a maximum for eacch position. You can make a larger bet--unbounded--by clicking
the 'BetBig' button, and get the same odds, but you will not necessarily be filled. Existing 'Big' Bets
are listed when you toggle a team to go long, with a specific eth amount required.
</Text>
</Flex>
</Box>


<Flex
  mt="10px"
  pt="10px"
  alignItems="center"
  style={{
    borderTop: `thin solid ${G}`
  }}
>
</Flex>


<Flex
mt="5px"
flexDirection="row"
justifyContent="flex-start"
alignItems="center"
>

<Text size="16px" weight="400" style={{paddingLeft: "10px"}}>Big Bet Amount</Text>

<Input
onChange={
 ({
   target: {
     value
   }
 }) =>
 this.handletakeBigBookAmount(value)
}
width="100px"
placeholder={
 "Enter Eths"
}
marginLeft="10px"
marginRignt="5px"
value={
 this.state.betAmount
}
/>

<Input
onChange={
 ({
   target: {
     value
   }
 }) =>
 this.handletakeBigBookTeam(value)
}
width="100px"
placeholder={
 "Team Number"
}
marginLeft="10px"
marginRignt="5px"
value={
 this.state.teamPick
}
/>
<Box mt="10px"
mb="10px" >
<Button
style={
 {height: "30px",
   width: "100px",
   float: "right",
  marginLeft: "5px"
  }
}
onClick={
 () => this.takeBigBet()
} >
Bet Now </Button> </Box>

<Text size="16px" weight="400" style={{paddingLeft: "10px"}}>Big Bet Amount</Text>

<Input
onChange={
 ({
   target: {
     value
   }
 }) =>
 this.handletakeBigBookAmount(value)
}
width="100px"
placeholder={
 "Enter Eths"
}
marginLeft="10px"
marginRignt="5px"
value={
 this.state.betAmount
}
/>

<Input
onChange={
 ({
   target: {
     value
   }
 }) =>
 this.handletakeBigBookTeam(value)
}
width="100px"
placeholder={
 "Team Number"
}
marginLeft="10px"
marginRignt="5px"
value={
 this.state.teamPick
}
/>
<Box mt="10px"
mb="10px" >
<Button
style={
 {height: "30px",
   width: "100px",
   float: "right",
  marginLeft: "5px"
  }
}
onClick={
 () => this.takeBigBet()
} >
Bet Now </Button> </Box>




{(this.state.showDecimalOdds) ? (
    <Box mt="10px"
    mb="10px" >
    <ButtonI
  style={
    {height: "50px",
      width: "130px",
      float: "right",
     marginLeft: "5px"
     }
  }
  onClick={
    () => this.switchOdds()
  } >show MoneyLine
  </ButtonI> </Box>) :
   (<Box><ButtonI
  style={
    {height: "50px",
      width: "130px",
      float: "right",
     marginLeft: "5px"
     }
  }
  onClick={
    () => this.switchOdds()
  } >show DecimalOdds
  </ButtonI> </Box>) }



</Flex>


<Box>   <Flex
mt="20px"
flexDirection="row"
justifyContent="space-between" >
</Flex>
</Box>

<Flex style={
{
color: "#0099ff",
fontSize: "13px"
}
} >

{this.state.teamPick != null ? (<Text size="16px" weight="400">
pick: {teamListFull[this.state.teamPick]}; Decimal Odds: {(1 + oddsColumn[this.state.teamPick]/1000).toFixed(3)}; opponent:
{teamListFull[scheduleColumn[this.state.teamPick]]}</Text>)

: null
}
</Flex>

<Box>   <Flex
mt="20px"
flexDirection="row"
justifyContent="space-between" >
</Flex>
</Box>


<div>

 {Object.keys(this.bigBetHistory2).map(id => (
   <div key={id} style={{ width: "100%", float: "left" }}>
     <Text size="12px" weight="200">
       {" "}
   Team Offered, Odds Offered, Size, Bet Hash
     </Text>{" "}
     <br />

     {this.bigBetHistory2[id].map((event, index) => (
       <div key={index}>
         <Text size="12px" weight="200">
         <input
          type="radio"
          value={event.LongPick}
          name={teamList[event.LongPick]}
          onChange={({ target: { value } }) => this.radioTeamPick(value)}
        />
           {" "}
           {teamList[event.LongPick]},{" "}
           {(this.state.showDecimalOdds) ? (
             (event.DecOdds/1000 + 1).toFixed(3))
           : (this.getMoneyLine(event.DecOdds)).toFixed(0)
         },{" "}
           {(event.BetSize).toFixed(3)},{" "}
           {<TruncatedAddress0
                 addr={event.Hashoutput}
                 start="8"
                 end="6"
                 transform="uppercase"
               />
            }
         </Text>
         <br />
       </div>
     ))}
 </div>
))}

</div>
