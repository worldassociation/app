import { NextResponse } from 'next/server';
import { verifyMeidWithZkMeServices } from '@zkmelabs/widget';
import { getAttestations } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const { isGrant } = await verifyMeidWithZkMeServices(
      'M2024053066119595336406774111128',
      address
    );

    const attestations = await getAttestations(address as `0x${string}`, base, {
      schemas: [COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID as `0x${string}`]
    });

    return NextResponse.json({
      isZkMeVerified: isGrant,
      isCoinbaseVerified: attestations.length > 0
    });
  } catch (error) {
    console.error('Error during verification process:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
