const { DeployPlugin, ArweaveSigner } = require("warp-contracts-plugin-deploy");
const { WarpFactory } = require("warp-contracts");

const fs = require("fs");
const path = require("path");

const environment = "mainnet";
let warp =
  environment == "testnet"
    ? WarpFactory.forTestnet().use(new DeployPlugin())
    : WarpFactory.forMainnet().use(new DeployPlugin());

async function deploy(meter, sourceTxId) {
  try {
    // const contractSrc = fs.readFileSync(path.join(__dirname, "../contract/contract.js"), "utf8")
    let jwk = await getWallet(meter);

    const initialState = require("./initialState.json");

    console.log(
      "address:",
      warp.arweave.wallets.getAddress(jwk),
      "wallet:",
      typeof jwk,
      jwk
    );

    const contractDets = await warp.deployFromSourceTx({
      wallet: new ArweaveSigner(jwk),
      initState: JSON.stringify(initialState),
      srcTxId: sourceTxId,
    });

    if (environment == "testnet") {
      fs.writeFileSync(
        path.join(__dirname, `../${meter}contractdets.json`),
        JSON.stringify(contractDets)
      );
    } else {
      fs.writeFileSync(
        path.join(__dirname, `../${meter}mainnetContractDets.json`),
        JSON.stringify(contractDets)
      );
    }
    console.log(contractDets);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

async function getWallet(meter) {
  try {
    let jwk = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../${meter}jwk.json`), "utf8")
    );
    return jwk;
  } catch (err) {
    let jwk = await warp.arweave.wallets.generate();
    fs.writeFileSync(
      path.join(__dirname, `../${meter}jwk.json`),
      JSON.stringify(jwk)
    );
    return jwk;
  }
}

deploy("meter1", "fulP9_NnmU9dlw0K2NFZ6dWk6gA6oPCb_6LMm9pxsOM");
