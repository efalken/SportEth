pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: WTFPL
@author Eric Falkenstein
*/

contract Token {
  uint8 public _decimals;
  uint64 public _totalSupply;
  uint64 public constant MINT_AMT = 1e9;
  address public oracleAdmin;
  mapping(address => uint64) public _balances;
  mapping(address => mapping(address => uint64)) public _allowances;
  string public _name;
  string public _symbol;

  event Transfer(address _from, address _to, uint64 _value);
  event Burn(address _from, uint64 _value);
  event Mint(address _from, uint64 _value);
  event Approval(address _owner, address _spender, uint64 _value);

  constructor() {
    _balances[msg.sender] = MINT_AMT;
    _totalSupply = MINT_AMT;
    _name = "AvaxSportsBook";
    _decimals = 0;
    _symbol = "ASB";
  }

  function approve(
    address _spender,
    uint64 _value
  ) external returns (bool success) {
    _allowances[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  // function mint(
  //   address _spender,
  //   uint64 _value
  // ) external onlyAdmin returns (bool success) {
  //   _totalSupply += _value;
  //   _balances[_spender] += _value;
  //   emit Mint(_spender, _value);
  //   return true;
  // }

  function transfer(address _recipient, uint64 _value) external returns (bool) {
    uint64 senderBalance = _balances[msg.sender];
    require(_balances[msg.sender] >= _value, "nsf");
    unchecked {
      _balances[msg.sender] = senderBalance - _value;
      _balances[_recipient] += _value;
    }
    emit Transfer(msg.sender, _recipient, _value);
    return true;
  }

  function transferFrom(
    address _from,
    address _recipient,
    uint64 _value
  ) external returns (bool) {
    uint64 senderBalance = _balances[_from];
    require(
      senderBalance >= _value && _allowances[_from][msg.sender] >= _value
    );
    unchecked {
      _balances[_from] = senderBalance - _value;
      _balances[_recipient] += _value;
      _allowances[_from][msg.sender] -= _value;
    }
    emit Transfer(_from, _recipient, _value);
    return true;
  }

  function transferSpecial(
    address _from,
    uint64 _value
  ) external onlyAdmin returns (bool) {
    uint64 senderBalance = _balances[_from];
    require(senderBalance >= _value);
    unchecked {
      _balances[_from] = senderBalance - _value;
      _balances[oracleAdmin] += _value;
    }
   emit Transfer(_from, oracleAdmin, _value);
    return true;
  }

  modifier onlyAdmin() {
    require(oracleAdmin == msg.sender);
    _;
  }

  function setAdmin(address _oracle) external {
    require(oracleAdmin == address(0x0));
    oracleAdmin = _oracle;
  }

  function burn(uint64 _value) external returns (bool) {
    uint64 senderBalance = _balances[msg.sender];
    require(_balances[msg.sender] >= _value, "nsf");
    unchecked {
      _balances[msg.sender] = senderBalance - _value;
      _totalSupply -= _value;
    }
    emit Burn(msg.sender, _value);
    return true;
  }

  /**
   * @dev Returns the name of the token.
   */
  function name() public view virtual returns (string memory) {
    return _name;
  }

  /**
   * @dev Returns the symbol of the token
   */
  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  /**
   * @dev Returns the number of _decimals used to get its user representation.
   */
  function decimals() public view virtual returns (uint8) {
    return _decimals;
  }

  /**
   * @dev See {IERC20-_totalSupply}.
   */
  function totalSupply() public view virtual returns (uint64) {
    return _totalSupply;
  }

  /**
   * @dev See {IERC20-balanceOf}.
   */
  function balanceOf(address account) public view virtual returns (uint64) {
    return _balances[account];
  }

  function allowance(
    address owner,
    address spender
  ) public view virtual returns (uint64) {
    return _allowances[owner][spender];
  }
}
