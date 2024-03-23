import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension());

const wallet = await warp.arweave.wallets.generate();
const tags = [
  { name: "App-User", value: "M3ters" },
  { name: "App-Label", value: "M3tering Protocol" },
];

async function interact_evm(contractId, func, txHash) {
  const contract = warp.contract(contractId).connect(wallet);
  const interactionResult = await contract.dryWrite(
    {
      function: func,
      txHash,
    },
    { tags }
  );
  console.log("result", interactionResult);
}

async function interact_meter(meterContractSrc) {
  const contract = warp.contract(meterContractSrc).connect(wallet);
  const interactionResult = await contract.dryWrite(
    {
      function: "meter",
      data: [
        "XUO7gdG9av1XZt3wqMLb8+FUlkgnpZstvYi9g4NAUhk=",
        "BESz9DprHAtUqiPwiYio/ZNr2f4Q5ZQXzLIK8V/QqfeE/iQ3ThR5tAg2bUIKq6eTGPqA0YucmsABX6tFO5TuAQ==",
        [1, 7.23, 15.7],
      ],
    },
    { tags }
  );
  console.log("result", interactionResult);
}

interact_meter("q_h_yOXWunhuUm-PD1KH8V-ankXCMRax39xsL9gcICc");
interact_evm(
  "q_h_yOXWunhuUm-PD1KH8V-ankXCMRax39xsL9gcICc",
  "register",
  "0x1c24c740852988ebf00b3871f5f7b0c6cc24e620a89a834e9d15173143bd5bdf"
);
// interact_evm(
//   "nOUT-A6s1N-YEGd-sdQet2G_QWHJPuC16PAI0w1vIUI",
//   "topup",
//   "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a"
// );
