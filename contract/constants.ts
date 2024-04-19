export const EVM_CONFIG = {
  RPC_ENDPOINT: "https://gnosis-rpc.publicnode.com",

  M3TER_CONTRACT_ADDRESS: "0x39fb420Bd583cCC8Afd1A1eAce2907fe300ABD02",

  PROTOCOL_CONTRACT_ADDRESS: "0x2b3997D82C836bd33C89e20fBaEF96CA99F1B24A",

  REVENUE_EVENT_TOPIC:
    "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76",

  REGISTRATION_EVENT_TOPIC:
    "0x802abf5d4820f78b3f21914ccd6a0eb1d54d61b57882c8a0185f8577a4bbe581",

  REGISTRATION_EVENT_ABI: [
    "event Register(uint256 indexed tokenId, bytes32 indexed publicKey, address from, uint256 timestamp)",
  ],

  REVENUE_EVENT_ABI: [
    "event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)",
  ],
};
