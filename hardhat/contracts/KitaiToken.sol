pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Example class - a mock class using delivering from ERC20
contract KitaiToken is ERC20 {
    constructor(uint256 initialBalance) public ERC20("Kitai", "KITAI") {
        _mint(msg.sender, initialBalance);
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
}
