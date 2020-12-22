// pragma statement
pragma solidity ^0.6.12;

// import statements
import "https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.6.sol";


contract Proof is usingProvable {

    /*===============================
        TYPE DECLARATIONS
    ================================*/

    address proofCreator;
    uint16 proofId;
    uint public proofTimeStamp;
    string proofTitle;
    string proofIPFSHash;
    string proofSummary;
    string proofTags;


    /*===============================
        ENUMS & STRUCTS
    ================================*/

    struct Proof {
        address proofCreator;
        uint16 proofId;
        uint proofTimeStamp;
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

    event NewProvableQuery(string description);
    event NewTimeStamp(string timestamp);

    /*===============================
        FUNCTIONS
    ================================*/

    // Add proof to the blockchain
    function submitProof(string memory _ipfs, string memory _title, string memory _summary, string memory _tags) public {

        // update timestamp
        update();

        // Adding proof to proofs mapping
        proofs[proofCounter] = Proof(
            msg.sender,
            proofCounter,
            proofTimeStamp,
            _ipfs,
            _title,
            _summary,
            _tags
        );

        emit EvtProofAdded(msg.sender, proofCounter, _ipfs, _title);

        // Increment proof counter as it's used as proof ids for future proofs too
        proofCounter++; 
    }

    function __callback(bytes32 queryId, string memory result) {
        if (msg.sender != provable_cbAddress()) revert();
        NewTimeStamp(result);
        proofTimeStamp = result;
    }

    function update() public payable {
        NewProvableQuery("Provable query was sent, waiting for a response...");
        var gasLimit = 200000;
        provable_query("WolframAlpha", "timestamp now", gasLimit);
    }


    /*===============================
        GETTER FUNCTIONS
    ================================*/

    function getIPFS(uint _id) public view returns (string memory x) {
        return proofs[_id].ipfs;
    }

    function getTotalProofs() public view returns (uint x){
        return proofCounter;
    }

    function getOwner(uint _id) public view returns (address x) {
        return proofs[_id].owner;
    }

    function getDescription(uint _id) public view returns (string memory x) {
        return proofs[_id].description;
    }

    function getTitle(uint _id) public view returns (string memory x) {
        return proofs[_id].title;
    }

}