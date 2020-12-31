var PoE = artifacts.require("./ProofOfExistence.sol");

contract('ProofOfExistence', function (accounts) {

	// Can the dApp be delployed
	it("dApp can be deployed.", async () => {
		let proofContractInstance = await PoE.deployed();
		return assert.notEqual(proofContractInstance, undefined, "Proof that the dApp can be deployed.");
	});

	// ProofCount is incremented when a proof is added
	it("Can upload new piece of proof and update proofCounter", async () => {
		let proofContractInstance = await PoE.deployed();
		await proofContractInstance.submitProof("ipfshash", "proofTitle", "proofSummary", "proofTags");
		let totalProofs = await proofContractInstance.getTotalProofs.call();
		return assert.equal(totalProofs, 1, "Total proofs incremented by 1.");
	});

	// Can upload new document with correct owner
	it("Can upload new document with correct owner", async () => {
		let proofContractInstance = await PoE.deployed();
		let proofOwner = await proofContractInstance.getOwner(0);
		return assert.equal(proofOwner, accounts[0], "Owner of first proof belongs to first account.");
	});

	// Can not be destroyed by accounts other than the owner
	it("Can not be destroyed by accounts other than the owner.", async () => {
		let proofContractInstance = await PoE.deployed();
		try {
			await proofContractInstance.destroy({
				from: accounts[1]
			});
		} catch (error) {
			return assert.isTrue(true, "Proof contract has not been destroyed.");
		}
		return assert.isTrue(false, "Proof contract has been destroyed by non-owner.");
	});

	// Hash can be generated
	it("Hash can be generated.", async () => {
		let proofContractInstance = await PoE.deployed();
		
		await proofContractInstance.submitProof("ipfshash", "proofTitle", "proofSummary", "proofTags");

		let hash = await proofContractInstance.getIPFS(0);

		return assert.equal(hash, "ipfshash", "Successfully generated hash.");
	});

});