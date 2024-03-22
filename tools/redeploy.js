import { WarpFactory } from "warp-contracts";
import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import initialState from "../initialState.json" assert { type: "json" };

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension())
  .use(new DeployPlugin());

async function deploy(tokenId, sourceTxId) {
  const state = initialState;
  state.token_id = tokenId;

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

deploy(2, "f13sckWCTT2dez4vEcJ7r_3gyTQmk1WJQCrzcn81NlE");
