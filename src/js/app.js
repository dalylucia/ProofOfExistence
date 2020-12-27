

App = {
  web3Provider: null,
  contracts: {},
  ipfsHash: null,
  MyProofs: [],

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
    contract = $.getJSON('ProofOfExistence.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var POEArtifact = data;
      
      App.contracts.POE = TruffleContract(POEArtifact);

      // Set the provider for our contract
      App.contracts.POE.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the adopted pets
      return App.contracts.POE
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', "#createProof", App.saveProofToBlockchain);
    $(document).on('change', "#upload", App.getIPFShash);
    App.loadProofs();
  },




loadProofs:  function() {
  if (window.location.href == "http://localhost:3000/dashboard.html") {
    setTimeout(async function() { 

      // // get total proofs
      let totalProofs;
     
      let Mytitles;
      let Mysummaries;
      let Myhashes;
      let Mytimestamps;
      let Mytags;

      App.contracts.POE.deployed()
        .then((instance) => {
          deployed = instance;
          return deployed.getTotalOwnerProofs();
        }).then((result) => {
          totalProofs = result.c["0"]
        }).then((result) => {
          console.log("total proofs:" + totalProofs)
          // get titles
          App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getOwnerTitles(totalProofs);
          }).then((result) => {
            Mytitles = result
            console.log("titles " + Mytitles)
          })

          //get summaries
          App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getOwnerSummaries(totalProofs);
          }).then((result) => {
            Mysummaries = result
            console.log("summaries " + Mysummaries)
          })

          //get hashes
          App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getOwnerHashes(totalProofs);
          }).then((result) => {
            Myhashes = result
            console.log("hashes " + Myhashes)
          })

          //get timestamps
          App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getOwnerTimestamps(totalProofs);
          }).then((result) => {
            Mytimestamps = result
            console.log("timestamps " + Mytimestamps)
          })

          //get tags
          App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getOwnerTags(totalProofs);
          }).then((result) => {
            Mytags = result
            console.log("tags " + Mytags)
          })

        }).then((result) => {
          // add fields to MyProof array
          setTimeout(async function() { 
          var i;
          for (i = 1; i <= totalProofs; i++) {
            proof = [Mytitles[i], Myhashes[i], Mysummaries[i], Mytimestamps[i], Mytags[i]]
            App.MyProofs.push(proof)
            
          }
          return App.generateProofs();
        },30 );

        });
    },20 );
  }
  
  
    },

    generateProofs: function() {
      // TODO
    },
   
  saveProofToBlockchain: function() {

    title = document.getElementById("proofTitle").value
    hash = App.ipfsHash
    summary = document.getElementById("proofSummary").value
    tags = document.getElementById("text").value
    
    try {
      App.contracts.POE.deployed().then(function(i) {
        i.submitProof(hash, title, summary, tags, { from: web3.eth.accounts[0], gaslimit: 250000})
        .then(
          App.waitForProof()
          );
        });
        console.log("Calling getTime");
      App.getTime();
    }
    catch(err) {
      showalert(err,'error')
    }
  },

  getTime: function() {
    var instance;

    App.contracts.POE.deployed().then(function(i) {
      instance = i;

      console.log("INSTANCE");
      console.log(instance);

      return instance.getTS.call();
    }).then(function(proofTimeStamp) {
      console.log("TimeStamp");
      console.log("Time:" + proofTimeStamp);

    }).catch(function(err) {
      console.log(err.message);
    });
  },

  waitForProof: async function() {
      App.contracts.POE.deployed().then(meta => {
       
        const event = meta.EvtProofAdded({fromBlock: 'latest',toBlock: 'latest'+1});
        // console.log(allEvents)
        event.watch((err, res) => {
          if (hash == res.args._ipfs && title == res.args._title) {
            window.scrollTo(0,0);
            showalert("Transaction successful. Redirecting to your dashboard...",'notification');

            // setTimeout(function() {
            //   window.location = "dashboard.html";
            // }, 3000)
                      
          }
          
        });
      });
  },

  getIPFShash: function() {
    const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });    
    var reader = new FileReader();
    reader.onload = function (e) {

        const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result);
        ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {
            
            if (err != null) {
              showalert("Could not upload image to IPFS",'error');
            }

      let ipfsLink = "<a href='https://gateway.ipfs.io/ipfs/" + result[0].hash + "'>gateway.ipfs.io/ipfs/" + result[0].hash + "</a>";
      App.ipfsHash = result[0].hash
      
      document.getElementById("link").innerHTML = ipfsLink;
      document.getElementById("createProof").classList.remove("button-default");
        })
    }
    reader.readAsArrayBuffer(this.files[0]);
  },
};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});


function toHome() {
  var accs = web3.eth.accounts.length
  if (web3.currentProvider.isMetamask === false) {
    showalert("Metamask is not available", 'error') 
  } else if (accs == 0){
    showalert("Couldn't retrieve accounts! Make sure you have logged in to Metamask.",'error')
  } else {
    window.location = "dashboard.html";
  }
  document.getElementById("ownerAddress").innerHTML = account;
}


/**
  Bootstrap Alerts -
  Function Name - showalert()
  Inputs - message,alerttype
  Example - showalert("Invalid Login","alert-error")
  Types of alerts -- "alert-error","alert-success","alert-info","alert-warning"
  Required - You only need to add a alert_placeholder div in your html page wherever you want to display these alerts "<div id="alert_placeholder"></div>"
  Written On - 14-Jun-2013
**/
function showalert(message,alerttype) {

  if (alerttype === 'error') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertError"' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
  } else if (alerttype === 'warning') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertWarning"' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');

  } else if (alerttype === 'notification') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertNotification"' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');

  } else {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
  }
  
  // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
  setTimeout(function() {

    $("#alertdiv").remove();

  }, 5000);
}

var account = web3.eth.accounts[0];
var accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    if (window.location.href != "http://localhost:3000/" && window.location.href !=  "http://localhost:3000/index.html#" && window.location.href !=  "http://localhost:3000/index.html") {
      document.getElementById("ownerAddress").innerHTML = account; 
  }
  }
}, 1);


