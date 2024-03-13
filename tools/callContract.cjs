const { WarpFactory } = require("warp-contracts");
const {ArweaveSigner} = require("warp-contracts-plugin-deploy")
const fs = require("fs");
const path = require("path");

let wallet = JSON.parse(fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8"))
let warp = WarpFactory.forMainnet()

let signature = "2RsrCY9Havfrw500CyRQDPHC2UZONk9mNeOhom9z2cIFhH_Vo4BIoLcQSuYdFBKl3vMyNPEg8a3NECw701VWCA"
async function interact(meterContractSrc){
    let contract = warp.contract(meterContractSrc).connect(wallet)
    let interactionResult = await contract.viewState({
    data:[meterContractSrc, signature, [1,4.84,1]],
    function:"subtract_energy_usage_state",
})
    console.log("result", interactionResult, "length", convertedSignature.length, "converted", convertedSignature)
}

interact("E5JSBB91_nXwlbQi--AeLavP3JB3xBSdKXdTzTeAhNA")

