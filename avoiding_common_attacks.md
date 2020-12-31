# Security Measures &#128274;

###### Security steps taken to ensure the ``ProofOfExistence.sol`` is not susceptible to common attacks

----

Because there is inherently no transfer of funds (other than the payment of gas fees) involved in this dApp, there were fewer security attacks to be avoided. A few security measures that I put in place can be found below:


- **TxOrigin Attack**
  - Instead of ``tx.origin``, I used ``msg.sender`` to authorize the owner of the contract.
  - In doing so, `msg.sender` only references the address of the sender of the current call and not the original sender of the transaction.

- **Integer Overflow Attack**
  - This contract has a `proofCounter` that increments **by 1** if a proof has successfully been created.

- **OpenZeppelin Library**
  - I use the OpenZeppelin smart contract library (Ownable.sol, Pausable.sol).
  - OpenZeppelin is using verified, audited code that is already being used on the mainnet, and subsequently should be 'trusted'.

- **Ownable Contract**
  - Basic authorisation mechanisms have been implemented, such as setting a contract owner and requiring the functions to be called by the `msg.sender` (owner).

- **TimeStamp Retrieved From Blockchain**
  - Originally, the timestamp was generated from the client-side and sent over to the contract. This approach can lead to several malicious attacks, such as manipulating the upload by 'faking' the time of the proof.
  - Subsequently I retrieve the time from the blockchain with `block.timestamp`. It is not the most secure option, but it does make it more difficult to manipulate. However, miners can influence global block timestamps and which transactions to be included in a block. 
  - An ideal solution would be to retrieve a timestamp from a third-party provider such as [Provable](https://provable.xyz/), however, this can also introduce vulnerabilities.

  

