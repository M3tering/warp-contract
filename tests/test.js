import { verify } from "@stablelib/ed25519";
import { validateTxLogs } from "../contract/validators.js";
import { hexToBase64, base64ToBytes } from "../contract/utils.js";

import initialState from "../initialState.json" assert { type: "json" };
import * as EVM from "../contract/constants.js";

function test_verify() {
  const pubKeyArray = base64ToBytes(
    "XUO7gdG9av1XZt3wqMLb8+FUlkgnpZstvYi9g4NAUhk="
  );
  const signatureArray = base64ToBytes(
    "BESz9DprHAtUqiPwiYio/ZNr2f4Q5ZQXzLIK8V/QqfeE/iQ3ThR5tAg2bUIKq6eTGPqA0YucmsABX6tFO5TuAQ=="
  );
  const messageArray = new TextEncoder().encode(
    JSON.stringify([1, 7.23, 15.7])
  );
  console.log("Starting verification");
  const state = verify(pubKeyArray, messageArray, signatureArray);
  console.log("Message is ", state);
}

async function test_validate_logs() {
  const { blockHeight, data } = await validateTxLogs(
    "0x1c24c740852988ebf00b3871f5f7b0c6cc24e620a89a834e9d15173143bd5bdf",
    initialState.last_block,
    initialState.token_id,
    EVM.M3TER_ADDRESS,
    EVM.REGISTRATION_EVENT_ABI,
    EVM.REGISTRATION_EVENT_TOPIC
  );

  console.log("Block Height", blockHeight);
  console.log("data", data);

  console.log("Public Key: hex", data.args[1]);
  console.log("Public Key: base64", hexToBase64(data.args[1]));
  console.log("Public Key: bytes32", base64ToBytes(hexToBase64(data.args[1])));
}

test_verify();
