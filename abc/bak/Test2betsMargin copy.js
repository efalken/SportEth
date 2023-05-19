
const helper = require("../../hardhat-helpers");
const time = require("@nomicfoundation/hardhat-network-helpers");

const secondsInHour = 3600;
_dateo = new Date();
//const offset = _dateo.getTimezoneOffset() * 60 * 1000 - 7200000;
var hourOffset;
var _timestamp;
var _timestamp0;
var _date;
var _hour;
var _hourSolidity;
var _hourJavaScript;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000)/1000;



describe("Test2", function () {
 //let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const CheckHour = await ethers.getContractFactory('CheckHour')
    checkhour = await CheckHour.deploy();
  })


  describe("set up contract for taking bets", async () => {
    it("checkHour", async () => {
      _hourSolidity = await checkhour.hourOfDay();
      console.log(`hour in EVM ${_hourSolidity}`);
      _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp);
      _hourJavaScript = _date.getHours();
      console.log(`hourJavaScript ${_hourJavaScript}`);
      hourOffset = 0;
     if (_hourSolidity > _hourJavaScript) {
      hourOffset = _hourSolidity - _hourJavaScript;
     } else if (_hourJavaScript > _hourSolidity) {
      hourOffset = _hourJavaScript - _hourSolidity;
     }
     console.log(`hourAdj ${hourOffset}`);
     await helper.advanceTimeAndBlock(hourOffset*secondsInHour);

     
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
     _hourSolidity = await checkhour.hourOfDay();
     console.log(`hour in EVM ${_hourSolidity}`);
     _timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
     _date = new Date(1000 * _timestamp);
     _hourJavaScript = _date.getHours();
     console.log(`hourJavaScript ${_hourJavaScript}`);
     console.log(`hour adj ${offset}`);



  });
});
});
