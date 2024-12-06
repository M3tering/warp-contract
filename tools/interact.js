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
  { name: "Content-Type", value: "application/json" },
];

async function interact_evm(contractId, func, txHash) {
  const contract = warp.contract(contractId).connect(wallet);
  const interactionResult = await contract.writeInteraction(
    {
      function: func,
      txHash,
    },
    { tags, inputFormatAsData: true }
  );
  console.log("result", interactionResult);
}

async function interact_meter(meterContractSrc) {
  const contract = warp.contract(meterContractSrc).connect(wallet);
  const interactionResult = await contract.dryWrite(
    {
      function: "meter",
      payload: [
        "[0,218.4,0.47,0.009708]",
        "iSSc6rP+WNvA+HsMuHx4kXvb4uo4+qgsQr1txwA2ljIwmk/RHWjGN7QSw9nFGBWmdozbe9rBq5fE+UVVYjEvCg==",
        "3hJqbHdoQszEh8ilx12DHNH3kKWjDao3QIUeAgVolHw=",
      ],
    },
    { tags, inputFormatAsData: true }
  );
  console.log("result", interactionResult);
}

// interact_meter("CNHh0EvGy13WQ1x9yN58-M0qRvEeRavON70jt4H0mh8");
// interact_evm(
//   "CNHh0EvGy13WQ1x9yN58-M0qRvEeRavON70jt4H0mh8",
//   "register",
//   "0x98e92e0fddbf182af556c7febfb290ba9904ff311749100dc790b600a2e586b5"
// );
interact_evm(
  "CNHh0EvGy13WQ1x9yN58-M0qRvEeRavON70jt4H0mh8",
  "topup",
  "0x6070ed5b83cf9de52e0dfb0196657f93a34d89a1c2ee4da9fbd13202521bfe94"
);
