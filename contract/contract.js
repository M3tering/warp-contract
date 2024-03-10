import {
  handle_topup,
  handle_tariff,
  handle_metering,
  handle_registration,
} from "./logic";

export function handle(state, action) {
  switch (action.input.function) {
    case "register":
      return handle_registration(state, action);
    case "meter":
      return handle_metering(state, action);
    case "tariff":
      return handle_tariff(state, action);
    case "topup":
      return handle_topup(state, action);
  }
  throw new ContractError("function not recognized");
}

/*state = {
    is_on: bool,
    kwh_balance: f64,
    nonce: u64,
    public_key: String,
    tariff: f64,
    token_id: u64,
}*/
