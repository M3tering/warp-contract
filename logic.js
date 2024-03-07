import * as stablelib from "@stablelib/ed25519"

export async function validate_payload(payload, pubkey){
    let message = JSON.stringify(payload[2])
    let signature = payload[1]

    let isValid = stablelib.verify(pubkey, message, signature)

   return isValid
}