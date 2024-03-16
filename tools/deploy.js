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

async function deploy() {
  try {
    const wallet = await warp.arweave.wallets.generate();
    const contractSrc = fs.readFileSync("bundle/contract.js", "utf8");
    const contractDetails = await warp.deploy({
      wallet: new ArweaveSigner(wallet),
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });
    console.log(contractDetails);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

deploy();
