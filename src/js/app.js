
// const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
 
App = {
  web3Provider: null,
  contracts: {},
  


  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },


  initContract: function() {
    contract = $.getJSON('Blockproof.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var BpArtifact = data;
      App.contracts.BlockProof = TruffleContract(BpArtifact);

      // Set the provider for our contract
      App.contracts.BlockProof.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the adopted pets
      return App.contracts.BlockProof
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', "#createProof", App.saveProofToBlockchain);
  },

  saveProofToBlockchain: function() {
    // test proof
    var proof = '{ "test_proof" : [' +
    '{ "title":"test_title" , "ipfs_hash":"12343434" , "summary": "testsummary", "tags" :"t1, t2" }]}';
    var obj = JSON.parse(proof);
    var params = obj.test_proof["0"]
    
    console.log(params["title"])
    App.contracts.BlockProof.deployed().then(function(i) {
      i.createProof(params["title"], params["ipfs_hash"], params["summary"], params["tags"], {
        from: web3.eth.accounts[0]
      })
        .then(proofCreated)
        .catch(function(e) {
          // $("#loader").hide();
          // $("#fail").show();
          // $("#fail").html(e.message);
          // $("#createproofbutton").attr("disabled", false);
        });
    });
  },

  // handleAdopt: function(event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   var adoptionInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];

  //     App.contracts.Adoption.deployed().then(function(instance) {
  //       adoptionInstance = instance;

  //       // Execute adopt as a transaction by sending account
  //       return adoptionInstance.adopt(petId, {from: account});
  //     }).then(function(result) {
  //       return App.markAdopted();
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // }

};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});




function toHome() {
  var accs = web3.eth.accounts.length
  if (web3.currentProvider.isMetamask === false) {
    console.log("Metamask is not available") 
  } else if (accs == 0){
    console.log("Couldn't retrieve accounts! Make sure you have logged in to Metamask.")
  } else {
    window.location = "dashboard.html";
    // document.getElementById("ownerAddress").innerHTML = account;
  }


}

var account = web3.eth.accounts[0];
var accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    if (window.location.href == "http://localhost:3000/dashboard.html") {
      document.getElementById("ownerAddress").innerHTML = account;
    }
      
  }
}, 1);



function proofCreated() {
  let proofEvent;
  contract.Blockproof.deployed().then(function(i) {
    proofEvent = i.newProofCreated({ fromBlock: 0, toBlock: "latest" });
    // proofEvent.watch(function(err, result) {
    //   if (err) {
    //     $("#loader").hide();
    //     $("#fail").show();
    //     $("#fail").html("Error while creating the proof!");
    //     return;
    //   } else {
    //     $("#loader").hide();
    //     $("#msg").show();
    //     $("#msg").html("Proof of Existence successfully created!");
    //   }
    // });
  });
}