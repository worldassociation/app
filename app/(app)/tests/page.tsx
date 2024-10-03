'use client';

import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel
} from '@worldcoin/idkit';
import { UserRoundCheck, UserRoundPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verifyWorldIDProof } from '@/lib/actions';

export default function TestsPage() {
  const [isWorldIDVerified, setIsWorldIDVerified] = useState(false);

  const handleWorldIDVerification = async (result: ISuccessResult) => {
    const verificationResult = await verifyWorldIDProof(result);
    if (verificationResult.success) {
      console.log(
        'World ID verification successful:',
        verificationResult.message
      );
      setIsWorldIDVerified(true);
      //   onVerificationChange(
      //     verificationData.isZkMeVerified,
      //     verificationData.isCoinbaseVerified,
      //     true
      //  );
      //   await handleMintMembershipSBT();
    } else {
      console.error('World ID verification failed:', verificationResult.error);
    }
  };

  return (
    <main className="flex min-h-[calc(100dvh-108px)] flex-col items-center p-4 pb-8 md:justify-center">
      {/* World ID Verification Card */}
      <Card
        className={`flex cursor-pointer flex-col justify-between ${isWorldIDVerified ? 'bg-muted' : ''}`}
      >
        <div className="flex flex-row justify-between space-y-0 px-6 pb-4 pt-6">
          <CardTitle
            className={isWorldIDVerified ? 'text-muted-foreground' : ''}
          >
            {isWorldIDVerified
              ? 'Verified with Worldcoin (test)'
              : 'Verify with Worldcoin (test)'}
          </CardTitle>
          {isWorldIDVerified ? (
            <UserRoundCheck
              className="size-[18px] text-muted-foreground"
              strokeWidth={1}
            />
          ) : (
            <UserRoundPlus
              className="size-[18px] text-muted-foreground"
              strokeWidth={1}
            />
          )}
        </div>
        <CardDescription className="px-6 pb-6 leading-relaxed">
          {isWorldIDVerified
            ? 'You have successfully verified with World ID.'
            : 'Prove your uniqueness with a World ID verification.'}
        </CardDescription>
        <div className="px-6 pb-6">
          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
            action={process.env.NEXT_PUBLIC_WLD_ACTION!}
            verification_level={VerificationLevel.Device}
            handleVerify={handleWorldIDVerification}
            onSuccess={() => {
              console.log('World ID verification successful');
            }}
          >
            {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
          </IDKitWidget>
        </div>
      </Card>
    </main>
  );
}
