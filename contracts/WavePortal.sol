//SPDX-License-Identifier: UNLICENCED

pragma solidity 0.8.17;

import "hardhat/console.sol";

contract WavePortal{

    uint totalWaves;

    constructor(){
        console.log("Wave portal contract");
    }

    function getTotalWaves() public view returns (uint) {
        console.log("Total waves : %d", totalWaves);
        return totalWaves;
    }

    function wave() public {
        totalWaves++;
        console.log("%s has waved", msg.sender);
    }
}