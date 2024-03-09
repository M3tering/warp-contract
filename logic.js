import * as stablelib from "@stablelib/ed25519"

export async function validate_payload(payload, pubkey){
    let message = JSON.stringify(payload[2])
    let convertedMessage = convertBase64StringtoUint8Array(message)

    let signature = payload[1]
    let convertedSignature = convertBase64StringtoUint8Array(signature)

    let isValid = stablelib.verify(pubkey, convertedMessage, convertedSignature)

   return isValid
}

export function convertBase64StringtoUint8Array(base64string){
    return Uint8Array.from(Buffer.from(base64string, 'base64'))
}