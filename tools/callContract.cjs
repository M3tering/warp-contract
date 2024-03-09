const { WarpFactory } = require("warp-contracts");
const {ArweaveSigner} = require("warp-contracts-plugin-deploy")
const fs = require("fs");
const path = require("path");

let wallet = JSON.parse(fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8"))
let warp = WarpFactory.forMainnet()

 function base64toUint8Aray(base64string){
    return Uint8Array.from(Buffer.from(base64string, 'base64'))
 }

  let convertedSignature = base64toUint8Aray("2RsrCY9Havfrw500CyRQDPHC2UZONk9mNeOhom9z2cIFhH_Vo4BIoLcQSuYdFBKl3vMyNPEg8a3NECw701VWCA")
async function interact(meterContractSrc){
    let contract = warp.contract(meterContractSrc).connect(new ArweaveSigner(wallet))
    let interactionResult = await contract.dryWrite({
    data:[meterContractSrc, convertedSignature, [1,4.84,100]],
    function:"subtract_energy_usage_stat",
}, "none")
    console.log("result", interactionResult, "length", convertedSignature.length, "converted", convertedSignature)
}

interact("j-COKnOi-Y2Y9bjOVQbt4hDlJclHkaxjMuzVRjFfiJs")

