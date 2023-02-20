const { expect } = require("chai")
const { ethers } = require("hardhat")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

const merkleHash = (v) => keccak256(v)

const getMerkleTree = (rawLeaves) => {
  const leaves = rawLeaves.map((v) => merkleHash(v))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  return tree
}

const chainlinkVRFCoordinator = ethers.constants.AddressZero 
const passAddress = "0x543D43F390b7d681513045e8a85707438c463d80"
const chainlinkLINKToken = ethers.constants.AddressZero
const chainlinkKeyHash = ethers.constants.HashZero

const deployScaffold = async () => {
  const [
    owner,
    addr1,
    addr2,
    addr3,
    addr4,
    addr5,
    addr6,
    addr7,
    addr8,
    addr9,
    addr10,
    addr11,
    addr12,
    addr13,
    addrHot1,
    addrHot2,
    addrHot3,
    addrHot4,
    addrHot5,
    addrHot6,
    ...others
  ] = await ethers.getSigners()


  const LegacyProxyRegister = await ethers.getContractFactory(
    "LegacyEPSDelegationRegister",
  )
  hhLegacyEPS = await LegacyProxyRegister.deploy()

  const epsRegister = await ethers.getContractFactory(
    "EPSDelegationRegister",
  )
  hhEPS = await epsRegister.deploy()

  // addr4 single delegation to addrHot1
  var tx1 = await hhEPS
    .connect(addr4)
    .transfer(addrHot1.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  // addr5 single delegation to addrHot2
  var tx1 = await hhEPS
    .connect(addr5)
    .transfer(addrHot2.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  // addr6 single delegation to addrHot3
  var tx1 = await hhEPS
    .connect(addr6)
    .transfer(addrHot3.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  // addr7 single delegation to addrHot4
  var tx1 = await hhEPS
    .connect(addr7)
    .transfer(addrHot4.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  // addr8, 9, 10 three delegations to addrHot5
  var tx1 = await hhEPS
    .connect(addr8)
    .transfer(addrHot5.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  var tx1 = await hhEPS
    .connect(addr9)
    .transfer(addrHot5.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  var tx1 = await hhEPS
    .connect(addr10)
    .transfer(addrHot5.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")

  // addr11, 12, 13 three delegations to addrHot6
  var tx1 = await hhEPS
    .connect(addr11)
    .transfer(addrHot6.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")  

  var tx1 = await hhEPS
    .connect(addr12)
    .transfer(addrHot6.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")  

  var tx1 = await hhEPS
    .connect(addr13)
    .transfer(addrHot6.address, 1000)
  expect(tx1).to.emit(hhEPS, "DelegationMade")  

  const pfpContract = await ethers.getContractFactory(
    "PFPTest",
  )
  const hhPFP = await pfpContract.deploy(
    passAddress,
    hhEPS.address,
    chainlinkVRFCoordinator,
    chainlinkLINKToken,
    chainlinkKeyHash
  )

  const leaves = [
    // ________________________________________________________________
    // Addr1    NO EPS    Allowance = 10                         LEAF 0
    // ________________________________________________________________
    ethers.utils.solidityPack( 
      ["address", "string", "uint256"],
      [addr1.address, "_", 10]
    ),
    // ________________________________________________________________
    // Addr2    NO EPS    Allowance = 5                          LEAF 1      
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr2.address, "_", 5],
    ),
    // ________________________________________________________________
    // Addr3    NO EPS    Allowance = 100                        LEAF 2
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr3.address, "_", 100],
    ),
    // ________________________________________________________________
    // Addr4    EPS - single delegation to hot1  Allowance = 50  LEAF 3
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr4.address, "_", 50],
    ),
    // ________________________________________________________________
    // Addr5   EPS - single delegation to hot2   Allowance = 50  LEAF 4
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr5.address, "_", 50],
    ),
    // ________________________________________________________________
    // Addr6   EPS - single delegation to hot3   Allowance = 100 LEAF 5 
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr6.address, "_", 100],
    ),
    // ________________________________________________________________
    // Addr7   EPS - single delegation to hot4   Allowance = 10  LEAF 6
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr7.address, "_", 10],
    ),
    // ________________________________________________________________
    // Addr8   EPS - multi delegation to hot5   Allowance = 10   LEAF 7
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr8.address, "_", 10],
    ), 
    // ________________________________________________________________
    // Addr9   EPS - multi delegation to hot5   Allowance = 25   LEAF 8
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr9.address, "_", 25],
    ), 
    // ________________________________________________________________
    // Addr10   EPS - multi delegation to hot5  Allowance = 15   LEAF 9
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr10.address, "_", 15],
    ), 
    // ________________________________________________________________
    // Addr11   EPS - multi delegation to hot6  Allowance = 10  LEAF 10
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr11.address, "_", 10],
    ),   
    // ________________________________________________________________
    // Addr12   EPS - multi delegation to hot6  Allowance = 10  LEAF 11
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr12.address, "_", 10],
    ),   
    // ________________________________________________________________
    // Addr13   EPS - multi delegation to hot6  Allowance = 10  LEAF 12
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [addr13.address, "_", 10],
    ),        
    // ________________________________________________________________
    // owner   No EPS  Allowance = 50                           LEAF 13
    // ________________________________________________________________
    ethers.utils.solidityPack(
      ["address", "string", "uint256"],
      [owner.address, "_", 50],
    ),              
  ]

  return { hhPFP, leaves, owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13,
    addrHot1, addrHot2, addrHot3, addrHot4, addrHot5, addrHot6 }
}


