import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import initialState from "../initialState.json" assert { type: "json" };

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension())
  .use(new DeployPlugin());

async function deploy(tokenId, devEUI, appEUI, appKey, sourceTxId) {
  const state = initialState;
  state.token_id = tokenId;
  state.dev_eui = devEUI;
  state.app_eui = appEUI;
  state.app_key = appKey;

  try {
    const wallet = await warp.arweave.wallets.generate();
    const contractDetails = await warp.deployFromSourceTx({
      wallet: new ArweaveSigner(wallet),
      initState: JSON.stringify(state),
      srcTxId: sourceTxId,
    });
    console.log(contractDetails);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

deploy(1, "...", "...", "...", "...");
