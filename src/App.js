import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  useEffect(() => {
    if(provider && isWalletConnected) {
      checkNetwork();
    }
  }, [provider])


  const targetNetwork = {
    blockExplorerUrls: ['https://explorer.berachain.com'],
    chainName: 'Berachain', 
    nativeCurrency: {
       name: 'BERA',
       symbol: 'BERA',  
       decimals: 18
    },
    rpcUrls: ['https://artio.rpc.berachain.com'],
    
    chainId: '0x138d5' // 80085 in hex
  } 

  const checkNetwork = async () => {
    if(provider) {
      const network = await provider.getNetwork();
      if(network.chainId !== targetNetwork.chainId) {
        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: targetNetwork.chainId }]);
        } catch {
          await provider.send('wallet_addEthereumChain', [
            targetNetwork
          ])
        }
      }
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
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
  };

  const getBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask.");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setIsWalletConnected(true);
      getBalance(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async () => {
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(sendAmount),
      });
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isWalletConnected) {
    return (
      <div>
        {isWalletConnected ? (
          <button onClick={checkNetwork}>Switch Network</button>  
        ) : (  
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
  
      </div>
    )
  }

  return (
    <div>
      <h1>Address: {isWalletConnected}</h1>

      <h2>Balance: {balance}</h2>

      <input
        placeholder="Amount"
        onChange={(e) => setSendAmount(e.target.value)}
      />

      <input
        placeholder="Recipient Address"
        onChange={(e) => setRecipient(e.target.value)}
      />

      <button onClick={handleSend}>Send Ether</button>
    </div>
  );
}

export default App;
