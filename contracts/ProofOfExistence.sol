
// pragma statement
pragma solidity ^0.6.12;

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

    event NewProvableQuery(string description);
    event NewTimeStamp(string timestamp);

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
            _ipfs,
            _title,
            _summary,
            _tags
        );

        emit EvtProofAdded(msg.sender, proofCounter, _ipfs, _title);

        // Increment proof counter as it's used as proof ids for future proofs too
        proofCounter++; 
    }

    function __callback(string memory result) public {
        if (msg.sender != provable_cbAddress()) revert();
        NewTimeStamp(result);
        proofTimeStamp = result;
    }

    function update() public payable {
        NewProvableQuery("Provable query was sent, waiting for a response...");
        uint256 gasLimit = 2000000;
        provable_query("WolframAlpha", "timestamp now", gasLimit);
    }

    function balance() public view returns(uint256)  {
        return msg.sender.balance;
    }

    function getTS() public view returns(string memory) {
        return proofTimeStamp;
    }

    /*===============================
        GETTER FUNCTIONS
    ================================*/

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

}
