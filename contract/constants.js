export const REVENUE_EVENT_ABI = [
  "event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)",
];
export const REGISTRATION_EVENT_ABI = [
  "event Register(uint256 indexed tokenId, bytes32 indexed publicKey, address from, uint256 timestamp)",
];

export const REGISTRATION_EVENT_TOPIC =
  "0x802abf5d4820f78b3f21914ccd6a0eb1d54d61b57882c8a0185f8577a4bbe581";

export const REVENUE_EVENT_TOPIC =
  "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76";

export const PROTOCOL_ADDRESS = "0x15Fd3b92Eda42b55C7c521DFff5fdeeC5d76D04a";

export const M3TER_ADDRESS = "0x09992dfF01DAecdbdFA1dDb97006f77777900A45";

// export const GNOSIS_RPC = "https://gnosis-rpc.publicnode.com";

export const GNOSIS_RPC = "https://rpc.chiadochain.net"; // ToDo; remove this
