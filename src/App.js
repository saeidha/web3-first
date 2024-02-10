import React, { useState, useEffect } from "react";
import { ethers } from "ethers";  

function App() {

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const checkIfWalletIsConnected = async () => {
    try { 
      if (window.ethereum) {
        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          getBalance(accounts[0]); 
        } 
      } else {
        setIsWalletConnected(false);
        console.log("Install Metamask");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getBalance = async (address) => {
    try {   
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);  
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.log(error);  
    }
  }

  const connectWallet = async () => { 
    try {
      if(!window.ethereum) return alert("Please install Metamask.");

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
      
      setIsWalletConnected(true);
      getBalance(accounts[0]);
    } catch (error) {
      console.log(error);  
    }
  }

  return (
    <div>
      <h1>My Ether Balance: {balance}</h1>
      
      <button onClick={connectWallet}> 
        {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>

    </div>
  );
}

export default App;
