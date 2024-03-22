export interface State {
  is_on: boolean;
  kwh_balance: number;
  last_block: number;
  nonce: number;
  public_key: string;
  token_id: number;
}

export interface EvmAction {
  input: EvmInput;
}

export interface EvmInput {
  txHash: string;
  function: string;
}

export interface MeterAction {
  input: MeterInput;
}

export interface MeterInput {
  data: Payload;
  function: string;
}

export interface Payload {
  0: string;
  1: string;
  2: number[];
}
