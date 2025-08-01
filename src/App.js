import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setremainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // useEffect( () => {
  //   getCandidates();
  //   getRemainingTime();
  //   getCurrentStatus();
  //   if (window.ethereum) {
  //     window.ethereum.on('accountsChanged', handleAccountsChanged);
  //   }
  //   return() => {
  //     if (window.ethereum) {
  //       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  //     }
  //   }
  // });

  useEffect(() => {
  async function initialize() {
    await connectToMetamask();   
    await checkIfOwner();        
    await canVote();             
    await getCandidates();
    await getRemainingTime();
    await getCurrentStatus();
  }

  initialize();

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
}, []);  


  async function vote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );

      const tx = await contractInstance.vote(number);
      await tx.wait();
      canVote();
  }

  function convertToTime(seconds) {
    if (seconds <= 0) {
      return "Voting has ended";
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let timeString = "";
    
    if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    
    if (minutes > 0) {
      timeString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    
    if (hours === 0 && minutes === 0) {
      timeString += `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} `;
    }
    
    return timeString.trim() + " left";
  }

  async function canVote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(voteStatus);
  }

  async function getCandidates() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        }
      });
      setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const status = await contractInstance.getVotingStatus();
      console.log(status);
      setVotingStatus(status);
  }

  async function getRemainingTime() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const time = await contractInstance.getRemainingTime();
      setremainingTime(parseInt(time, 16));
  }

  // New function to check if current user is owner
  async function checkIfOwner() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      const owner = await contractInstance.getOwner();
      const currentAddress = await signer.getAddress();
      setIsOwner(owner.toLowerCase() === currentAddress.toLowerCase());
    } catch (err) {
      console.error("Error checking owner:", err);
      setIsOwner(false);
    }
  }

 


  // New restart voting function
  async function restartVoting(durationInMinutes = 60) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      const tx = await contractInstance.restartVoting(durationInMinutes);
      await tx.wait();
      
      console.log("Voting restarted successfully!");
      alert("Voting has been restarted!");
      
      // Refresh the app state
      getCandidates();
      getRemainingTime();
      getCurrentStatus();
      canVote();
      
    } catch (err) {
      console.error("Error restarting voting:", err);
      alert("Failed to restart voting. Make sure you are the contract owner.");
    }
  }

  // New extend voting function
  async function extendVoting(additionalMinutes = 30) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      const tx = await contractInstance.extendVoting(additionalMinutes);
      await tx.wait();
      
      console.log("Voting extended successfully!");
      alert("Voting has been extended!");
      
      // Refresh remaining time
      getRemainingTime();
      getCurrentStatus();
      
    } catch (err) {
      console.error("Error extending voting:", err);
      alert("Failed to extend voting. Make sure you are the contract owner.");
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
      checkIfOwner(); // Check owner status when account changes
    } else {
      setIsConnected(false);
      setAccount(null);
      setIsOwner(false);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        canVote();
        checkIfOwner(); // Check if the connected account is the owner
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      { votingStatus ? (isConnected ? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {convertToTime(remainingTime)}
                      number= {number}
                      handleNumberChange = {handleNumberChange}
                      voteFunction = {vote}
                      showButton = {CanVote}
                      isOwner = {isOwner}
                      restartVoting = {restartVoting}
                      extendVoting = {extendVoting}/>) 
                      
                      : 
                      
                      (<Login connectWallet = {connectToMetamask}/>)) : (<Finished 
                        isOwner = {isOwner}
                        restartVoting = {restartVoting}
                        candidates = {candidates}/>)}
      
    </div>
  );
}

export default App;