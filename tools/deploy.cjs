const { WarpFactory } = require("warp-contracts");
const { EthersExtension } = require("warp-m3tering-plugin-ethers");
const { Ed25519Extension } = require("warp-m3tering-plugin-ed25519");
const { DeployPlugin, ArweaveSigner } = require("warp-contracts-plugin-deploy");

const fs = require("fs");
const path = require("path");
const initialState = require("./initialState.json");

let warp = WarpFactory.forMainnet()
  .use(new DeployPlugin())
  .use(new EthersExtension())
  .use(new Ed25519Extension());

async function deploy() {
  try {
    const contractSrc = fs.readFileSync(
      path.join(__dirname, "../bundle/contract.js"),
      "utf8"
    );

    let jwk = await getWallet();

    console.log("contractsrc: ", contractSrc, "wallet:", typeof jwk, jwk);

    const contractDets = await warp.deploy({
      wallet: new ArweaveSigner(jwk),
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });

    fs.writeFileSync(
      path.join(__dirname, "../mainnetContractDets.json"),
      JSON.stringify(contractDets)
    );
    console.log(contractDets);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

async function getWallet() {
  try {
    let jwk = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8")
    );
    return jwk;
  } catch (err) {
    let jwk = await warp.arweave.wallets.generate();
    fs.writeFileSync(path.join(__dirname, "../jwk.json"), JSON.stringify(jwk));
    return jwk;
  }
}

deploy();
