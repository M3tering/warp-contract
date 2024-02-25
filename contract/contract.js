export function handle(state, action){

    if(action.input.function == "subtract_energy_usage_state"){
        return subract_energy_usage_state(state, action)
    } 
}

function subract_energy_usage_state(state, action){
    if(!action.input.data.kwh){
        new ContractError("the data object requires kwh parameter")
    }
    let new_balance = state.kwh_balance - action.input.data.kwh
    state.kwh_balance = new_balance
    if(state.kwh_balance <= 0){
        state.is_on = false
    }

    return {state}
}


/*state = {
    kwh_balance: f64,
    public_key: String,
    nft_id: u64,
    tariff: f64,
    nonce: u64,
    is_on: bool,
}*/
