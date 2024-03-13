import * as stablelib from "@stablelib/ed25519";
import { ethers } from "ethers";


const CHIADO_TESTNET = "https://rpc.chiadochain.net";
const GNOSIS_MAINNET = "https://gnosis-rpc.publicnode.com";

//const transactionHash = "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a";
const PROTOCOL_CONTRACT_ADDRESS = "0x15Fd3b92Eda42b55C7c521DFff5fdeeC5d76D04a";
const REGISTERATION_PROTOCOL_CONTRACT_ADDRESS = "0xAF7FF053dF6a38F004DCfB964fAE4Bef6f479E6a"
const REVENUE_EVENT_TOPIC =
  "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76";


function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
}

function validate_payload(payload, pubKey) {
  const pubKeyArray = base64ToBytes(pubKey);
  const signatureArray = base64ToBytes(payload[1]);
  const messageArray = new TextEncoder().encode(JSON.stringify(payload[2]));

  return stablelib.verify(pubKeyArray, messageArray, signatureArray);
}

//==== start of evm interaction with ehters function ====//
export async function getTransferEvent(transactionHash, lastBlockHeight, tokenIdfromState) {
  const provider = new ethers.JsonRpcProvider(CHIADO_TESTNET);

  const receipt = await provider.getTransactionReceipt(transactionHash);
  if (!receipt) {
    throw new Error("Transaction not found or not yet mined");
  }

  const logs = receipt.logs.filter((log) => {
    return (
      log.topics[0] === REVENUE_EVENT_TOPIC && // Event signature
      log.address === PROTOCOL_CONTRACT_ADDRESS // Contract address
    ); 
  });

  if (logs.length === 0) {
    throw new ContractError("No Transfer events found")
  }

  let paymentlog = logs[0]

  let abi = ["event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)" ];
  let iface = new ethers.Interface(abi);
  let parsedLog = iface.parseLog(paymentlog)
  let blockHeight = paymentlog["blockNumber"]
  let address = paymentlog["address"]

  let tokenIdfromEvm = Number(parsedLog.args[0])  
  let amountPaid =Number(parsedLog.args[1]) / 1e18
  let tariff = Number(parsedLog.args[2]) / 1e18

  //checks
  //1. blockHeight > bolckheight from state
  if(blockHeight <= lastBlockHeight) throw new ContractError("Block height not valid")

  //2. address == protocol adddress in code
  if(address !== REGISTERATION_PROTOCOL_CONTRACT_ADDRESS) throw new ContractError("Adrress is Invalid")

  //3. tokenId == tokenId in state
  if(tokenIdfromEvm !== tokenIdfromState) throw new ContractError("Token Id does not match")


  console.log("energy", energy, "amount_paid", amountPaid, "tariff: ",tariff, "tokenId", tokenIdfromEvm)

  return {
    energy: energy,
    newBlockHeight: blockHeight
  };
}

export async function getRegisterationEvent(transactionHash, lastBlockHeight, tokenIdfromState) {
  const provider = new ethers.JsonRpcProvider(CHIADO_TESTNET);

  const receipt = await provider.getTransactionReceipt(transactionHash);
  if (!receipt) {
    throw new Error("Transaction not found or not yet mined");
  }

  const logs = receipt.logs.filter((log) => {
    return (
      log.topics[0] === REVENUE_EVENT_TOPIC && // Event signature
      log.address === PROTOCOL_CONTRACT_ADDRESS // Contract address
    ); 
  });

  if (logs.length === 0) {
    throw new ContractError("No Transfer events found")
  }

  let paymentlog = logs[0]

  let abi = ["event Register(uint256 indexed tokenId, string indexed publicKey, uint256 timestamp, address from)" ];
  let iface = new ethers.Interface(abi);
  let parsedLog = iface.parseLog(paymentlog)
  let blockHeight = paymentlog["blockNumber"]
  let address = paymentlog["address"]

  let tokenIdfromEvm = Number(parsedLog.args[0])
  let publicKey = parsedLog.args[1]

  //checks
  //1. blockHeight > bolckheight from state
  if(blockHeight <= lastBlockHeight) throw new ContractError("Block height not valid")

  //2. address == protocol adddress in code
  if(address !== PROTOCOL_CONTRACT_ADDRESS) throw new ContractError("Adrress is Invalid")

  //3. tokenId == tokenId in state
  if(tokenIdfromEvm !== tokenIdfromState) throw new ContractError("Token Id does not match")

  return {
    newBlockHeight: blockHeight,
    public_key: publicKey
  };
}
//=== end of evm interaction function ===//


///////

export function handle_metering(state, action) {
  const payload = action.input.data;
  if (!payload) throw new ContractError("Interaction payload missing");

  //======================================================//
  // PAYLOAD:                                             //
  //    [publicKey, signature, [nonce, current, energy]]  //
  //======================================================//

  const nonce = payload[2][0];
  if (nonce < state.nonce) throw new ContractError("Invalid nonce");

  const validity = validate_payload(payload, state.public_key);
  if (validity !== true) throw new ContractError("Invalid payload");

  state.kwh_balance -= payload[2][2];
  if (state.kwh_balance <= 0) state.is_on = false;

  state.nonce = nonce;
  return { state };
}

export async function handle_topup(state, action) {
  // ToDo: handle payment from EVM
  let transactionHash = action.input.data.transaction_hash
  let lastBlockHeight = state.last_block
  let token_id = state.token_id
  
  let evmTransactionResult = await getTransferEvent(transactionHash, lastBlockHeight, token_id)

  state.last_block = evmTransactionResult.newBlockHeight
  state.kwh_balance += evmTransactionResult.energy

  return {state}
}

export async function handle_registration(state, action) {
  let transactionHash = action.input.data.transaction_hash
  let lastBlockHeight = state.last_registeration_block
  let token_id = state.token_id

  let evmTransactionResult = await getRegisterationEvent(transactionHash, lastBlockHeight, token_id)

  state.last_block = evmTransactionResult.newBlockHeight
  state.public_key = evmTransactionResult.public_key
  
  return {state}
}
