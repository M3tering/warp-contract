import { GNOSIS_RPC } from "./constants.js";
import { base64ToBytes } from "./utils.js";

export function validatePayload(payload, pubKey) {
  const pubKeyArray = base64ToBytes(pubKey);
  const signatureArray = base64ToBytes(payload[1]);
  const messageArray = new TextEncoder().encode(JSON.stringify(payload[2]));

  return SmartWeave.extensions.ed25519.verify(
    pubKeyArray,
    messageArray,
    signatureArray
  );
}

export async function validateTxLogs(
  txHash,
  lastBlockHeight,
  tokenIdFromState,
  contractAddress,
  eventAbi,
  eventTopic
) {
  const provider = new SmartWeave.extensions.ethers.JsonRpcProvider(GNOSIS_RPC);

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) throw new Error("Transaction not found or not yet mined");
  if (receipt.logs.length === 0) throw new Error("No Transfer events found");

  const iface = new SmartWeave.extensions.ethers.Interface(eventAbi);
  const logContent = receipt.logs[0];
  const blockHeight = logContent["blockNumber"];
  const address = logContent["address"];
  const data = iface.parseLog(logContent);
  const tokenIdFromLog = Number(data.args[0]);

  //checks
  //1. blockHeight > bolckheight from state
  if (blockHeight <= lastBlockHeight) throw new Error("Block height not valid");

  //2. address == protocol adddress in code
  if (address !== contractAddress) throw new Error("Adrress is Invalid");

  //3. topic == topic in code
  if (data.topic !== eventTopic) throw new Error("Topic validation failed");

  //4. tokenId == tokenId in state
  if (tokenIdFromLog !== tokenIdFromState)
    throw new Error("Token Id does not match");

  return {
    blockHeight,
    data,
  };
}
