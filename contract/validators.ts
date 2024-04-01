import { EVM_CONFIG } from "./constants";

export function validatePayload(payload: Payload, pubKey: string) {
  return SmartWeave.extensions.ed25519.verify(
    SmartWeave.extensions.ethers.decodeBase64(pubKey), // pubkey
    new TextEncoder().encode(JSON.stringify(payload[0])), // data
    SmartWeave.extensions.ethers.decodeBase64(payload[2]), // signature
  );
}

export async function validateTxLogs(
  eventTopic: string,
  eventAbi: string[],
  contractAddress: string,
  lastBlockHeight: number,
  tokenIdInState: number,
  txHash: string,
) {
  const provider = new SmartWeave.extensions.ethers.JsonRpcProvider(
    EVM_CONFIG.GNOSIS_RPC,
  );

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) throw new Error("Transaction not found or not yet mined");
  if (receipt.logs.length === 0) throw new Error("No Transfer events found");

  const iface = new SmartWeave.extensions.ethers.Interface(eventAbi);
  const logContent = receipt.logs[0];
  const blockHeight = logContent["blockNumber"];
  const address = logContent["address"];
  const data = iface.parseLog(logContent);
  const tokenIdInLog = Number(data.args[0]);

  //checks
  //1. blockHeight > block height from state
  if (blockHeight <= lastBlockHeight) throw new Error("Block height not valid");

  //2. address == protocol address in code
  if (address !== contractAddress) throw new Error("Address is Invalid");

  //3. topic == topic in code
  if (data.topic !== eventTopic) throw new Error("Topic validation failed");

  //4. tokenId == tokenId in state
  if (tokenIdInLog !== tokenIdInState)
    throw new Error("Token Id does not match");

  return {
    blockHeight,
    data,
  };
}
