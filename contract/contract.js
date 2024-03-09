import { convertBase64StringtoUint8Array, validate_payload } from "../logic"

export function handle(state, action){

    if(action.input.function === "subtract_energy_usage_state"){
        return handle_subtract_event(state, action)
    } 

    throw new ContractError("function not recognised")
}

function handle_subtract_event(state, action){
    let payload = action.input.data
    let pubkey = state.public_key
    let convertedPubKey = convertBase64StringtoUint8Array(pubkey)

    if(!payload) throw new ContractError('Interaction payload missing')

    let nonce = payload[0]
    if(nonce < state.nonce) throw new ContractError('Invalid nonce')
    
    let isPayloadValid = validate_payload(payload, convertedPubKey)

    if(isPayloadValid === true){
        subtract_usage_from_balance()
    }else{
        throw new ContractError('Payload is not valid')
    }


    function subtract_usage_from_balance(){
        let payload_kwh = payload[2][2]
        let newBalance = state.kwh_balance - (payload_kwh * state.tariff)
        state.kwh_balance = newBalance
        if(state.kwh_balance <= 0){
            state.is_on = false
        }
    }
    return {state}
}

//payload = ["contractId", "signature", [nonce, current, energy]]

/*state = {
    kwh_balance: f64,
    public_key: String,
    nft_id: u64,
    tariff: f64,
    nonce: u64,
    is_on: bool,
}*/
