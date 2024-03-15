
  // contract/constants.js
  var REVENUE_EVENT_ABI = [
    "event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)"
  ];
  var REGISTRATION_EVENT_ABI = [
    "event Register(uint256 indexed tokenId, bytes32 indexed publicKey, address from, uint256 timestamp)"
  ];
  var REGISTRATION_EVENT_TOPIC = "0x802abf5d4820f78b3f21914ccd6a0eb1d54d61b57882c8a0185f8577a4bbe581";
  var REVENUE_EVENT_TOPIC = "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76";
  var PROTOCOL_ADDRESS = "0x15Fd3b92Eda42b55C7c521DFff5fdeeC5d76D04a";
  var M3TER_ADDRESS = "0x09992dfF01DAecdbdFA1dDb97006f77777900A45";
  var GNOSIS_RPC = "https://rpc.chiadochain.net";

  // contract/utils.js
  function base64ToBytes(base64) {
    return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
  }
  function hexToBase64(hexString) {
    const [_, hex] = hexString.split("0x");
    return btoa(
      hex.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
      }).join("")
    );
  }

  // contract/validators.js
  function validatePayload(payload, pubKey) {
    const pubKeyArray = base64ToBytes(pubKey);
    const signatureArray = base64ToBytes(payload[1]);
    const messageArray = new TextEncoder().encode(JSON.stringify(payload[2]));
    return SmartWeave.extensions.ed25519.verify(
      pubKeyArray,
      messageArray,
      signatureArray
    );
  }
  async function validateTxLogs(txHash, lastBlockHeight, tokenIdFromState, contractAddress, eventAbi, eventTopic) {
    const provider = new SmartWeave.extensions.ethers.JsonRpcProvider(GNOSIS_RPC);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt)
      throw new Error("Transaction not found or not yet mined");
    if (receipt.logs.length === 0)
      throw new Error("No Transfer events found");
    const iface = new SmartWeave.extensions.ethers.Interface(eventAbi);
    const logContent = receipt.logs[0];
    const blockHeight = logContent["blockNumber"];
    const address = logContent["address"];
    const data = iface.parseLog(logContent);
    const tokenIdFromLog = Number(data.args[0]);
    if (blockHeight <= lastBlockHeight)
      throw new Error("Block height not valid");
    if (address !== contractAddress)
      throw new Error("Adrress is Invalid");
    if (data.topic !== eventTopic)
      throw new Error("Topic validation failed");
    if (tokenIdFromLog !== tokenIdFromState)
      throw new Error("Token Id does not match");
    return {
      blockHeight,
      data
    };
  }

  // contract/handlers.js
  async function registration(state, action) {
    const { blockHeight, data } = await validateTxLogs(
      action.input.data.transaction_hash,
      state.last_block,
      state.token_id,
      M3TER_ADDRESS,
      REGISTRATION_EVENT_ABI,
      REGISTRATION_EVENT_TOPIC
    );
    const publicKey = hexToBase64(data.args[1]);
    state.last_block = blockHeight;
    state.public_key = publicKey;
    return { state };
  }
  async function topup(state, action) {
    const { blockHeight, data } = await validateTxLogs(
      action.input.data.transaction_hash,
      state.last_block,
      state.token_id,
      PROTOCOL_ADDRESS,
      REVENUE_EVENT_ABI,
      REVENUE_EVENT_TOPIC
    );
    const amountPaid = Number(data.args[1]) / 1e18;
    const tariff = Number(data.args[2]) / 1e18;
    state.last_block = blockHeight;
    state.kwh_balance += amountPaid * tariff;
    return { state };
  }
  function metering(state, action) {
    const payload = action.input.data;
    if (!payload)
      throw new ContractError("Interaction payload missing");
    const nonce = payload[2][0];
    if (nonce < state.nonce)
      throw new ContractError("Invalid nonce");
    const validity = validatePayload(payload, state.public_key);
    if (validity !== true)
      throw new ContractError("Invalid payload");
    state.kwh_balance -= payload[2][2];
    if (state.kwh_balance <= 0)
      state.is_on = false;
    state.nonce = nonce;
    return { state };
  }

  // contract/contract.js
  function handle(state, action) {
    switch (action.input.function) {
      case "register":
        return registration(state, action);
      case "meter":
        return metering(state, action);
      case "topup":
        return topup(state, action);
    }
    throw new ContractError("function not recognized");
  }

