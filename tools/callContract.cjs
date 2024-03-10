const { WarpFactory } = require("warp-contracts");
const { ArweaveSigner } = require("warp-contracts-plugin-deploy");
const fs = require("fs");
const path = require("path");

let wallet = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8")
);
let warp = WarpFactory.forMainnet();

async function interact(meterContractSrc) {
  let contract = warp
    .contract(meterContractSrc)
    .connect(new ArweaveSigner(wallet));
  let interactionResult = await contract.dryWrite(
    {
      data: ["XUO7gdG9av1XZt3wqMLb8+FUlkgnpZstvYi9g4NAUhk=", "BESz9DprHAtUqiPwiYio/ZNr2f4Q5ZQXzLIK8V/QqfeE/iQ3ThR5tAg2bUIKq6eTGPqA0YucmsABX6tFO5TuAQ==", [1,7.23,15.7]],
      function: "subtract_energy_usage_state",
    },
    "none"
  );
  console.log(
    "result",
    interactionResult,
  );
}

interact("WvFd62VLYuW3GGqRgWTmMyGTVeQn_G6SELzO1mI1p8U");
