import { WarpFactory } from "warp-contracts";
import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";

import initialState from "../initialState.json" assert { type: "json" };

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension())
  .use(new DeployPlugin());

async function deploy(tokenId, publicKey, sourceTxId) {
  const state = initialState;
  state.token_id = tokenId;
  state.public_key = publicKey;

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

deploy(
  2,
  "F2L+7R0Txta/7M9xZa3HoAD0qiY9HBV3SDiqmdtME54=",
  "f13sckWCTT2dez4vEcJ7r_3gyTQmk1WJQCrzcn81NlE"
);
