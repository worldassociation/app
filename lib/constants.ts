export const CHAIN = 'base';
export const TEST_DRACHMA_CONTRACT_ADDRESS =
  '0x524986180284488c8c337d7089f58e0649559cda';
export const TEST_DRACHMA_TREASURY_ADDRESS =
  '0xa3C2c8CE6Be1C55401b5F1EfB6112A86F6374429';
export const DRACHMA_CONTRACT_ADDRESS =
  '0x2ce6f5e18ee4278dc33df82a28286f006d7d5730';
export const DRACHMA_TREASURY_ADDRESS =
  '0x0a5aaedf418b08a5cd1adeba1d0d8739c7ea8000';
export const TEST_MEMBERSHIP_SBT_ADDRESS =
  '0x2F9e9e5D597f245df027F5a900f6E0957472A564';
export const WORLD_ASSOCIATION_MEMBERSHIP_ZKME_ADDRESS =
  '0x0F3270E9d4173d672bEe2f21fC9E4836E9E84eFe';
export const FLOW_RATE = '5787037037037';
export const CFA_V1_FORWARDER_ADDRESS =
  '0xcfA132E353cB4E398080B9700609bb008eceB125';
export const COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID =
  '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9';
export const COINBASE_VERIFIED_COUNTRY_SCHEMA_ID =
  '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9';
export const CFA_V1_FORWARDER_ABI = [
  {
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'account', type: 'address' }
    ],
    name: 'getAccountFlowrate',
    outputs: [{ name: '', type: 'int96' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
