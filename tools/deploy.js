import fs from "fs";
import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import initialState from "../initialState.json" assert { type: "json" };

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension())
  .use(new DeployPlugin());
const tags = [
  { name: "Contract-Label", value: "M3ters" },
  { name: "Contract-Use", value: "M3tering Protocol" },
];

async function deploy(tokenId, devEUI, appEUI, appKey) {
  try {
    const state = initialState;
    state.token_id = tokenId;
    state.dev_eui = devEUI;
    state.app_eui = appEUI;
    state.app_key = appKey;

    const contractDetails = await warp.deploy({
      wallet: new ArweaveSigner(await warp.arweave.wallets.generate()),
      src: fs.readFileSync("bundle/contract.js", "utf8"),
      initState: JSON.stringify(state),
      tags,
    });
    console.log(contractDetails);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

deploy(4, "203cdd2af9233401", "3320a52bffd91500", "0109000405103cab1c1d1e1f202a22fe");
