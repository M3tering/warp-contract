export const EVM_CONFIG = {
  REVENUE_EVENT_ABI: [
    "event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)",
  ],
  REGISTRATION_EVENT_ABI: [
    "event Register(uint256 indexed tokenId, bytes32 indexed publicKey, address from, uint256 timestamp)",
  ],
  REGISTRATION_EVENT_TOPIC:
    "0x802abf5d4820f78b3f21914ccd6a0eb1d54d61b57882c8a0185f8577a4bbe581",
  REVENUE_EVENT_TOPIC:
    "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76",

  PROTOCOL_ADDRESS: "", // ToDo: add contract address in mainnet
  M3TER_ADDRESS: "", // ToDo: add contract address in mainnet
  GNOSIS_RPC: "https://gnosis-rpc.publicnode.com",
};

// !! Testnet settings !!
// ToDo: remove this section in mainnet
EVM_CONFIG.PROTOCOL_ADDRESS = "0x1AA8aDe038132978FabD42e192DB4421829AC43E";
EVM_CONFIG.M3TER_ADDRESS = "0xAEc0E1811a4c53caa530769aFBbFe5e07E91b79d";
EVM_CONFIG.GNOSIS_RPC = "https://rpc.chiadochain.net";