describe("PFP", () => { 

  let leaves
  let tree

  before(async () => {
    ;({ hhPFP, leaves, owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13,
      addrHot1, addrHot2, addrHot3, addrHot4, addrHot5, addrHot6 } =
      await loadFixture(deployScaffold))

    tree = getMerkleTree(leaves)
  })

  context("Privileged Access", () => {

    describe("setBaseURI", () => {
      it("As owner SUCCEEDS", async () => {
        await expect(
          hhPFP
            .connect(owner)
            .setBaseURI("pfpBaseURI"),
        ).to.not.be.reverted
      })

      it("Not as owner FAILS", async () => {
        await expect(
          hhPFP
            .connect(addr1)
            .setBaseURI("pfpBaseURI"),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })

    describe("setPassContract", () => {
      it("As owner SUCCEEDS", async () => {
        expect(await hhPFP._passAddress()).to.equal(passAddress)
        
        await expect(
          hhPFP
            .connect(owner)
            .setPassContract(addr1.address),
        ).to.not.be.reverted

        expect(await hhPFP._passAddress()).to.equal(addr1.address)

        await expect(
          hhPFP
            .connect(owner)
            .setPassContract(passAddress)
        ).to.not.be.reverted

      })

      it("Not as owner FAILS", async () => {
        await expect(
          hhPFP
            .connect(addr1)
            .setPassContract(addr1.address),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })

    describe("setNotRevealedURI", () => {
      it("As owner SUCCEEDS", async () => {
        expect(await hhPFP.notRevealedUri()).to.equal("")
        
        await expect(
          hhPFP
            .connect(owner)
            .setNotRevealedURI("wen"),
        ).to.not.be.reverted

        expect(await hhPFP.notRevealedUri()).to.equal("wen")

      })

      it("Not as owner FAILS", async () => {
        await expect(
          hhPFP
            .connect(addr1)
            .setNotRevealedURI("wen"),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })

    describe("setMerkleRoot", () => {
      it("As owner SUCCEEDS", async () => {
        const tree = getMerkleTree(leaves)

        await hhPFP.connect(owner).setMerkleRoot(tree.getHexRoot())

        await expect(
          hhPFP
            .connect(owner)
            .setMerkleRoot(tree.getHexRoot())
        ).to.not.be.reverted

      })

      it("Not as owner FAILS", async () => {
        const tree = getMerkleTree(leaves)

        await hhPFP.connect(owner).setMerkleRoot(tree.getHexRoot())

        await expect(
          hhPFP
            .connect(addr1)
            .setMerkleRoot(tree.getHexRoot())
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })
  })

  context("Minting with allocation for msg.sender", () => {

    describe("No EPS Delegation, Proof Invalid", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[0])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addr11)
            .claimTokens( proof, 1, 1, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "InvalidProof")
      })
    })

    describe("No EPS Delegation, Proof valid, Minting more than total allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[0])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addr1)
            .claimTokens( proof, 11, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("No EPS Delegation, Proof valid, Already partially minted, minting more than remaining allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[0])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addr1)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        await expect(
          hhPFP
            .connect(addr1)
            .claimTokens( proof, 6, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })

      // Minted tokens = 5
    })

  

    describe("No EPS Delegation, Proof Valid for msg.sender, minting full allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[1])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addr2.address)).to.equal(0)

        await expect(
          hhPFP
            .connect(addr2)
            .claimTokens( proof, 5, 5, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addr2.address)).to.equal(5)

        expect(await hhPFP.ownerOf(5)).to.equal(addr2.address)
        expect(await hhPFP.ownerOf(6)).to.equal(addr2.address)
        expect(await hhPFP.ownerOf(7)).to.equal(addr2.address)
        expect(await hhPFP.ownerOf(8)).to.equal(addr2.address)
        expect(await hhPFP.ownerOf(9)).to.equal(addr2.address)

      })

      // Minted tokens = 10
    })

    describe("No EPS Delegation, Proof Valid for msg.sender, minting partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[2])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addr3.address)).to.equal(0)

        await expect(
          hhPFP
            .connect(addr3)
            .claimTokens( proof, 25, 100, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addr3.address)).to.equal(25)

        expect(await hhPFP.ownerOf(10)).to.equal(addr3.address)
        expect(await hhPFP.ownerOf(34)).to.equal(addr3.address)
      })
      // Minted tokens = 35
    })

    describe("No EPS Delegation, Proof Valid for msg.sender, minting remaining after partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[2])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addr3.address)).to.equal(25)

        await expect(
          hhPFP
            .connect(addr3)
            .claimTokens( proof, 50, 100, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addr3.address)).to.equal(75)

        expect(await hhPFP.ownerOf(35)).to.equal(addr3.address)
        expect(await hhPFP.ownerOf(84)).to.equal(addr3.address)

        await expect(
          hhPFP
            .connect(addr3)
            .claimTokens( proof, 25, 100, {
              value: 0,
            }),
        ).to.not.be.reverted
        expect(await hhPFP.balanceOf(addr3.address)).to.equal(100)

        expect(await hhPFP.ownerOf(85)).to.equal(addr3.address)
        expect(await hhPFP.ownerOf(109)).to.equal(addr3.address)

        await expect(
          hhPFP
            .connect(addr3)
            .claimTokens( proof, 1, 100, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
        expect(await hhPFP.balanceOf(addr3.address)).to.equal(100)

      })
    })
    // Minted tokens = 110
  })


  context("Minting with allocation for EPS cold address, single delegation", () => {

    describe("One EPS Delegation, Proof Invalid for msg.sender and cold", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[3])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addr11)
            .claimTokens( proof, 50, 50, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "InvalidProof")
      })
    })

    describe("One EPS Delegation, Proof valid for cold addr 1, Minting more than total allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[3])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot1)
            .claimTokens( proof, 51, 50, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("One EPS Delegation, Proof valid for cold addr 1, Already partially minted, minting more than remaining allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[3])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot1)
            .claimTokens( proof, 40, 50, {
              value: 0,
            }),
        ).to.not.be.reverted

        await expect(
          hhPFP
            .connect(addrHot1)
            .claimTokens( proof, 11, 50, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")

      })
      // Minted tokens = 150
    })

    describe("One EPS Delegation, Proof Valid for cold 1, minting full allocation", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[4])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot2.address)).to.equal(0)

        await expect(
          hhPFP
            .connect(addrHot2)
            .claimTokens( proof, 50, 50, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot2.address)).to.equal(50)

        expect(await hhPFP.ownerOf(150)).to.equal(addrHot2.address)
        expect(await hhPFP.ownerOf(199)).to.equal(addrHot2.address)
      })
    // Tokens minted = 200  
    })

    describe("One EPS Delegation, Can mint with cold or hot", () => {
      it("Cold Succeeds", async () => {
        const leaf = merkleHash(leaves[5])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addr6.address)).to.equal(0)

        // Cold can claim
        await expect(
          hhPFP
            .connect(addr6)
            .claimTokens( proof, 25, 100, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addr6.address)).to.equal(25)
        expect(await hhPFP.ownerOf(200)).to.equal(addr6.address)
        expect(await hhPFP.ownerOf(224)).to.equal(addr6.address)
      })
      // Tokens minted = 225

      it("Random hot fails", async () => {
        const leaf = merkleHash(leaves[5])
        const proof = tree.getHexProof(leaf)


        // Another random hot CANNOT claim
        await expect(
          hhPFP
            .connect(addrHot1)
            .claimTokens( proof, 75, 50, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "InvalidProof")
      })

      it("Correct Hot Succeeds", async () => {
        const leaf = merkleHash(leaves[5])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot3.address)).to.equal(0)

        // Delegated Hot can claim
        await expect(
          hhPFP
            .connect(addrHot3)
            .claimTokens( proof, 75, 100, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot3.address)).to.equal(75)

        expect(await hhPFP.ownerOf(225)).to.equal(addrHot3.address)
        expect(await hhPFP.ownerOf(299)).to.equal(addrHot3.address)
      })
      // Tokens minted = 300
    })


    describe("One EPS Delegation, Proof Valid for cold 1, minting partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[6])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot4.address)).to.equal(0)

        await expect(
          hhPFP
            .connect(addrHot4)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot4.address)).to.equal(5)

        expect(await hhPFP.ownerOf(300)).to.equal(addrHot4.address)
        expect(await hhPFP.ownerOf(304)).to.equal(addrHot4.address)
      })
      // Tokens minted = 305
    })

    describe("One EPS Delegation, Proof Valid for cold 1, minting remaining after partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[6])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot4.address)).to.equal(5)

        await expect(
          hhPFP
            .connect(addrHot4)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot4.address)).to.equal(10)

        expect(await hhPFP.ownerOf(305)).to.equal(addrHot4.address)
        expect(await hhPFP.ownerOf(309)).to.equal(addrHot4.address)
      })
      // Tokens minted = 310      
    })

  })

  context("Minting with allocation for EPS cold address, multiple delegations", () => {

    describe("Multiple EPS Delegations, Proof Invalid for all", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[1])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 10, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "InvalidProof")
      })
    })


    describe("Mutiple EPS Delegations, Proof valid for cold addr 1, Minting more than total allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[7])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 11, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("Mutiple EPS Delegations, Proof valid for cold addr 2, Minting more than total allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[8])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 26, 25, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("Mutiple EPS Delegations, Proof valid for cold addr 3, Minting more than total allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[9])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 16, 15, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })


    describe("Multiple EPS Delegations, Proof valid for cold addr 1, Already partially minted, minting more than remaining allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[7])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 6, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("Multiple EPS Delegations, Proof valid for cold addr 2, Already partially minted, minting more than remaining allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[8])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 10, 25, {
              value: 0,
            }),
        ).to.not.be.reverted

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 16, 25, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })

    describe("Multiple EPS Delegations, Proof valid for cold addr 3, Already partially minted, minting more than remaining allocation", () => {
      it("Fails", async () => {
        const leaf = merkleHash(leaves[9])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 10, 15, {
              value: 0,
            }),
        ).to.not.be.reverted

        await expect(
          hhPFP
            .connect(addrHot5)
            .claimTokens( proof, 6, 15, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
      })
    })


    describe("Multiple EPS Delegations, Proof Valid for cold 1, minting full allocation", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[10])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(0)

        await expect(
          hhPFP
            .connect(addrHot6)
            .claimTokens( proof, 10, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(10)

        expect(await hhPFP.ownerOf(335)).to.equal(addrHot6.address)
        expect(await hhPFP.ownerOf(344)).to.equal(addrHot6.address)

      })
      // Tokens minted = 345
    })

    describe("Multiple EPS Delegations, Proof Valid for cold 3, minting full allocation", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[12])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(10)

        await expect(
          hhPFP
            .connect(addrHot6)
            .claimTokens( proof, 10, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(20)

        expect(await hhPFP.ownerOf(345)).to.equal(addrHot6.address)
        expect(await hhPFP.ownerOf(354)).to.equal(addrHot6.address)

      })
      // Tokens minted = 355     
    })


    describe("Multiple EPS Delegations, Proof Valid for cold 2, minting partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[11])
        const proof = tree.getHexProof(leaf)

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(20)

        await expect(
          hhPFP
            .connect(addrHot6)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(25)

        expect(await hhPFP.ownerOf(355)).to.equal(addrHot6.address)
        expect(await hhPFP.ownerOf(359)).to.equal(addrHot6.address)        

      })
      // Tokens minted = 360         
    })

    describe("Multiple EPS Delegation, Proof Valid for cold 2, minting remaining after partial allocaiton", () => {
      it("Succeeds", async () => {
        const leaf = merkleHash(leaves[11])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(addrHot6)
            .claimTokens( proof, 5, 10, {
              value: 0,
            }),
        ).to.not.be.reverted

        expect(await hhPFP.balanceOf(addrHot6.address)).to.equal(30)

        expect(await hhPFP.ownerOf(360)).to.equal(addrHot6.address)
        expect(await hhPFP.ownerOf(364)).to.equal(addrHot6.address)     

        await expect(
          hhPFP
            .connect(addrHot6)
            .claimTokens( proof, 1, 10, {
              value: 0,
            }),
        ).to.be.revertedWithCustomError(hhPFP, "ClaimExceedsAllowance")
  
      })
      // Tokens minted = 365
    })
  })

  context("Collection Limit", () => {

    describe("Cannot be breached", () => {
      it("Cannot exceed limit", async () => {
        const leaf = merkleHash(leaves[13])
        const proof = tree.getHexProof(leaf)

        await expect(
          hhPFP
            .connect(owner)
            .claimTokens( proof, 50, 50, {
              value: 0,
            }),
        ).to.be.revertedWith("Claim would exceed max supply of tokens!")
      })

      it("Can equal limit", async () => {
        const leaf = merkleHash(leaves[13])
        const proof = tree.getHexProof(leaf)

        console.log(await hhPFP.totalSupply())

        await expect(
          hhPFP
            .connect(owner)
            .claimTokens( proof, 35, 50, {
              value: 0,
            }),
        ).to.not.be.reverted
      })
    })
  })

  context("Token URI and Reveal", () => {

    describe("Token URIs pre-reveal", () => {
      it("All tokens have the same URI", async () => {
        expect(await hhPFP.tokenURI(1)).to.equal("wen")

        expect(await hhPFP.tokenURI(300)).to.equal("wen")
      })

      it("Random cannot reveal", async () => {
        await expect(
          hhPFP
            .connect(addrHot6)
            .reveal(),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("Owner can reveal", async () => {
        expect(await hhPFP.tokenURI(1)).to.equal("wen")

        await expect(
          hhPFP
            .connect(owner)
            .reveal(),
        ).to.not.be.reverted
      })

      it("All tokens have the expected URI", async () => {
        expect(await hhPFP.tokenURI(1)).to.equal("pfpBaseURI" + 100 + ".json")
        expect(await hhPFP.tokenURI(300)).to.equal("pfpBaseURI" + 399 + ".json")
        expect(await hhPFP.tokenURI(301)).to.equal("pfpBaseURI" + 0 + ".json")
        expect(await hhPFP.tokenURI(350)).to.equal("pfpBaseURI" + 49 + ".json")
      })

      it("Owner can no longer change post-reveal URI", async () => {
        await expect(
          hhPFP
            .connect(owner)
            .setBaseURI("gaaaaaaahh"),
        ).to.be.revertedWith("Collection revealed, cannot set URI")
      })
    })
  })
})
