import { validateTxLogs, validatePayload } from "./validators";
import * as EVM from "./constants";

export async function registration(state, action) {
  const { blockHeight, data } = await validateTxLogs(
    action.input.data.transaction_hash,
    state.last_block,
    state.token_id,
    EVM.M3TER_ADDRESS,
    EVM.REGISTRATION_EVENT_ABI,
    EVM.REGISTRATION_EVENT_TOPIC
  );

  const publicKey = data.args[1];

  state.last_block = blockHeight;
  state.public_key = publicKey;

  return { state };
}

export async function topup(state, action) {
  const { blockHeight, data } = await validateTxLogs(
    action.input.data.transaction_hash,
    state.last_block,
    state.token_id,
    EVM.PROTOCOL_ADDRESS,
    EVM.REVENUE_EVENT_ABI,
    EVM.REVENUE_EVENT_TOPIC
  );

  const amountPaid = Number(data.args[1]) / 1e18;
  const tariff = Number(data.args[2]) / 1e18;

  state.last_block = blockHeight;
  state.kwh_balance += amountPaid * tariff;

  return { state };
}

export function metering(state, action) {
  const payload = action.input.data;
  if (!payload) throw new ContractError("Interaction payload missing");

  //======================================================//
  // PAYLOAD:                                             //
  //    [publicKey, signature, [nonce, current, energy]]  //
  //======================================================//

  const nonce = payload[2][0];
  if (nonce < state.nonce) throw new ContractError("Invalid nonce");

  const validity = validatePayload(payload, state.public_key);
  if (validity !== true) throw new ContractError("Invalid payload");

  state.kwh_balance -= payload[2][2];
  if (state.kwh_balance <= 0) state.is_on = false;

  state.nonce = nonce;
  return { state };
}
