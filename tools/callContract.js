const { WarpFactory } = require("warp-contracts");
const {ArweaveSigner} = require("warp-contracts-plugin-deploy")
const fs = require("fs");
const path = require("path");

let wallet = JSON.parse(fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8"))
let warp = WarpFactory.forMainnet()


async function interact(meterContractSrc){
    let contract = warp.contract(meterContractSrc).connect(new ArweaveSigner(wallet))
    let interactionResult = await contract.writeInteraction({
    data:{
        kwh:50.54,
        ts:new Date()
    },
    function:"subtract_energy_usage_state",
    sig:"B86BCBF6022AE6911E450C535E3AC36D28705F6AB7B93852333C7D63DC693EFF78827A4183DAA3C93DA51A2F435AF970FB5055DEFE461B4E4CC55536B70A7E02"
})
    console.log(interactionResult)
}

interact("38IshD9loN0I-GXWKMtXK-Ed-UAlZ_XdHe9pSJ782UY")

