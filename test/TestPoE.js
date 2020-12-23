const PoE = artifacts.require("./ProofOfExistence.sol");

contract('ProofOfExistence', function(accounts){

    // Can be deployed
    it("Can be deployed.", async () => {
        let proofContractInstance = await ProofContract.deployed();
        // Can also do something like this: assert.equal(web3.eth.getCode(proofContractInstance.address), "0x0", "Proof contract has been destroyed.");
        return assert.notEqual(proofContractInstance, undefined, "Proof contract has been deployed.");
    });

    // Can upload new piece of proof and update total proof count
    it("Can upload new piece of proof and update total proof count", async () => {
        let proofContractInstance = await ProofOfExistence.deployed();
        await proofContractInstance.submitProof(/*TODO*/);
        let totalProofs = await proofContractInstance.getTotalProofs.call();       
        return assert.equal(totalProofs, 1, "Public proofs mapping contains 1 proof.");
    });

    // Can upload new piece of proof with correct owner
    it("Can upload new piece of proof with correct owner", async () => {
        let proofContractInstance = await ProofOfExistence.deployed();
        let proofOwner = await proofContractInstance.getOwner(0);
        return assert.equal(proofOwner, accounts[0], "Owner of first proof is first account.");
    });


    /* ADD IS DESTRUCTIBLE */
    // Can not be destroyed by accounts other than the owner
    it("Can not be destroyed by accounts other than the owner.", async () => {
        let proofContractInstance = await ProofOfExistence.deployed();
        try {
            await proofContractInstance.destroy({from: accounts[1]}); // If this does not throw an error, there is a problem
        } catch(error) {
            // console.log('This is the error returned by trying to destroy a contract as a non-owner: ', error);
            return assert.isTrue(true, "Proof contract has not been destroyed.");
        }
        return assert.isTrue(false, "Proof contract has been destroyed by non-owner.");
    });

});