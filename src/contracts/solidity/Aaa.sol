// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bbb.sol";


contract Aaa {

    uint256[8] public params;
    Bbb public bbbinternal;

    constructor(address payable _Bbb) {
        bbbinternal = Bbb(_Bbb);
    }

    receive() external payable {}

    function seeBalance() external view returns(uint ethHere) {
        ethHere = address(this).balance;
    }

    function setData(
        uint256[8] memory _data
        ) external {
        params = _data;
    }

    function sendData() external {
            bbbinternal.pullOnly(params);
    }

    function sendData3() external {
            (uint256 _one,uint256 _two) = bbbinternal.pullPush(params);
            params[0] = _one;
            params[7] = _two;
    }
    
        function sendData2() external {
            bbbinternal.pullPay(params);
    }



}
