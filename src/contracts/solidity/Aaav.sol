// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bbbv.sol";
import "./Token.sol";

contract Aaav {
  uint256[8] public params;
  Bbbv public bbbinternal;
  uint256 public a;
  uint32 public b;
  Token public token;

  constructor(address payable _Bbb, address payable _token) {
    bbbinternal = Bbbv(_Bbb);
    params[0] = 10;
    params[1] = 2;
    params[2] = 2;
    params[3] = 2;
    params[4] = 2;
    params[5] = 2;
    params[6] = 2;
    params[7] = 2;
    token = Token(_token);
  }

  receive() external payable {}

  function seeBalance() external view returns (uint256 ethHere) {
    ethHere = address(this).balance;
  }

  function set() external {
    params[0]++;
  }

  function sendOnly(uint256 _gas) external {
    (bool success, ) = address(bbbinternal).call{ gas: _gas }(
      abi.encodeWithSignature("pullOnly(uint256[8])", params)
    );
    require(success);
  }

  function sendPay(uint256 _gas) external {
    (bool success, ) = address(bbbinternal).call{ gas: _gas }(
      abi.encodeWithSignature("pullPay(uint256[8])", params)
    );
    require(success);
  }

  function sendGet(uint256 _gas) external {
    (bool success, bytes memory _x) = address(bbbinternal).call{ gas: _gas }(
      //(bool success, bytes memory _x) = address(bbbinternal).call(
      abi.encodeWithSignature("pullGet(uint256[8])", params)
    );
    require(success);
    (a, b) = abi.decode(_x, (uint256, uint32));
  }

  function sendToken(address payee, uint32 amt) external {
    (bool success, ) = address(token).call{ gas: 23000 }(
      //(bool success, bytes memory _x) = address(bbbinternal).call(
      abi.encodeWithSignature("transfer(uint256, uint32)", payee, amt)
    );
    require(success);
  }

  function sendToken2(address payee, uint32 amt) external {
    bool success = token.transfer(payee, amt);
    require(success);
  }
}
