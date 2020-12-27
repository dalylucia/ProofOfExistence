
// pragma statement
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;
// import statements
import "../external_contracts/provableAPI_0.6.sol";


contract ProofOfExistence is usingProvable {

    /*===============================
        TYPE DECLARATIONS
    ================================*/

    address proofCreator;
    uint16 proofId;
    string public proofTimeStamp;
    string proofTitle;
    string proofIPFSHash;
    string proofSummary;
    string proofTags;

    uint    constant proofTitleLength       = 15;
    uint    constant proofIpfsHashLength    = 46;
    uint    constant proofRemarksLength     = 40;
    uint    constant proofTagsLength        = 10;


    /*===============================
        ENUMS & STRUCTS
    ================================*/

    struct Proof {
        address proofCreator;
        uint proofId;
        string proofTimeStamp;
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
        CONSTRUCTOR
    ================================*/

    constructor()
        public
    {
        // update(); // Update on contract creation...
    }

    /*===============================
        FUNCTIONS
    ================================*/

    // Add proof to the blockchain
    function submitProof(string memory _ipfs, string memory _title, string memory _summary, string memory _tags) public {
        assert ((bytes(_title).length > 0) && (bytes(_title).length <= proofTitleLength));
        assert ((bytes(_ipfs).length > 0) && (bytes(_ipfs).length == proofIpfsHashLength));
        assert (bytes(_summary).length <= proofRemarksLength);
        assert (bytes(_tags).length <= proofTagsLength); 
        // update timestamp
        // update();

        proofTimeStamp = "2020";
    
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

    function __callback(string memory _result) public {
        require(msg.sender == provable_cbAddress());
        proofTimeStamp = _result;
        emit LogNewTimeStamp(proofTimeStamp);
    }

    function update() public payable {
        emit LogNewProvableQuery("Provable query was sent, waiting for a response...");
        provable_query("WolframAlpha", "timestamp now");
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    /*===============================
        GETTER FUNCTIONS
    ================================*/
    function balance() public view returns(uint256)  {
        return msg.sender.balance;
    }

    function getTS() public view returns(string memory) {
        return proofTimeStamp;
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
    
    function getOwnerTimestamps(uint _totalOwnerProofs) public view returns (string[] memory) {
        _totalOwnerProofs ++;
        
        string[] memory timestamps = new string[](_totalOwnerProofs);
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

    function getIPFS(uint _id) public view returns (string memory x) {
        return proofs[_id].proofIPFSHash;
    }

    function getTotalProofs() public view returns (uint x){
        return proofCounter;
    }

    function getOwner(uint _id) public view returns (address x) {
        return proofs[_id].proofCreator;
    }

    function getDescription(uint _id) public view returns (string memory x) {
        return proofs[_id].proofSummary;
    }

    function getTitle(uint _id) public view returns (string memory x) {
        return proofs[_id].proofTitle;
    }

    function getTags(uint _id) public view returns (string memory x) {
        return proofs[_id].proofTags;
    }

    // function getProofs(address _key) public view returns (uint) {
    //     return proofs[_key];
    // }

}
