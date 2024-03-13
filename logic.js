import * as stablelib from "@stablelib/ed25519"

export async function validate_payload(payload, pubkey){
    let convertedPublicKey = convertStringtoUint8Array(pubkey, "base64")

    let message = JSON.stringify(payload[2])
    let convertedMessage = convertStringtoUint8Array(message, "utf8")
    
    let signature = payload[1]
    let convertedSignature = convertStringtoUint8Array(signature, "base64")

    let isValid = stablelib.verify(convertedPublicKey, convertedMessage, convertedSignature)

   return isValid
}

export function convertStringtoUint8Array(string, fromType){
    if(fromType !== "hex" && fromType !== "base64" && fromType !== "utf8") {
        throw new ContractError("Invalid conversion from type... (hex, base64, and utf8)")
    }
    return Uint8Array.from(Buffer.from(string, fromType))
}