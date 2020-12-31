# Design Pattern Decisions 	&#127905;

###### Design patterns implemented in `ProofOfExistence.sol`

----

The dApp only uses one smart contract and imports a well-tested, trusted library (OpenZeppelin). The user is able to interact with the contract via the front-end by means of a third-party provider (i.e. Metamask). To keep the project as decentralized as possible, I did not implement any backend servers and rather stored all the details of a proof on the blockchain while making use of an IPFS for the document upload.

Other design decisions that I made during development process were:

##### Circuit Breaker
This contract inherits from standard zeppelin Pausable and Ownable contracts. Subsequently, only the owner of the contract can pause the contract and restrict any further state mutation.

##### Immortal
Since there is no reason for the contract to expire at a certain moment in time, the mortality design pattern dit not apply.

### Design Patterns Not Used
Since the scope of this project is really only limited to the uploading of files, the following design patters were not necessary:

- **Pull over Push Payments:** This design pattern does not apply, as I do not tranfer ether to other users.
- **Contract Mortality:** As previously mentioned, it is not needed for the contract to ever expire, therefore it is not mortal.
- **State Machine:** The state of the contract does not change over the period of time, so the State Machine design pattern is not necessary.



  

