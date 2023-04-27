pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT  
@author Eric Falkenstein
*/

contract Bbb {
    uint256[8] public paramsb;
    address payable public aaa;

    /// @dev initial deployment sets administrator as the Oracle contract
    function setAdmin(address payable _admina) external {
        aaa = _admina;
    }

    function sendEth() external payable {
    }

    receive() external payable {}

    function seeBalance() external view returns(uint ethHere) {
        ethHere = address(this).balance;
    }

        function pullOnly(uint256[8] memory _params)
        external
        {
        paramsb = _params;
    }

    function pullPay(uint256[8] memory _params)
        external
        {
        paramsb = _params;
        (bool success,) = aaa.call{value: 100}("");
        require(success, "Call failed");
        //aaa.transfer(100);
        }

        function pullPush(uint256[8] memory _params)
        external
        returns (uint256, uint256)
        {
        paramsb = _params;
        return (paramsb[0]+1, paramsb[1]+2);
    }




    function reset()
        external
        {
        delete paramsb;
        }

}
