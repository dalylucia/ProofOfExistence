App = {
  web3Provider: null,
  contracts: {},
  ipfsHash: null,
  totalProofs: null,
  MyProofs: [],

  initWeb3: async function () {
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


  initContract: function () {
    contract = $.getJSON('ProofOfExistence.json', function (data) {
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

  bindEvents: function () {
    $(document).on('click', "#createProof", App.saveProofToBlockchain);
    $(document).on('change', "#upload", App.getIPFShash);
    App.loadProofs();
  },




  loadProofs: function () {
    if (window.location.href == "http://localhost:3000/dashboard.html") {
      setTimeout(async function () {

        // // get total proofs

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
            App.totalProofs = result.c["0"]
          }).then((result) => {
            console.log("total proofs:" + App.totalProofs)
            // get titles
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerTitles(App.totalProofs);
              }).then((result) => {
                Mytitles = result
                console.log("titles " + Mytitles)
              })

            //get summaries
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerSummaries(App.totalProofs);
              }).then((result) => {
                Mysummaries = result
                console.log("summaries " + Mysummaries)
              })

            //get hashes
            Myhashes = ["",]

            App.contracts.POE.deployed().then(function (instance) {

              for (var i = 0; i < App.totalProofs; i++) {
                thishash = instance.getIPFS(i).then((result) => {
                  Myhashes.push(result)
                })

              }
            }).then((result) => {
              
                console.log("hashes " + Myhashes)
              

            })



            //get timestamps
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerTimestamps(App.totalProofs);
              }).then((result) => {
                Mytimestamps = result
                console.log("timestamps " + Mytimestamps)
              })

            //get tags
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerTags(App.totalProofs);
              }).then((result) => {
                Mytags = result
                console.log("tags " + Mytags)
              }).then((result) => {
                  var i;
                  for (i = 1; i <= App.totalProofs; i++) {
                    proof = [Mytitles[i], Myhashes[i], Mysummaries[i], Mytimestamps[i], Mytags[i]]
                    App.MyProofs.push(proof)

                  }

              })

          }).then((result) => {
              
            App.generateProofs()
          
          })
      }, 20);
    }


  },

  generateProofs: function () {
    console.log(App.MyProofs)
    setTimeout(async function () {
      if (App.totalProofs !== 0) {

        // hide/show elements
        document.getElementsByClassName("gallery")["0"].style.display = "block";
        document.getElementsByClassName("empty")["0"].style.display = "none";

        var i;
        for (i = 0; i < App.totalProofs; i++) {

          ListItem = document.createElement('li');
          ListItem.className = "cards_item"
          mainDiv = document.createElement('div');
          mainDiv.className = "card"
          div1 = document.createElement('div');
          div2 = document.createElement('div');
          div1.className = "card_image"
          div2.className = "card_content"
          img = document.createElement('img');
          // https://gateway.ipfs.io/ipfs/QmbhwGwG7YyZtpnhNwtWmr75H7Ct8tQ7oV6xDPUxyFJeio
          // gateway.ipfs.io/ipfs/QmZwyEvzRxJBEffE9XUnZoEMM1JqZWyXJpEbdUAXsJn3Cj
          image_source = "https://gateway.ipfs.io/ipfs/" + App.MyProofs[i][1]
          // console.log(image_source)
          img.src = image_source
          div1.appendChild(img)

          h2 = document.createElement('h2');
          h2.className = "card_title"
          h2.innerHTML = App.MyProofs[i][0]

          p1 = document.createElement('p');
          p1.className = "card_text"
          p1.innerHTML = App.MyProofs[i][2]

          p2 = document.createElement('p');
          p2.className = "card_text smalltext"
          p2.innerHTML = "HASH"

          p3 = document.createElement('p');
          p3.className = "card_text hashNumber"
          p3.innerHTML = App.MyProofs[i][1]

          p4 = document.createElement('p');
          p4.className = "card_text smalltext"
          p4.innerHTML = "TIMESTAMP"

          p5 = document.createElement('p');
          p5.className = "card_text hashNumber"
          p5.innerHTML = App.MyProofs[i][3]

          p6 = document.createElement('p');
          p6.className = "card_text smalltext"
          p6.innerHTML = "TAGS"


          // for loop creating tags
          span1 = document.createElement('span');
          span1.className = "card_text tag"
          span1.innerHTML = App.MyProofs[i][4]



          div2.appendChild(h2)
          div2.appendChild(p1)
          div2.appendChild(p2)
          div2.appendChild(p3)
          div2.appendChild(p4)
          div2.appendChild(p5)
          div2.appendChild(p6)
          // for loop appending 
          div2.appendChild(span1)
          // div2.appendChild(span2)
          // end for loop
          // div2.appendChild(button)

          mainDiv.appendChild(div1)
          mainDiv.appendChild(div2)
          ListItem.appendChild(mainDiv)
          // console.log(ListItem)
          document.getElementsByClassName("cards")["0"].appendChild(ListItem)




        }
      }
    }, 3000);


  },

  saveProofToBlockchain: function () {

    title = document.getElementById("proofTitle").value
    hash = App.ipfsHash
    summary = document.getElementById("proofSummary").value
    tags = ""
    const listTags = document.getElementsByClassName("tags__inner");
    var i;
    for (i = 0; i < listTags.length; i++) {
      if (i == 0) {
        tags += listTags[i].innerHTML;
      } else {
        tags += "," + listTags[i].innerHTML;
      }

    }
    if (document.getElementById("text").value != "") {
      tags += "," + document.getElementById("text").value
    }

    try {
      App.contracts.POE.deployed().then(function (i) {
        // get timestamp
        var t = App.getTime().toString();
        i.submitProof(hash, title, summary, tags, t, {
            from: web3.eth.accounts[0],
            gaslimit: 250000
          })
          .then(
            App.waitForProof()
          );
      });


    } catch (err) {
      showalert(err, 'error')
    }
  },

  getTime: function () {
    var d = new Date();
    var n = d.getTime();
    return n;
  },

  waitForProof: async function () {
    App.contracts.POE.deployed().then(meta => {

      const event = meta.EvtProofAdded({
        fromBlock: 'latest',
        toBlock: 'latest' + 1
      });
      // console.log(allEvents)
      event.watch((err, res) => {
        if (hash == res.args._ipfs && title == res.args._title) {
          window.scrollTo(0, 0);
          showalert("Transaction successful. Redirecting to your dashboard...", 'notification');

          setTimeout(function () {
            window.location = "dashboard.html";
          }, 3000)

        }

      });
    });
  },

  getIPFShash: function () {
    const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', {
      protocol: 'https'
    });
    var reader = new FileReader();
    reader.onload = function (e) {

      const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result);
      ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {

        if (err != null) {
          showalert("Could not upload image to IPFS", 'error');
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

$(function () {
  $(window).load(function () {
    App.initWeb3();
  });
});


function toHome() {
  var accs = web3.eth.accounts.length
  if (web3.currentProvider.isMetamask === false) {
    showalert("Metamask is not available", 'error')
  } else if (accs == 0) {
    showalert("Couldn't retrieve accounts! Make sure you have logged in to Metamask.", 'error')
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
function showalert(message, alerttype) {

  if (alerttype === 'error') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertError"' + alerttype + '"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>');
  } else if (alerttype === 'warning') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertWarning"' + alerttype + '"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>');

  } else if (alerttype === 'notification') {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert alertNotification"' + alerttype + '"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>');

  } else {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert' + alerttype + '"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>');
  }

  // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
  setTimeout(function () {

    $("#alertdiv").remove();

  }, 5000);
}

var account = web3.eth.accounts[0];
var accountInterval = setInterval(function () {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    if (window.location.href != "http://localhost:3000/" && window.location.href != "http://localhost:3000/index.html#" && window.location.href != "http://localhost:3000/index.html") {
      document.getElementById("ownerAddress").innerHTML = account;
    }
  }
}, 1);