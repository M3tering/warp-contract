import * as ed from "@noble/ed25519"

export async function validate_payload(payload, pubkey){
    let message = JSON.stringify(payload.usage)
    let signature = payload.sig

    let isValid = await ed.verify(signature, message, pubkey)

   return isValid
}
