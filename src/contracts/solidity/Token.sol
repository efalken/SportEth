pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
Copyright © 2021 Eric G. Falkenstone
*/

contract Token {
  uint64 public decimals;
  uint64 public totalSupply;
  uint64 public constant MINT_AMT = 1e9;
  mapping(address => uint64) public balanceOf;
  mapping(address => mapping(address => uint64)) public allowance;
  string public name;
  string public symbol;

  event Transfer(address _from, address _to, uint64 _value);
  event Burn(address _from, uint64 _value);

  event Approval(address _owner, address _spender, uint64 _value);

  constructor() {
    balanceOf[msg.sender] = MINT_AMT;
    totalSupply = MINT_AMT;
    name = "SportEth Token";
    decimals = 0;
    symbol = "SET";
  }

  //receive() external payable {}

  //fallback() external {}

  function approve(address _spender, uint64 _value)
    external
    returns (bool success)
  {
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transfer(address _recipient, uint64 _value) external returns (bool) {
    uint64 senderBalance = balanceOf[msg.sender];
    require(balanceOf[msg.sender] >= _value, "nsf");
    unchecked {
      balanceOf[msg.sender] = senderBalance - _value;
      balanceOf[_recipient] += _value;
    }
    emit Transfer(msg.sender, _recipient, _value);
    return true;
  }

  function transferFrom(
    address _from,
    address _recipient,
    uint64 _value
  ) external returns (bool) {
    uint64 senderBalance = balanceOf[_from];
    require(
      balanceOf[_from] >= _value && allowance[_from][msg.sender] >= _value
    );
    unchecked {
      balanceOf[_from] = senderBalance - _value;
      balanceOf[_recipient] += _value;
      allowance[_from][msg.sender] -= _value;
    }
    emit Transfer(_from, _recipient, _value);
    return true;
  }

  function burn(uint64 _value) external returns (bool) {
    uint64 senderBalance = balanceOf[msg.sender];
    require(balanceOf[msg.sender] >= _value, "nsf");
    unchecked {
      balanceOf[msg.sender] = senderBalance - _value;
      totalSupply -= _value;
    }
    emit Burn(msg.sender, _value);
    return true;
  }
}
