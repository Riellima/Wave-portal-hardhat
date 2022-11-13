import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0); 
  const [individualWaves, setIndividualWaves] = useState(0); 
  const [allWaves, setAllWaves] = useState([]);

  
  const contractAddress = "0x9Bfc65eDf1B65f90F7a0Dbf7483Fcff2b943b595";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        let individualCount = await wavePortalContract.getWavesCount();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
        setIndividualWaves(individualCount.toNumber());
  
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

      getAllWaves();
      
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let waveMsg = document.getElementById("waveMsg").value;
        const waveTxn = await wavePortalContract.wave(waveMsg, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        document.getElementById("waveMsg").value = "";

        let count = await wavePortalContract.getTotalWaves();
        let individualCount = await wavePortalContract.getWavesCount();
        setTotalWaves(count.toNumber());
        setIndividualWaves(individualCount.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllWaves = async () => {
    const { ethereum } = window;
  
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const waves = await wavePortalContract.getAllWaves();
  
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
  
        setAllWaves(wavesCleaned);

        let count = await wavePortalContract.getTotalWaves();
        let individualCount = await wavePortalContract.getWavesCount();
        setTotalWaves(count.toNumber());
        setIndividualWaves(individualCount.toNumber());
      } 
      else {
        console.log("Ethereum object doesn't exist!");
      }
    } 
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="wallet">Connected account :<br/> {currentAccount}</div>
        <div className="header"> 
          👋 Hello friends!
        </div>

        <div className="bio">
          I am Marielle <br/> Connect your Ethereum wallet on Goerli network and wave at me!
        </div>

        {currentAccount && (
          <input type="text" id="waveMsg" placeholder="type your message"></input>
        )}
        
        
        {currentAccount && (
          <button className="waveButton" onClick={wave}>
            Wave at me
          </button>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <div className="stats">
            Total number of waves: {totalWaves} <br/>
            You waved {individualWaves} times. 
          </div>
        )}
        
        {allWaves.map((wave, index) => {
          return (
            <div className="message" key={index} style={{borderTop:"1px solid", marginTop: "16px", padding: "8px", color:"#555753" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App
