pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

import "./Betting.sol";
import "./Token.sol";

contract TokenRewards {
  Betting public betting;
  Token public token;
  mapping(address => uint32) public claimEpoch;
  uint64 public tokensInContract;
  uint32 public x;
  uint256 public constant EPOCH_AMOUNT = 25e7;

  event TokenReward(address liqprovider, uint256 tokens, uint32 epoch);

  constructor(address payable _betting, address _token) {
    betting = Betting(_betting);
    token = Token(_token);
  }

  function depositTokens(uint64 _amt) external {
    bool success = token.transferFrom(msg.sender, address(this), _amt);
    require(success, "not success");
    tokensInContract += _amt;
  }

  function getTokenRewards() external {
    require(tokensInContract > 0, "no token rewards left");
    (uint256 lpShares, ) = betting.lpStruct(msg.sender);
    require(lpShares > 0, "only for liq providers");
    uint32 epoch = betting.margin(3);
    uint256 totShares = uint256(betting.margin(4));
    uint32 lpepoch = claimEpoch[msg.sender];
    uint64 tokenRewards;
    if (lpepoch == 0) {
      claimEpoch[msg.sender] = epoch;
    } else if (lpepoch < epoch) {
      claimEpoch[msg.sender] = epoch;
      tokenRewards = uint64((uint256(lpShares) * EPOCH_AMOUNT) / totShares);
      tokensInContract -= tokenRewards;
      bool success = token.transfer(msg.sender, tokenRewards);
      require(success, "token failed");
      emit TokenReward(msg.sender, tokenRewards, epoch);
    }
  }
}
