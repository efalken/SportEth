/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/
pragma solidity ^0.8.0;

contract Token {
  uint8 public decimals;
  uint256 public totalSupply;
  uint256 public constant MINT_AMT = 1e9;
  address public oracleAdmin;
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;
  string public name;
  string public symbol;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Burn(address indexed _from, uint256 _value);
  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  constructor() {
    balanceOf[msg.sender] = MINT_AMT;
    totalSupply = MINT_AMT;
    name = "AvaxSportsBook";
    symbol = "ASB";
    decimals = 3;
  }

  /**
   * @dev applied to tokenDeposit function only
   */
  modifier onlyAdmin() {
    require(oracleAdmin == msg.sender);
    _;
  }

  /**
   * @dev sets oracleAdmin to allow simple transfer to the oracle contract
   * without approval
   */
  function setAdmin(address _oracle) external {
    require(oracleAdmin == address(0));
    oracleAdmin = _oracle;
  }

  function approve(
    address _spender,
    uint256 _value
  ) external returns (bool success) {
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transfer(
    address _recipient,
    uint256 _value
  ) external returns (bool) {
    uint256 senderBalance = balanceOf[msg.sender];
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
    uint256 _value
  ) external returns (bool) {
    uint256 senderBalance = balanceOf[_from];
    require(senderBalance >= _value && allowance[_from][msg.sender] >= _value);
    unchecked {
      balanceOf[_from] = senderBalance - _value;
      allowance[_from][msg.sender] -= _value;
      balanceOf[_recipient] += _value;
    }
    emit Transfer(_from, _recipient, _value);
    return true;
  }

  function tokenDeposit(
    address _from,
    uint256 _value
  ) external onlyAdmin returns (bool) {
    uint256 senderBalance = balanceOf[_from];
    require(senderBalance >= _value);
    unchecked {
      balanceOf[_from] = senderBalance - _value;
      balanceOf[oracleAdmin] += _value;
    }
    emit Transfer(_from, oracleAdmin, _value);
    return true;
  }

  function increaseAllowance(
    address _spender,
    uint256 _addedValue
  ) public returns (bool) {
    allowance[msg.sender][_spender] += _addedValue;
    return true;
  }

  function decreaseAllowance(
    address _spender,
    uint256 _subtractedValue
  ) public returns (bool) {
    require(_subtractedValue <= allowance[msg.sender][_spender], "too large");
    allowance[msg.sender][_spender] -= _subtractedValue;
    return true;
  }
}
