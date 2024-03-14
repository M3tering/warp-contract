import * as handling from "./handlers.js";

export function handle(state, action) {
  switch (action.input.function) {
    case "register":
      return handling.registration(state, action);
    case "meter":
      return handling.metering(state, action);
    case "topup":
      return handling.topup(state, action);
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
