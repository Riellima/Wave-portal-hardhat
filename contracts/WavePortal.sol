//SPDX-License-Identifier: UNLICENSED

pragma solidity  0.8.17;

import "hardhat/console.sol";

contract WavePortal {

    mapping(address => uint) individualWavesCount;
    mapping(address => uint) lastWaveTime;
    uint totalWaves;
    Wave[] public waves ;
    uint private seed;
    

    struct Wave {
        address waver;
        string message;
        uint timestamp;
    }

    event NewWave(address indexed from, uint timestamp, string message);

    constructor() payable {
        console.log("Yo i am a contract called WavePortal that can receive waves!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _msg) public{
        require(lastWaveTime[msg.sender] + 15 minutes < block.timestamp, "Wait 15 minutes after your last wave");
        individualWavesCount[msg.sender]++;
        totalWaves++;

        waves.push(Wave(msg.sender, _msg, block.timestamp));
        console.log("%s has waved with : %s", msg.sender, _msg);
        
        emit NewWave(msg.sender, block.timestamp, _msg);
        lastWaveTime[msg.sender] = block.timestamp;

        seed = (seed + block.timestamp + block.difficulty) % 100;
        console.log("Random number geberated : ", seed);

        if (seed < 50){
            console.log("%s won! ", msg.sender);
            uint prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "The contract's balance is insufficient");
            (bool sent, ) = (msg.sender).call{value: prizeAmount}("");
            require(sent, "Failed to send eth");
        }
    }

    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }

    function getTotalWaves () public view returns(uint) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getWavesCount () public view returns(uint) {
        //console.log("%s waved %d times", msg.sender, waves[msg.sender]);
        return individualWavesCount[msg.sender];
    }
}