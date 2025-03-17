import { EVM_CONFIG } from "./constants";

export function validatePayload(payload: Payload, pubKey: string) {
  return SmartWeave.extensions.ed25519.verify(
    SmartWeave.extensions.ethers.decodeBase64(pubKey), // pubkey
    new TextEncoder().encode(JSON.stringify(payload[0])), // data
    SmartWeave.extensions.ethers.decodeBase64(payload[1]), // signature
  );
}

  //===============================[ TODO ]======================================//
  //    THIS IS SLATTED TO BE REPLACED WITH A CCIP READ CALL TO ETHEREUM L1      //
  // USING <SmartWeave.contract.id> TO RETURN TALLY VALUE FOR A CALLING CONTRACT //
  // ____________________________________________________________________________//
  // ...                                                                         //
  //  let X = new SmartWeave.extensions.ethers.Contract(address, abi, provider)  // 
  //  let value = await X.method(...params, {enableCcipRead: true});             //
  // ...                                                                         //
  //=============================================================================//
export async function validateTxLogs(
  contractAddress: string,
  eventTopic: string,
  eventAbi: string[],
  lastBlockHeight: number,
  tokenIdInState: number,
  txHash: string,
) {
  const provider = new SmartWeave.extensions.ethers.JsonRpcProvider(
    EVM_CONFIG.RPC_ENDPOINT,
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
