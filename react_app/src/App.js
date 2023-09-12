import React, { useState, useEffect } from 'react';
import './App.css';
import contractABI from "./contractABI.json";
import { ethers } from "ethers";
import ListComponent from './Components/ListComponent';
import ConnectWalletComponent from './Components/ConnectWalletComponent';
const contractAddress = "0x9ae37b650bcd060c5ac7827daa2fba31381f9af1";

function App() {
  const [walletAccount, setWalletAccount] = useState(null);
  const [toDoContract, setToDoContract] = useState(null);

  const checkWalletStatus = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Metamask not install.");
      return;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      setWalletAccount(account);
      setEthereumProvider();
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Metamask not install.");
    }
    try {
      //connect to meta mask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setWalletAccount(account);
      setEthereumProvider();
    } catch (err) {
      console.log(err)
    }
  }

  const setEthereumProvider = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      setToDoContract(contract);
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    checkWalletStatus();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        {
          toDoContract ?
            <ListComponent toDoContract={toDoContract} account={walletAccount} />
            :
            <ConnectWalletComponent onBtnClick={connectWalletHandler} />
        }
      </header>
    </div>
  );
}

export default App;
