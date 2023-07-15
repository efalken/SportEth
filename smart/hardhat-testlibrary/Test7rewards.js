const helper = require("../hardhat-helpers");
const secondsInHour = 3600;
_dateo = new Date();
const offset = (_dateo.getTimezoneOffset() * 60 * 1000 - 7200000) / 1000;
var hourOffset;
var _hourSolidity;
var _timestamp;
var nextStart;
var _date;
var _hour;
var result;
var receipt;
const firstStart = 1635695609;
const { assert } = require("chai");
const finneys = BigInt("1000000000000000");
const eths = BigInt("1000000000000000000");
const million = BigInt("1000000");

require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

describe("test rewards 7", function () {
  let betting, oracle, token, owner, account1, account2, account3;

  before(async () => {
    const Betting = await ethers.getContractFactory("Betting");
    const Token = await ethers.getContractFactory("Token");
    const Oracle = await ethers.getContractFactory("Oracle");
    const Reader = await ethers.getContractFactory("Reader");
    const TokenRewards = await ethers.getContractFactory("TokenRewards");
    token = await Token.deploy();
    betting = await Betting.deploy(token.address);
    oracle = await Oracle.deploy(betting.address, token.address);
    await betting.setOracleAddress(oracle.address);
    await token.setAdmin(oracle.address);
    reader = await Reader.deploy(betting.address, token.address);
    tokenrewards = await TokenRewards.deploy(betting.address, token.address);
    [owner, account1, account2, account3, _] = await ethers.getSigners();
  });

  it("initial", async () => {
    await oracle.depositTokens(510n * million);
    await token.approve(tokenrewards.address, 490n * million);
    await tokenrewards.depositTokens(490n * million);
    var tt = await tokenrewards.tokensInContract();
    console.log("tokens in k", tt);
    const tokens0 = await token.balanceOf(owner.address);
    const tokens1 = await token.balanceOf(account1.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    const ce = await betting.margin(3);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    const lpcap2 = await tokenrewards.claimEpoch(account1.address);
    console.log(`Epoch owner ${lpcap} acct1 ${lpcap2} kontract ${ce}`);
  });

  it("send data", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = 1688218363 + 7 * 86400;
    await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );

    const tokens02 = await token.balanceOf(owner.address);
    console.log(`acct0EA tokens ${tokens02}`);
  });

  it("process data", async () => {
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.initProcess();
    // margin0 = await betting.margin(0);
    // margin4 = await betting.margin(4);
    // console.log(`margin0 ${margin0} margin4 ${margin4}`);
    const tokens01 = await token.balanceOf(owner.address);
    console.log(`acct0EA tokens0 ${tokens01}`);

    await betting.connect(owner).fundBook({
      value: 6n * eths,
    });
    const tokens02 = await token.balanceOf(owner.address);
    console.log(`acct0EA tokens1 ${tokens02}`);
    result = await tokenrewards.getTokenRewards();
    // receipt = await result.wait();
    await betting.connect(account1).fundBook({
      value: 6n * eths,
    });
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();

    await betting.connect(account2).fundBettor({
      value: 10n * eths,
    });
    const tokens03 = await token.balanceOf(owner.address);
    console.log(`acct0EA tokens2 ${tokens03}`);
    const tokens1 = await token.balanceOf(account1.address);
    console.log(`acct1EA tokens ${tokens1}`);
    result = await betting.connect(account2).bet(1, 0, "500");
    receipt = await result.wait();
    const ce = await betting.margin(3);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    const lpcap2 = await tokenrewards.claimEpoch(account1.address);
    console.log(`Epoch owner ${lpcap} acct1 ${lpcap2} kontract ${ce}`);
    margin0 = await betting.margin(0);
    margin4 = await betting.margin(4);
    console.log(`margin0 ${margin0} margin4 ${margin4}`);
  });

  it("state0", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    console.log(`acct 1 ea tokens ${tokens1}`);

    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    const lpcap2 = await tokenrewards.claimEpoch(account1.address);
    console.log(`Epoch owner ${lpcap} acct1 ${lpcap2} kontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("runWeek1", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.settleProcess();
    receipt = await result.wait();
  });

  it("state1", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    const lpcap2 = await tokenrewards.claimEpoch(account1.address);
    console.log(`Epoch owner ${lpcap} acct1 ${lpcap2} kontract ${ce}`);

    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week2", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });
  it("state2", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    console.log(`claimEpoch owner ${lpcap} onkontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week3", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });

  it("state3", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    console.log(`claimEpoch owner ${lpcap} onkontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week4", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();

    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });

  it("state4", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    console.log(`claimEpoch owner ${lpcap} onkontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week5", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    await betting.withdrawBook("3000");
    await betting.connect(account1).fundBook({
      value: 3n * eths,
    });
    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });

  it("state5", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    console.log(`claimEpoch owner ${lpcap} onkontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week6", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });

  it("state6", async () => {
    const oracleBalpre = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens0 = ethers.utils.formatUnits(
      await token.balanceOf(owner.address),
      "kwei"
    );
    const tokens1 = ethers.utils.formatUnits(
      await token.balanceOf(account1.address),
      "kwei"
    );
    const tokensOracle = await token.balanceOf(oracle.address);
    const a0inK = (await oracle.adminStruct(owner.address)).tokens;
    const a1inK = (await oracle.adminStruct(account1.address)).tokens;
    console.log(`acct 0 ea tokens ${tokens0}`);
    // // console.log(`acct 0 inK tokens ${a0inK}`);
    console.log(`acct 1 ea tokens ${tokens1}`);
    // console.log(`acct 1 inK tokens ${a1inK}`);
    console.log(`oracle tokens ${tokensOracle}`);
    const ts = await betting.margin(4);
    console.log(`totalShares ${ts}`);
    const bc = await betting.margin(0);
    console.log(`bookieCapital ${bc}`);
    const ce = await betting.margin(3);
    console.log(`totalShares ${ts}`);
    const lpcap = await tokenrewards.claimEpoch(owner.address);
    console.log(`claimEpoch owner ${lpcap} onkontract ${ce}`);
    const lpcap2 = await tokenrewards.claimEpoch(account1.address);
    console.log(`claimEpoch owner ${lpcap2} onkontract ${ce}`);
    const oracleBalpost = ethers.utils.formatUnits(
      await ethers.provider.getBalance(oracle.address),
      "kwei"
    );
    console.log(`oracle eth ${oracleBalpost}`);
  });

  it("run week7", async () => {
    _hourSolidity = await reader.hourOfDay();
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    result = await oracle.initPost(
      [
        "NFL:ARI:LAC",
        "NFL:ATL:LAR",
        "NFL:BAL:MIA",
        "NFL:BUF:MIN",
        "NFL:CAR:NE",
        "NFL:CHI:NO",
        "NFL:CIN:NYG",
        "NFL:CLE:NYJ",
        "NFL:DAL:OAK",
        "NFL:DEN:PHI",
        "NFL:DET:PIT",
        "NFL:GB:SEA",
        "NFL:HOU:SF",
        "NFL:IND:TB",
        "NFL:JAX:TEN",
        "NFL:KC:WSH",
        "UFC:Holloway:Kattar",
        "UFC:Ponzinibbio:Li",
        "UFC:Kelleher:Simon",
        "UFC:Hernandez:Vieria",
        "UFC:Akhemedov:Breese",
        "UFC:Memphis:Brooklyn",
        "UFC:Boston:Charlotte",
        "UFC:Milwaukee:Dallas",
        "UFC:miami:LALakers",
        "UFC:Atlanta:SanAntonia",
        "NHL:Colorado:Washington",
        "NHL:Vegas:StLouis",
        "NHL:TampaBay:Dallas",
        "NHL:Boston:Carolina",
        "NHL:Philadelphia:Edmonton",
        "NHL:Pittsburgh:NYIslanders",
      ],
      [
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
        nextStart,
      ],
      [
        999, 448, 500, 919, 909, 800, 510, 739, 620, 960, 650, 688, 970, 730,
        699, 884, 520, 901, 620, 764, 851, 820, 770, 790, 730, 690, 970, 760,
        919, 720, 672, 800,
      ]
    );
    receipt = await result.wait();
    const gasUsed = receipt.gasUsed;
    // console.log(`gas on second post ${gasUsed}`);

    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    _date = new Date(1000 * _timestamp + offset);
    _hour = _date.getHours();
    await helper.advanceTimeAndBlock(secondsInHour * 12);
    result = await oracle.initProcess();
    receipt = await result.wait();
    await betting.connect(account2).bet(0, 0, "5000");
    _hourSolidity = await reader.hourOfDay();
    // console.log(`hour in EVM ${_hourSolidity}`);
    hourOffset = 0;
    if (_hourSolidity > 12) {
      hourOffset = 36 - _hourSolidity;
    } else if (_hourSolidity < 12) {
      hourOffset = 12 - _hourSolidity;
    }
    await helper.advanceTimeAndBlock(hourOffset * secondsInHour);
    _timestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    nextStart = _timestamp + 7 * 86400;
    await oracle.settlePost([
      1, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);

    await helper.advanceTimeAndBlock(secondsInHour * 12);
    await oracle.settleProcess();

    result = await tokenrewards.getTokenRewards();
    receipt = await result.wait();
    result = await tokenrewards.connect(account1).getTokenRewards();
    receipt = await result.wait();
    const tokens00 = await token.balanceOf(owner.address);
    const tokens11 = await token.balanceOf(account1.address);
    console.log(`acct 0-4 ${tokens00}`);
    console.log(`acct 1-4 ${tokens11}`);
    const epoch = await betting.margin(3);
    console.log(`margin3 ${epoch}`);
    const acct0epoch = await tokenrewards.claimEpoch(owner.address);
    console.log(`epoch ${acct0epoch}`);
    const totShares = await betting.margin(4);
    console.log(`totShares ${totShares}`);
  });
});
