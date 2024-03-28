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

<<<<<<< HEAD
async function interact_register(meterContractSrc) {
  const contract = warp.contract(meterContractSrc).connect(wallet);
  const interactionResult = await contract.dryWrite({
    txHash:
      "0x1c24c740852988ebf00b3871f5f7b0c6cc24e620a89a834e9d15173143bd5bd",
    function: "register",
  });
  console.log("result", interactionResult);
}

async function interact_topup(meterContractSrc) {
  const contract = warp.contract(meterContractSrc).connect(wallet);
  const interactionResult = await contract.dryWrite({
    txHash:
      "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a",
    function: "topup",
  });
=======
async function interact_evm(contractId, func, txHash) {
  const contract = warp.contract(contractId).connect(wallet);
  const interactionResult = await contract.dryWrite(
    {
      function: func,
      txHash,
    },
    { tags }
  );
>>>>>>> 2de10ba83349514588a0802ef1882da0b08cae41
  console.log("result", interactionResult);
}

async function interact_meter(meterContractSrc) {
  const contract = warp.contract(meterContractSrc).connect(wallet);
  const interactionResult = await contract.dryWrite(
    {
      function: "meter",
      data: [
        "3hJqbHdoQszEh8ilx12DHNH3kKWjDao3QIUeAgVolHw=",
        "N04iKIOS0QdYzz/Vsjwuc49WVtz5g6z7CuHsRfuAqdJ+PZBdQDC4W8TurKoPC6K+nOKzObxAfEFgvSzTfoCIBw==",
        [656, 2.08, 0.049566],
      ],
    },
    { tags }
  );
  console.log("result", interactionResult);
}

<<<<<<< HEAD
interact_register("FqYq9EnbMfKCKz6s54xusNQ7RylsmTLB_o8u6xYXPU8");
//interact_meter("FqYq9EnbMfKCKz6s54xusNQ7RylsmTLB_o8u6xYXPU8");
// interact_topup("FqYq9EnbMfKCKz6s54xusNQ7RylsmTLB_o8u6xYXPU8");
=======
// interact_meter("4A3sCQ-fWlzSc17He_mPd_s3QTbPuzzOmrR_RAkPPv8");
interact_evm(
  "4A3sCQ-fWlzSc17He_mPd_s3QTbPuzzOmrR_RAkPPv8",
  "register",
  "0xb468900b039d9620c2a2afd72185d8f67b457661978aea7e9a6b9d6ec0155cdf"
);
// interact_evm(
//   "nOUT-A6s1N-YEGd-sdQet2G_QWHJPuC16PAI0w1vIUI",
//   "topup",
//   "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a"
// );
>>>>>>> 2de10ba83349514588a0802ef1882da0b08cae41
