import * as stablelib from "@stablelib/ed25519";

function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
}

function validate_payload(payload, pubKey) {
  const pubKeyArray = base64ToBytes(pubKey);
  const signatureArray = base64ToBytes(payload[1]);
  const messageArray = new TextEncoder().encode(JSON.stringify(payload[2]));

  return stablelib.verify(pubKeyArray, messageArray, signatureArray);
}


export function handle_metering(state, action) {
  const payload = action.input.data;
  if (!payload) throw new ContractError("Interaction payload missing");

  //======================================================//
  // PAYLOAD:                                             //
  //    [publicKey, signature, [nonce, current, energy]]  //
  //======================================================//

  const nonce = payload[0];
  if (nonce < state.nonce) throw new ContractError("Invalid nonce");

  const isPayloadValid = validate_payload(payload, state.public_key);
  if (isPayloadValid !== true)
    throw new ContractError(`Payload is ${isPayloadValid}`);

  const payload_kwh = payload[2][2];
  state.kwh_balance -= payload_kwh * state.tariff;
  state.nonce = nonce;

  if (state.kwh_balance <= 0) state.is_on = false;
  return { state };
}


export function handle_topup(state, action) {
  // ToDo: handle payment from EVM
}

export function handle_tariff(state, action) {
  // ToDo: handle tariff update from EVM
}

export function handle_registration(state, action) {
  // ToDo: handle meter registration on EVM
}