pragma solidity ^0.6.12;
import "external_contracts/provableAPI_0.6.sol";

/// @title A contract to save time-stamped hash of images and documents on IPFS to prove existence of an entity
/// at that point in time
/// @author Tanmay Bhardwaj
/// @notice This contract can only be used to create proof of existence of an entity and may not be suitable to
/// prove its legal ownership 
/// @dev All function calls are currently implement without side effects

contract Blockproof is usingProvable {
    /*=================================
    =            MODIFIERS            =
    =================================*/
    modifier onlyOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    modifier stopInEmergency {
        if (!stopped) _; 
    }
    
    modifier onlyInEmergency { 
        if (stopped) _; 
    }

    /*=================================
    =            CONFIGURABLES            =
    ===================================*/
    address payable contractOwner;
    address proofCreator;  
    uint16  proofId;
    uint    proofTimeStamp;
    string  proofTitle;  
    string  proofIpfsHash;
    string  proofRemarks;
    string  proofTags; 
    bool    private  stopped;
    uint    constant proofTitleLength       = 15;
    uint    constant proofIpfsHashLength    = 46;
    uint    constant proofRemarksLength     = 40;
    uint    constant proofTagsLength        = 10;
    
    /*=================================
    =            EVENTS               =
    ==================================*/
    
    event timestampNow(uint _proofTimeStamp);
    event newProofCreated(uint _proofId, address _proofCreator, string _proofTitle, 
        string _proofIpfsHash, string _proofRemarks, string _proofTags, uint _proofTimeStamp);    

    /*================================
    =            DATASETS            =
    ==================================*/
/// @notice mapping of document hash and user address
    mapping (uint => Proof) idToProof;

    // Struct to store document details
    struct Proof {
        uint16   id;
        uint     timestamp;
        address  creator; 
        string   ipfshash;          
    }
    
    /*================================
    =            FUNCTIONS           =
    ==================================*/
/// @notice This is the constructor function
/// @dev 
    constructor() public payable {
        contractOwner = msg.sender;
        proofId = 0;
        stopped = false;
        OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }
    
/// @notice This is the fallback function in case someone sends ether to the contract
    fallback() external payable  {}
    receive() external payable  {}

    
/// @notice This function is to send ether to this contract    
    function deposit() payable public {
        // nothing to do!
    }

/// @notice This function is to get ether balance of this contract    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

/// @notice This function is used to withdraw balance of this contract, it can be invoked only by contract owner
    function withdraw() public onlyOwner {
            msg.sender.transfer(address(this).balance);
        }
        
/// @notice This function will destroy this contract and can be invoked only by contract owner 
    function kill() public onlyOwner {
        selfdestruct(contractOwner);
   }

/// @notice This function will work as circuit breaker to enable or disable a function is case of any 
/// any emergency. It can be invoked only by contract owner.
/// @return  Bool status of emergency circuit breaker
    function toggle_active() onlyOwner public returns(bool){
      stopped = !stopped;
      return stopped;
    }
   
/// @notice This function received ipfs hash and title of the document from front end and calls another function 
/// to Oraclize 'WolframAlpha' Service to get current timestamp
/// @dev It is necessary to pass document hash and ipfs hash to this function    
/// @param  _title : title of the document sent from front end   
/// @param _ipfshash : ipfs hash of the document sent from front end
/// @param _proofremarks : remarks given to the document sent from front end
/// @param _prooftags : tags given to the document sent from front end

    function createProof (string memory _title, string memory _ipfshash, string memory _proofremarks, string memory _prooftags)
        payable public {        
    assert ((bytes(_title).length > 0) && (bytes(_title).length <= proofTitleLength));
    assert ((bytes(_ipfshash).length > 0) && (bytes(_ipfshash).length == proofIpfsHashLength));
    assert (bytes(_proofremarks).length <= proofRemarksLength);
    assert (bytes(_prooftags).length <= proofTagsLength); 
    proofId += 1;
    proofTitle = _title;
    proofCreator = msg.sender;
    proofIpfsHash = _ipfshash;
    proofRemarks = _proofremarks; 
    proofTags = _prooftags; 
    
/// Call Oraclize to get current timestamp
    update();
    }

/// @notice This function returns details of the proof saved. For a given proof ID, it will return data only if the sender is 
/// creator of the proof
/// @param _proofId : Unique Id associated with the proof
/// @return existingProof.timestamp : Timestamp 
/// @return existingProof.creator : Address of the creator
/// @return existingProof.ipfshash : Hash of the document
    function getDetailsByIndex (uint _proofId) view public 
        returns (uint, address, string memory)
    {
        Proof memory existingProof = idToProof[_proofId];
        if (msg.sender != existingProof.creator)
         {revert();}
        else {
        return 
        (existingProof.timestamp, existingProof.creator, existingProof.ipfshash); 
        }
    }
    
/// @notice This function will send Oraclize request to get current time stamp 
    function update() payable public {
        uint24 gasLimit = 200000;
        provable_query("WolframAlpha", "timestamp now", gasLimit);
    }
    
/// @notice This function is callback from Oraclize and returns current timestamp. From this function, we call another function which 
/// will execute logic to store the information related to the proof. myid : unique id of the Oraclize transaction

    function __callback(string memory result) public{
        proofTimeStamp = parseInt(result);
        emit timestampNow(proofTimeStamp);
        _saveTheProof(proofTimeStamp);
    }
    
/// @notice This function will store proof related details in the 'Proof' mapping 
/// @param _proofTimeStamp : Timestamp 
    function _saveTheProof(uint _proofTimeStamp) private  {    
    Proof memory newProof = Proof(proofId, _proofTimeStamp, proofCreator, proofIpfsHash); 
    idToProof[proofId]=newProof;
    emit newProofCreated(proofId, proofCreator, proofTitle, proofIpfsHash, proofRemarks, proofTags, _proofTimeStamp);
    }     
}
