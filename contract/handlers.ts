import { validateTxLogs, validatePayload } from "./validators";
import { EVM_CONFIG } from "./constants";

export async function register(state: State, action: EvmAction) {
  const txHash = action.input.txHash;
  if (!txHash) throw new ContractError("Interaction txHash missing");

  const { blockHeight, data } = await validateTxLogs(
    EVM_CONFIG.REGISTRATION_EVENT_TOPIC,
    EVM_CONFIG.REGISTRATION_EVENT_ABI,
    EVM_CONFIG.M3TER_ADDRESS,
    state.last_block,
    state.token_id,
    txHash,
  );

  state.last_block = blockHeight;
  state.public_key = SmartWeave.extensions.ethers
    .encodeBase64(data.args[1])
    .toString();

  return { state };
}

export async function topup(state: State, action: EvmAction) {
  const txHash = action.input.txHash;
  if (!txHash) throw new ContractError("Interaction txHash missing");

  const { blockHeight, data } = await validateTxLogs(
    EVM_CONFIG.REVENUE_EVENT_TOPIC,
    EVM_CONFIG.REVENUE_EVENT_ABI,
    EVM_CONFIG.PROTOCOL_ADDRESS,
    state.last_block,
    state.token_id,
    txHash,
  );

  const amountPaid = Number(data.args[1]) / 1e18;
  const tariff = Number(data.args[2]) / 1e18;

  state.last_block = blockHeight;
  state.kwh_balance += amountPaid * tariff;

  return { state };
}

export function meter(state: State, action: MeterAction) {
  const payload: Payload = action.input.payload;
  if (!payload) throw new ContractError("Interaction payload missing");

  //==========================================================================//
  // PAYLOAD: ["[nonce, voltage, current, energy]", "signature", "publicKey"] //
  //==========================================================================//

  const validity = validatePayload(payload, state.public_key);
  if (validity !== true) throw new ContractError("Invalid payload");

  const [nonce, , , energy] = JSON.parse(payload[0]);
  if (nonce <= state.nonce) throw new ContractError("Invalid nonce");

  state.kwh_balance -= energy;
  if (state.kwh_balance <= 0) state.is_on = false;

  state.nonce = nonce;
  return { state };
}
