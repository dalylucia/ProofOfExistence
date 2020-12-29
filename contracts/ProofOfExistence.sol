
// pragma statement
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;


contract ProofOfExistence {

    /*===============================
        TYPE DECLARATIONS
    ================================*/

    address proofCreator;
    uint16 proofId;
    uint256 public proofTimeStamp;
    string proofTitle;
    string proofIPFSHash;
    string proofSummary;
    string proofTags;


    /*===============================
        ENUMS & STRUCTS
    ================================*/

    struct Proof {
        address proofCreator;
        uint proofId;
        uint256 proofTimeStamp;
        string proofTitle;
        string proofIPFSHash;
        string proofSummary;
        string proofTags;
    }

    /*===============================
        STATE VARIABLES
    ================================*/

    mapping (uint => Proof) public proofs;
    uint public proofCounter = 0;


    /*===============================
        EVENT DECLARATION
    ================================*/
    
    event EvtProofAdded(
        address indexed _owner,
        uint _id,
        string _ipfs,
        string _title
    );

    event LogNewProvableQuery(string description);
    event LogNewTimeStamp(string timestamp);


    /*===============================
        FUNCTIONS
    ================================*/

    // Add proof to the blockchain
    function submitProof(string memory _ipfs, string memory _title, string memory _summary, string memory _tags) public {

        proofTimeStamp = block.timestamp;
    
        // Adding proof to proofs mapping
        proofs[proofCounter] = Proof(
            msg.sender,
            proofCounter,
            proofTimeStamp,
            _title,
            _ipfs,
            _summary,
            _tags
        );

        emit EvtProofAdded(msg.sender, proofCounter, _ipfs, _title);

        // Increment proof counter as it's used as proof ids for future proofs too
        proofCounter++; 
    }

    /*===============================
        GETTER FUNCTIONS
    ================================*/
    function balance() public view returns(uint256)  {
        return msg.sender.balance;
    }

    function getTS(uint _id) public view returns(uint256) {
        if(msg.sender == proofs[_id].proofCreator) {
            return proofs[_id].proofTimeStamp;
        }
    }

    function getTotalOwnerProofs() public view returns (uint counter){
        counter = 0;
        for (uint i = 0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                counter++;
            }
        }
        return counter;
    }   

    function getOwnerTitles(uint _totalOwnerProofs) public view returns (string[] memory) {
        _totalOwnerProofs ++;
        
        string[] memory titles = new string[](_totalOwnerProofs);
        uint index = 0;
        for (uint i =0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                titles[index] = proofs[i].proofTitle;
                index++;
            }    
        } 
        return titles;
    }

     function getOwnerSummaries(uint _totalOwnerProofs) public view returns (string[] memory) {
        _totalOwnerProofs ++;
        
        string[] memory summaries = new string[](_totalOwnerProofs);
        uint index = 0;
        for (uint i =0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                summaries[index] = proofs[i].proofSummary;
                index++;
            }    
        } 
        return summaries;
    }

    function getOwnerHashes(uint _totalOwnerProofs) public view returns (string[] memory) {
        _totalOwnerProofs ++;
        
        string[] memory hashes = new string[](_totalOwnerProofs);
        uint index = 0;
        for (uint i =0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                hashes[index] = proofs[i].proofIPFSHash;
                index++;
            }    
        } 
        return hashes;
    }
    
    function getOwnerTimestamps(uint _totalOwnerProofs) public view returns (uint256[] memory) {
        
        
        uint256[] memory timestamps = new uint256[](_totalOwnerProofs);
        uint index = 0;
        for (uint i =0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                timestamps[index] = proofs[i].proofTimeStamp;
                index++;
            }    
        } 
        return timestamps;
    }

    function getOwnerTags(uint _totalOwnerProofs) public view returns (string[] memory) {
        _totalOwnerProofs ++;
        
        string[] memory tags = new string[](_totalOwnerProofs);
        uint index = 0;
        for (uint i =0; i < proofCounter; i++) {
            if(msg.sender == proofs[i].proofCreator) {
                tags[index] = proofs[i].proofTags;
                index++;
            }    
        } 
        return tags;
    }

    function getIPFS(uint _id) public view returns (string memory) {
        if(msg.sender == proofs[_id].proofCreator) {
            return proofs[_id].proofIPFSHash;
        }
    }

    

    function getTotalProofs() public view returns (uint ){
        return proofCounter;
    }

    function getOwner(uint _id) public view returns (address) {
        return proofs[_id].proofCreator;
    }

    function getDescription(uint _id) public view returns (string memory) {
        return proofs[_id].proofSummary;
    }

    function getTitle(uint _id) public view returns (string memory) {
        return proofs[_id].proofTitle;
    }

    function getTags(uint _id) public view returns (string memory) {
        return proofs[_id].proofTags;
    }
}
