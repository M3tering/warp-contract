import * as stablelib from "@stablelib/ed25519"

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

console.log(isvalid)
