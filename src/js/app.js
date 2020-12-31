App = {
  web3Provider: null,
  contracts: {},
  ipfsHash: null,
  myTotalProofs: null,
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

  /**
  Get proofs from blockchain
  **/
  loadProofs: function () {
    if (window.location.href == "http://localhost:3000/dashboard.html") {
      setTimeout(async function () {

        let Mytitles;
        let Mysummaries;
        let Myhashes;
        let Mytimestamps;
        let Mytags;
        let deployed;
        App.contracts.POE.deployed()
          .then((instance) => {
            deployed = instance;
            return deployed.getTotalOwnerProofs();
          }).then((result) => {
            App.myTotalProofs = result.c["0"]
          }).then((result) => {
            return deployed.getTotalProofs();
          }).then((result) => {
            App.totalProofs = result.c["0"]

          }).then((result) => {
            // console.log("my total proofs:" + App.myTotalProofs)
            // console.log("total proofs:" + App.totalProofs)
            // get titles
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerTitles(App.myTotalProofs);
              }).then((result) => {
                Mytitles = result
                // console.log("titles " + Mytitles)
              })

            //get summaries
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerSummaries(App.myTotalProofs);
              }).then((result) => {
                Mysummaries = result
                // console.log("summaries " + Mysummaries)
              })

            //get hashes
            Myhashes = ["", ]

            App.contracts.POE.deployed().then(function (instance) {

              for (var i = 0; i < App.totalProofs; i++) {
                thishash = instance.getIPFS(i).then((result) => {
                  if (result != "") {
                    Myhashes.push(result)
                  }

                })
              }
            }).then((result) => {
              // console.log("hashes " + Myhashes)
            })


            Mytimestamps = ["", ]
            //get timestamps
            App.contracts.POE.deployed().then(function (instance) {

              for (var i = 0; i < App.totalProofs; i++) {
                thishash = instance.getTS(i).then((result) => {

                  if (result != 0) {
                    Mytimestamps.push(result)
                  }
                })
              }
            }).then((result) => {
              // console.log("hashes " + Mytimestamps)
            })

            //get tags
            App.contracts.POE.deployed()
              .then((instance) => {
                deployed = instance;
                return deployed.getOwnerTags(App.myTotalProofs);
              }).then((result) => {
                Mytags = result
                // console.log("tags " + Mytags)
              }).then((result) => {
                var i;
                for (i = 1; i <= App.myTotalProofs; i++) {
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

  /**
  Convert UNIX time
  **/
  UNIXtoDate: function (unixTime) {

    var timestamp = new Date(0);
    timestamp.setUTCSeconds(unixTime);
    return timestamp
  },

  /**
  Fetch proofs and generate UI
  **/
  generateProofs: function () {

    setTimeout(async function () {
      if (App.myTotalProofs !== 0) {

        // hide/show elements
        document.getElementsByClassName("gallery")["0"].style.display = "block";
        document.getElementsByClassName("gallery")["1"].style.display = "block";
        document.getElementsByClassName("empty")["0"].style.display = "none";

        var i;
        for (i = 0; i < App.myTotalProofs; i++) {

          ListItem = document.createElement('li');
          ListItem.className = "cards_item"
          mainDiv = document.createElement('div');
          mainDiv.className = "card"
          div1 = document.createElement('div');
          div2 = document.createElement('div');
          div1.className = "card_image"
          div2.className = "card_content"

          image_source = "https://gateway.ipfs.io/ipfs/" + App.MyProofs[i][1]

          img = "<img src ='" + image_source + "' onerror='imgError(this);'>"

          div1.insertAdjacentHTML('beforeend', img);

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


          p5.innerHTML = App.UNIXtoDate(App.MyProofs[i][3])

          p6 = document.createElement('p');
          p6.className = "card_text smalltext"
          p6.innerHTML = "TAGS"


          // for loop creating tags
          tags = App.MyProofs[i][4].split(',');
          spans = []
          var p;
          for (p = 0; p < tags.length; p++) {
            temp_span = document.createElement('span');
            temp_span.className = "card_text tag"
            temp_span.innerHTML = tags[p]
            spans.push(temp_span)
          }

          button = document.createElement('button');
          link = document.createElement('a');
          button.className = "btn card_btn"

          button.innerHTML = "View on IPFS"
          link.href = "https://gateway.ipfs.io/ipfs/" + App.MyProofs[i][1]
          link.style = "text-decoration:none;"

          link.appendChild(button)
          div2.appendChild(h2)
          div2.appendChild(p1)
          div2.appendChild(p2)
          div2.appendChild(p3)
          div2.appendChild(p4)
          div2.appendChild(p5)
          div2.appendChild(p6)
          
          // for loop appending 
          var s;
          for (s = 0; s < spans.length; s++) {
            div2.appendChild(spans[s])
          }

          div2.appendChild(link)

          mainDiv.appendChild(div1)
          mainDiv.appendChild(div2)
          ListItem.appendChild(mainDiv)
          document.getElementsByClassName("cards")["0"].appendChild(ListItem)

        }
      }
    }, 300);


  },

  search: function () {
    console.log("YESSS")
  },

  /**
  Saves proof to blockchain.
  **/
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
    if (listTags.length == 0) {
      tags += document.getElementById("text").value
    } else {
      tags += "," + document.getElementById("text").value
    }
    if (tags.charAt(tags.length - 1) == ",") {
      tags = tags.slice(0, -1)
    }

    try {
      App.contracts.POE.deployed().then(function (i) {

        i.submitProof(hash, title, summary, tags, {
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

  /**
  Gets IPFS hash
  **/
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

/**
Check Metamask and monitor account changes
**/
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
  Bootstrap Alerts
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

/**
Sets image to default if uploaded doc is not a graphic.
**/
function imgError(image) {
  image.onerror = "";
  image.src = "../images/default_proof.png";
  return true;
}
setInterval(function () {
  ethereum.on('accountsChanged', function (accounts) {
    location.reload()
  })
}, 2000);