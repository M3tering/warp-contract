const { WarpFactory } = require("warp-contracts");
const { EthersExtension } = require("warp-m3tering-plugin-ethers");
const { Ed25519Extension } = require("warp-m3tering-plugin-ed25519");

const fs = require("fs");
const path = require("path");

let warp = WarpFactory.forMainnet()
  .use(new EthersExtension())
  .use(new Ed25519Extension());

let wallet = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../jwk.json"), "utf8")
);

async function interact_register(meterContractSrc) {
  let contract = warp.contract(meterContractSrc).connect(wallet);
  let interactionResult = await contract.dryWrite({
    data: {
      transaction_hash:
        "0x1c24c740852988ebf00b3871f5f7b0c6cc24e620a89a834e9d15173143bd5bdf",
    },
    function: "register",
  });
  console.log("result", interactionResult);
}

async function interact_topup(meterContractSrc) {
  let contract = warp.contract(meterContractSrc).connect(wallet);
  let interactionResult = await contract.dryWrite({
    data: {
      transaction_hash:
        "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a",
    },
    function: "topup",
  });
  console.log("result", interactionResult);
}

async function interact_meter(meterContractSrc) {
  let contract = warp.contract(meterContractSrc).connect(wallet);
  let interactionResult = await contract.dryWrite({
    data: [
      "XUO7gdG9av1XZt3wqMLb8+FUlkgnpZstvYi9g4NAUhk=",
      "BESz9DprHAtUqiPwiYio/ZNr2f4Q5ZQXzLIK8V/QqfeE/iQ3ThR5tAg2bUIKq6eTGPqA0YucmsABX6tFO5TuAQ==",
      [1, 7.23, 15.7],
    ],
    function: "meter",
  });
  console.log("result", interactionResult);
}

// interact_register("mWva_YY8STYm4l0aElnU71ajCX1Kr9rpsS6REH8pv6g");
interact_topup("mWva_YY8STYm4l0aElnU71ajCX1Kr9rpsS6REH8pv6g");
// interact_meter("mWva_YY8STYm4l0aElnU71ajCX1Kr9rpsS6REH8pv6g");
