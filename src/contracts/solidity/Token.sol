pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
Copyright © 2021 Eric G. Falkenstone
*/

contract Token {
    uint32 public decimals;
    uint32 public totalSupply;
    uint32 public constant MINT_AMT = 1e9;
    mapping(address => uint32) public balanceOf;
    mapping(address => mapping(address => uint32)) public allowance;
    string public name;
    string public symbol;

    event Transfer(address _from, address _to, uint32 _value);

    event Approval(address _owner, address _spender, uint32 _value);

    constructor() {
        balanceOf[msg.sender] = MINT_AMT;
        totalSupply = MINT_AMT;
        name = "SportEth Token";
        decimals = 6;
        symbol = "SET";
    }

    function approve(address _spender, uint32 _value)
        external
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _recipient, uint32 _value)
        external
        returns (bool success)
    {
        uint32 senderBalance = balanceOf[msg.sender];
        require(balanceOf[msg.sender] >= _value);
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
        uint32 _value
    ) public returns (bool success) {
        uint32 senderBalance = balanceOf[_from];
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


}
