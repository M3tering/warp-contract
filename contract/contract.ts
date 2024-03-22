import { register, topup, meter } from "./handlers";
import { EvmAction, MeterAction, State } from "./types";

declare const ContractError: any;

export function handle(state: State, action: EvmAction | MeterAction) {
  switch (action.input.function) {
    case "register":
      return register(state, action as EvmAction);
    case "topup":
      return topup(state, action as EvmAction);
    case "meter":
      return meter(state, action as MeterAction);
  }
  throw new ContractError("function not recognized");
}

/*state = {
    is_on: bool,
    kwh_balance: f64,
    last_block: u64,
    nonce: u64,
    public_key: String,
    token_id: u64,
}*/
