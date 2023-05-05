// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bbb.sol";
import "./Token.sol";

contract Aaa {
  uint256 public params;
  Bbb public bbbinternal;
  uint256 public a;
  uint32 public b;
  Token public token;
  address public admin;

  constructor(address payable _Bbb, address _token) {
    bbbinternal = Bbb(_Bbb);
    params = 10;
    token = Token(_token);
    admin = msg.sender;
  }

  receive() external payable {}

  function seeBalance() external view returns (uint256 ethHere) {
    ethHere = address(this).balance;
  }

  function set() external {
    require(msg.sender == admin);
    params++;
  }

  function sendOnly(uint256 _gas) external {
    (bool success, ) = address(bbbinternal).call{ gas: _gas }(
      abi.encodeWithSignature("pullOnly(uint256)", params)
    );
    require(success);
  }

  function sendPay(uint256 _gas) external {
    (bool success, ) = address(bbbinternal).call{ gas: _gas }(
      abi.encodeWithSignature("pullPay(uint256)", params)
    );
    require(success);
  }

  function sendGet(uint256 _gas) external {
    (bool success, bytes memory _x) = address(bbbinternal).call{ gas: _gas }(
      abi.encodeWithSignature("pullGet(uint256)", params)
    );
    require(success);
    (a, b) = abi.decode(_x, (uint256, uint32));
  }

  function sendToken(
    address payor,
    address payee,
    uint32 amt
  ) external {
    bool success = token.transferFrom(payor, payee, amt);
    /*
    (bool success, ) = address(token).call{ gas: 5650000 }(
      abi.encodeWithSignature(
        "transferFrom(address, address, uint32)",
        payor,
        payee,
        amt
      )
    );*/
    require(success);
  }
}
