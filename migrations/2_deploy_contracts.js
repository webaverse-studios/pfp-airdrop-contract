const PFP = artifacts.require("PFP");

const NetworkTypes = {
  "mainnet": "mainnet",
  "goerli": "goerli",
}

const passContract = {
  "mainnet": process.env.mainnetPassContractAddress,
  "goerli": process.env.goerliPassContractAddress,
}

module.exports = async function (deployer) {
  const networkType = NetworkTypes[process.argv[4]];

  if (!networkType)
    return console.error(process.argv[4] + " was not found in the networkType list");

  if (!passContract[networkType])
    return console.error("Pass Contract address not valid");

  console.log("Deploying on the " + networkType + " networkType");
//////////////////////////// Webaverse Character ////////////////////////////
  await deployer.deploy(PFP, passContract[networkType]);
//////////////////////////////////////////////////////////////////////////

  console.log("*******************************")
  console.log("Pass Contract: ", passContract[networkType]);
  console.log("Deploying on the " + networkType + " networkType");
  console.log("*******************************")
  console.log("\"" + networkType + "\": {");
  console.log(" \"PFP\": " + "\"" + PFP.address + "\",")
  console.log("}");
  console.log("*******************************")
};
