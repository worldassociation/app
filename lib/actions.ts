'use server';

import { Engine } from '@thirdweb-dev/engine';
import {
  CHAIN,
  DRACHMA_CONTRACT_ADDRESS,
  GLOBAL_VOTER_ID_ZKME_ADDRESS,
  DRACHMA_TREASURY_ADDRESS,
  CFA_V1_FORWARDER_ADDRESS
} from './constants';
import { ISuccessResult } from '@worldcoin/idkit';

const {
  THIRDWEB_ENGINE_URL,
  THIRDWEB_ENGINE_ACCESS_TOKEN,
  THIRDWEB_BACKEND_WALLET_ADDRESS,
  THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS,
  NEXT_PUBLIC_WLD_APP_ID
} = process.env;

if (!THIRDWEB_ENGINE_URL) throw new Error('THIRDWEB_ENGINE_URL is missing');
if (!THIRDWEB_ENGINE_ACCESS_TOKEN)
  throw new Error('THIRDWEB_ENGINE_ACCESS_TOKEN is missing');
if (!THIRDWEB_BACKEND_WALLET_ADDRESS)
  throw new Error('THIRDWEB_BACKEND_WALLET_ADDRESS is missing');
if (!THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS)
  throw new Error('THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS is missing');
if (!NEXT_PUBLIC_WLD_APP_ID)
  throw new Error('NEXT_PUBLIC_WLD_APP_ID is missing');

export async function mintGlobalVoterIdZkMe(address: string) {
  console.log('Starting mintGlobalVoterIdZkMe function');
  console.log('Address to mint to:', address);

  const engine = new Engine({
    url: THIRDWEB_ENGINE_URL as string,
    accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN as string
  });
  console.log('Engine initialized with URL:', THIRDWEB_ENGINE_URL);
  console.log(
    'Engine initialized with access token:',
    THIRDWEB_ENGINE_ACCESS_TOKEN
  );

  try {
    await engine.erc20.mintTo(
      CHAIN,
      GLOBAL_VOTER_ID_ZKME_ADDRESS,
      THIRDWEB_BACKEND_WALLET_ADDRESS as string,
      {
        toAddress: address,
        amount: '1.0'
      },
      false,
      '',
      THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS
    );
    console.log('Minting successful to address:', address);
  } catch (error) {
    console.error('Error during minting:', error);
    throw new Error('Failed to mint voter ID');
  }
}

export async function createTestDrachmaStream(
  address: string,
  flowRate: bigint
) {
  console.log('Starting createDrachmaStream function');
  console.log('Address to create stream for:', address);
  console.log('Flow rate:', flowRate.toString());

  const engine = new Engine({
    url: THIRDWEB_ENGINE_URL as string,
    accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN as string
  });
  console.log('Engine initialized with URL:', THIRDWEB_ENGINE_URL);
  console.log(
    'Engine initialized with access token:',
    THIRDWEB_ENGINE_ACCESS_TOKEN
  );

  try {
    await engine.contract.write(
      CHAIN,
      CFA_V1_FORWARDER_ADDRESS,
      THIRDWEB_BACKEND_WALLET_ADDRESS as string,
      {
        functionName: 'createFlow',
        args: [
          DRACHMA_CONTRACT_ADDRESS,
          DRACHMA_TREASURY_ADDRESS as string,
          address,
          flowRate.toString(),
          '0x0000000000000000000000000000000000000000'
        ]
      },
      false,
      '',
      THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS
    );
    console.log('Stream creation successful to address:', address);
  } catch (error) {
    console.error('Error during stream creation:', error);
    throw new Error('Failed to create stream');
  }
}

const verifyEndpoint = `https://developer.worldcoin.org/api/v1/verify/${NEXT_PUBLIC_WLD_APP_ID}`;

export async function verifyWorldIDProof(result: ISuccessResult) {
  console.log('Proof received from IDKit:\n', JSON.stringify(result));

  const reqBody = {
    merkle_root: result.merkle_root,
    nullifier_hash: result.nullifier_hash,
    proof: result.proof,
    verification_level: result.verification_level,
    action: process.env.NEXT_PUBLIC_WLD_ACTION,
    signal: ''
  };

  console.log(
    'Sending proof to World ID for verification:\n',
    JSON.stringify(reqBody)
  );

  try {
    const verifyRes = await fetch(verifyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });

    const wldResponse = await verifyRes.json();
    console.log(
      `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
      wldResponse
    );

    if (verifyRes.ok) {
      console.log(
        "Credential verified! This user's nullifier hash is: ",
        wldResponse.nullifier_hash
      );
      return { success: true, message: 'This action verified correctly!' };
    } else {
      return { success: false, error: wldResponse.detail };
    }
  } catch (error) {
    console.error('Error verifying World ID credential:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getZkMeToken() {
  const { ZKME_API_KEY } = process.env;

  if (!ZKME_API_KEY) {
    throw new Error('ZKME_API_KEY is missing');
  }

  const response = await fetch('https://nest-api.zk.me/api/token/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'World Association'
    },
    body: JSON.stringify({
      apiKey: ZKME_API_KEY,
      appId: 'M2024053066119595336406774111128',
      apiModePermission: 1,
      lv: 2
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch zkMe token');
  }

  const data = await response.json();
  console.log('zkMe token response:', data);

  return data.data.accessToken;
}
