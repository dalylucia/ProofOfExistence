// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title A contract that submites poofs/documents to the blockchain
/// @author Lucia Daly
/// @notice You can use this contract for basic uploading of documents.
/// @dev All function calls are currently implemented without side effects
contract ProofOfExistence is Ownable, Pausable {
    /********************************
        CONSTRUCTOR
    ********************************/

    constructor() public {
        Ownable(msg.sender);
    }

    /********************************
        TYPE DECLARATIONS
    ********************************/

    address proofCreator;
    uint16 proofId;
    uint256 public proofTimeStamp;
    string proofTitle;
    string proofIPFSHash;
    string proofSummary;
    string proofTags;

    /********************************
        ENUMS & STRUCTS
    ********************************/

    struct Proof {
        address proofCreator;
        uint256 proofId;
        uint256 proofTimeStamp;
        string proofTitle;
        string proofIPFSHash;
        string proofSummary;
        string proofTags;
    }

    /********************************
        STATE VARIABLES
    *********************************/

    mapping(uint256 => Proof) public proofs;
    uint256 public proofCounter = 0;

    /********************************
        EVENT DECLARATION
    *********************************/

    event EvtProofAdded(
        address indexed _owner,
        uint256 _id,
        string _ipfs,
        string _title
    );

    event LogNewProvableQuery(string description);
    event LogNewTimeStamp(string timestamp);

    /********************************
        FUNCTIONS
    *********************************/

    /// @notice Add proof to the blockchain
    function submitProof(
        string memory _ipfs,
        string memory _title,
        string memory _summary,
        string memory _tags
    ) public {
        proofTimeStamp = block.timestamp;

        /// @notice Adding proof to proofs mapping
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

        /// @notice Increment proof counter as it's used as proof ids for future proofs too
        proofCounter++;
    }

    /********************************
        GETTER FUNCTIONS
    ********************************/

    /**
    @notice Get the timestamp of the proof only created by the owner
    @param _id Integer value <= total ProofCount
    */
    function getTS(uint256 _id) public view returns (uint256) {
        if (msg.sender == proofs[_id].proofCreator) {
            return proofs[_id].proofTimeStamp;
        }
    }

    /** 
    @notice Get the total number of proofs for a specific owner 
    @return counter number of proofs owned by msg.sender
    */
    function getTotalOwnerProofs() public view returns (uint256 counter) {
        counter = 0;
        for (uint256 i = 0; i < proofCounter; i++) {
            if (msg.sender == proofs[i].proofCreator) {
                counter++;
            }
        }
        return counter;
    }

    /**
    @notice Get the titles of each proof owned by a specific owner
    @param _totalOwnerProofs The total number of proof owned by msg.sender
    @return titles of all the proofs
    */
    function getOwnerTitles(uint256 _totalOwnerProofs)
        public
        view
        returns (string[] memory)
    {
        _totalOwnerProofs++;

        string[] memory titles = new string[](_totalOwnerProofs);
        uint256 index = 0;
        for (uint256 i = 0; i < proofCounter; i++) {
            if (msg.sender == proofs[i].proofCreator) {
                titles[index] = proofs[i].proofTitle;
                index++;
            }
        }
        return titles;
    }

    /**
    @notice Get the summaries of each proof owned by a specific owner
    @param _totalOwnerProofs The total number of proof owned by msg.sender
    @return summaries of all the proofs
    */
    function getOwnerSummaries(uint256 _totalOwnerProofs)
        public
        view
        returns (string[] memory)
    {
        _totalOwnerProofs++;

        string[] memory summaries = new string[](_totalOwnerProofs);
        uint256 index = 0;
        for (uint256 i = 0; i < proofCounter; i++) {
            if (msg.sender == proofs[i].proofCreator) {
                summaries[index] = proofs[i].proofSummary;
                index++;
            }
        }
        return summaries;
    }

    /**
    @notice Get the timestamps of each proof owned by a specific owner
    @param _totalOwnerProofs The total number of proof owned by msg.sender
    @return timestamps of all the proofs
    */
    function getOwnerTimestamps(uint256 _totalOwnerProofs)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory timestamps = new uint256[](_totalOwnerProofs);
        uint256 index = 0;
        for (uint256 i = 0; i < proofCounter; i++) {
            if (msg.sender == proofs[i].proofCreator) {
                timestamps[index] = proofs[i].proofTimeStamp;
                index++;
            }
        }
        return timestamps;
    }

    /**
    @notice Get the proof tags of each proof owned by a specific owner
    @param _totalOwnerProofs The total number of proof owned by msg.sender
    @return tags of all the proofs
    */
    function getOwnerTags(uint256 _totalOwnerProofs)
        public
        view
        returns (string[] memory)
    {
        _totalOwnerProofs++;

        string[] memory tags = new string[](_totalOwnerProofs);
        uint256 index = 0;
        for (uint256 i = 0; i < proofCounter; i++) {
            if (msg.sender == proofs[i].proofCreator) {
                tags[index] = proofs[i].proofTags;
                index++;
            }
        }
        return tags;
    }

    /**
    @notice Get the IPFS hashes of each proof owned by a specific owner
    @param _id The total number of proof owned by msg.sender
    */
    function getIPFS(uint256 _id) public view returns (string memory) {
        if (msg.sender == proofs[_id].proofCreator) {
            return proofs[_id].proofIPFSHash;
        }
    }

    /**
    @notice Get the owner of a specified proof
    @param _id number <= proofCounter
    */
    function getOwner(uint256 _id) public view returns (address) {
        return proofs[_id].proofCreator;
    }

    /**
    @notice Get the the total number of proofs
    @return proofCounter that tracks the total number of proofs
    */
    function getTotalProofs() public view returns (uint256) {
        return proofCounter;
    }
}
