const { WarpFactory } = require("warp-contracts");
const {ArweaveSigner} = require("warp-contracts-plugin-deploy")
const fs = require("fs");
const path = require("path");

let wallet = JSON.parse(fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8"))
let warp = WarpFactory.forMainnet()


async function interact(meterContractSrc){
    let contract = warp.contract(meterContractSrc).connect(new ArweaveSigner(wallet))
    let interactionResult = await contract.writeInteraction({
    data:[meterContractSrc, "ACB4C753D19216B1FF20A03F7B4A5087A36C4E98F617E09F5054EA5500A704921D9EBB55D703953660DE221A20E1DA15CC3843065D5B86E85DF110FF4526E908", [1,4.84,1]],
    function:"subtract_energy_usage_state",
})
    console.log(interactionResult)
}

interact("haFXGvnQP5YYUGTbxxmSok0e4nFgTwhCZYAS0vfk_Tk")

