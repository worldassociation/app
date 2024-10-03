export const CHAIN = 'base';
export const GLOBAL_VOTER_ID_ZKME_ADDRESS =
  '0x762CEc1f35e517Da6C178262F8864Fd92b70A20b';
export const DRACHMA_CONTRACT_ADDRESS =
  '0x2ce6f5e18ee4278dc33df82a28286f006d7d5730';
export const DRACHMA_TREASURY_ADDRESS =
  '0x0a5aaedf418b08a5cd1adeba1d0d8739c7ea8000';
export const CFA_V1_FORWARDER_ADDRESS =
  '0xcfA132E353cB4E398080B9700609bb008eceB125';
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
export const FLOW_RATE = '11574074074074';
