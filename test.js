/*import * as stablelib from "@stablelib/ed25519"

function validate_payload(payload, pubkey){
    let convertedPublicKey = convertStringtoUint8Array(pubkey, "base64")

    let message = JSON.stringify(payload[2])
    let convertedMessage = convertStringtoUint8Array(message, "utf8")

    
    let signature = payload[1]
    let convertedSignature = convertStringtoUint8Array(signature, "base64")

    console.log("pubkey", pubkey, "message", typeof message, "message-converted", convertedMessage, "signature", convertedSignature)

    let isValid = stablelib.verify(convertedPublicKey, convertedMessage, convertedSignature)

   return isValid
}

function convertStringtoUint8Array(string, fromType){
    if(fromType !== "hex" && fromType !== "base64" && fromType !== "utf8"){
        console.log("from type not valid")
    }
    return Uint8Array.from(Buffer.from(string, fromType))
}

let pubkey = "gW8kO2bIPMz7p08RzFFcVjUpiq1amYMD7VZjkNQUb-o"
let signature = "2RsrCY9Havfrw500CyRQDPHC2UZONk9mNeOhom9z2cIFhH_Vo4BIoLcQSuYdFBKl3vMyNPEg8a3NECw701VWCA"

let data = ["FRbOjeNLlrlupvYKsfEzM0oRVspOcUAn-50gnpXkZ90", signature, [1,4.84,1]]

let isvalid = validate_payload(data, pubkey)

console.log(isvalid)*/

import {ethers} from "ethers"
import { ContractError } from "warp-contracts";

async function getTransferEvent(provider, transactionHash, lastBlockHeight, tokenIdfromState) {
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

  console.log(paymentlog["blockNumber"], paymentlog["address"], paymentlog["topics"])

  let abi = ["event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)" ];
  let iface = new ethers.Interface(abi);
  let parsedLog = iface.parseLog(paymentlog)
  let blockHeight = paymentlog["blockNumber"]
  let address = paymentlog["address"]

  console.log("parsedlog", parsedLog)

  let tokenIdfromEvm = Number(parsedLog.args[0])  
  let amountPaid =Number(parsedLog.args[1]) / 1e18
  let tariff = Number(parsedLog.args[2]) / 1e18

  //checks
  //1. blockHeight > bolckheight from state
  if(blockHeight <= lastBlockHeight) throw new ContractError("Block height not valid")

  //2. address == protocol adddress in code
  if(address !== PROTOCOL_CONTRACT_ADDRESS) throw new ContractError("Adrress is Invalid")

  //3. tokenId == tokenId in state
  if(tokenIdfromEvm !== tokenIdfromState) throw new ContractError("Token Id does not match")

  let energy = amountPaid * tariff

  console.log("energy", energy, "amount_paid", amountPaid, "tariff: ",tariff, "tokenId", tokenIdfromEvm)

  return {
    /*tokenId: decodedLog.tokenId,
    amount: decodedLog.amount,
    tariff: decodedLog.tariff,*/
    energy: energy,
    newBlockHeight: blockHeight
  };
}

const CHIADO_TESTNET = "https://rpc.chiadochain.net";
const GNOSIS_MAINNET = "https://gnosis-rpc.publicnode.com";
const provider = new ethers.JsonRpcProvider(CHIADO_TESTNET);
const transactionHash = "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a";
const PROTOCOL_CONTRACT_ADDRESS = "0x15Fd3b92Eda42b55C7c521DFff5fdeeC5d76D04a";
const REVENUE_EVENT_TOPIC =
  "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76";
const REVENUE_EVENT_ABI =
  '[ "Revenue(uint256,uint256,uint256,address,uint256)" ]';

getTransferEvent(provider, transactionHash, 8712629, 0)
  .then((eventData) => {
    if (eventData) {
      console.log(eventData)
    }
  })
  .catch((error) => {
    console.error(error);
  });
