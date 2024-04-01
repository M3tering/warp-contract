import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension());

const wallet = await warp.arweave.wallets.generate();
const tags = [
  { name: "Contract-Label", value: "M3ters" },
  { name: "Contract-Use", value: "M3tering Protocol" },
];

async function interact_evm(contractId, func, txHash) {
  const contract = warp.contract(contractId).connect(wallet);
  const interactionResult = await contract.writeInteraction(
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
        "3hJqbHdoQszEh8ilx12DHNH3kKWjDao3QIUeAgVolHw=",
        "N04iKIOS0QdYzz/Vsjwuc49WVtz5g6z7CuHsRfuAqdJ+PZBdQDC4W8TurKoPC6K+nOKzObxAfEFgvSzTfoCIBw==",
        [656, 220, 2.08, 0.049566],
      ],
    },
    { tags }
  );
  console.log("result", interactionResult);
}

// interact_meter("QGmbDfSMLpFJsfpByxoA6CN_j9uSL3ozhbItMNsSHIs");
interact_evm(
  "QGmbDfSMLpFJsfpByxoA6CN_j9uSL3ozhbItMNsSHIs",
  "register",
  "0xb468900b039d9620c2a2afd72185d8f67b457661978aea7e9a6b9d6ec0155cdf"
);
// interact_evm(
//   "nOUT-A6s1N-YEGd-sdQet2G_QWHJPuC16PAI0w1vIUI",
//   "topup",
//   "0x26296b719bdf4706da093381cc03da11fc91b94e8b7a8e4893433a712b9d650a"
// );
