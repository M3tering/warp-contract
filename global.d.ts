declare global {
  const SmartWeave: any;
  const ContractError: any;
  interface EvmAction {
    input: EvmInput;
  }

  interface EvmInput {
    txHash: string;
    function: string;
  }

  interface MeterAction {
    input: MeterInput;
  }

  interface MeterInput {
    payload: Payload;
    function: string;
  }

  interface Payload {
    0: string;
    1: string;
    2: string;
  }

  interface State {
    is_on: boolean;
    kwh_balance: number;
    last_block: number;
    nonce: number;
    public_key: string;
    token_id: number;
  } 
}

export default global;
