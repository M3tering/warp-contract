// import { ethers } from "ethers";
// import { verify } from "@stablelib/ed25519";
// import { EVM_CONFIG } from "../contract/constants";
// import { validateTxLogs } from "../contract/validators";
// import initialState from "../initialState.json" assert { type: "json" };

// function test_verify() {
//   const pubKeyArray = ethers.decodeBase64(
//     "XUO7gdG9av1XZt3wqMLb8+FUlkgnpZstvYi9g4NAUhk="
//   );
//   const signatureArray = ethers.decodeBase64(
//     "BESz9DprHAtUqiPwiYio/ZNr2f4Q5ZQXzLIK8V/QqfeE/iQ3ThR5tAg2bUIKq6eTGPqA0YucmsABX6tFO5TuAQ=="
//   );
//   const messageArray = new TextEncoder().encode(
//     JSON.stringify([1, 7.23, 15.7])
//   );
//   console.log("Starting verification");
//   const state = verify(pubKeyArray, messageArray, signatureArray);
//   console.log("Message is ", state);
// }

// async function test_validate_logs() {
//   const { blockHeight, data } = await validateTxLogs(
//     EVM_CONFIG.REGISTRATION_EVENT_TOPIC,
//     EVM_CONFIG.REGISTRATION_EVENT_ABI,
//     EVM_CONFIG.M3TER_ADDRESS,
//     initialState.last_block,
//     initialState.token_id,
//     "0x1c24c740852988ebf00b3871f5f7b0c6cc24e620a89a834e9d15173143bd5bdf",
//   );

//   console.log("Block Height", blockHeight);
//   console.log("data", data);

//   console.log("Public Key: hex", data.args[1]);
//   console.log("Public Key: base64", ethers.encodeBase64(data.args[1]));
// }

// test_verify();
