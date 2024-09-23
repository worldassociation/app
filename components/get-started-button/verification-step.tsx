import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { ZkMeWidget } from '@zkmelabs/widget';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { DialogDescription } from '../ui/dialog';
import { UserRoundCheck, UserRoundPlus } from 'lucide-react';
import { VerificationCardSkeleton } from '../VerificationCardSkeleton';
import { mintMembershipZkMe } from '@/lib/actions';
import '@zkmelabs/widget/dist/style.css';

interface VerificationStepProps {
  onNext: () => void;
  verificationData: {
    isZkMeVerified: boolean;
    isCoinbaseVerified: boolean;
    isLoading: boolean;
    balanceData: {
      decimals: number;
      formatted: string;
      symbol: string;
      value: bigint;
    };
  };
  setIsDialogOpen: (isOpen: boolean) => void;
  handleOpenDialog: (step?: number) => void;
  onVerificationChange: (zkMe: boolean, coinbase: boolean) => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  onNext,
  verificationData,
  setIsDialogOpen,
  handleOpenDialog,
  onVerificationChange
}: VerificationStepProps) => {
  const { address } = useAccount();
  const {
    isZkMeVerified: isZkMeVerifiedProp,
    isCoinbaseVerified: isCoinbaseVerifiedProp,
    isLoading,
    balanceData
  } = verificationData;

  const [widget, setWidget] = useState<ZkMeWidget | null>(null);
  const [isZkMeVerified, setIsZkMeVerified] = useState(isZkMeVerifiedProp);
  const [isCoinbaseVerified, setIsCoinbaseVerified] = useState(
    isCoinbaseVerifiedProp
  );

  const [showMintDialog, setShowMintDialog] = useState(false);
  const [mintDialogContent, setMintDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    setIsZkMeVerified(isZkMeVerifiedProp);
    setIsCoinbaseVerified(isCoinbaseVerifiedProp);
  }, [isZkMeVerifiedProp, isCoinbaseVerifiedProp]);

  useEffect(() => {
    const initializeWidget = async () => {
      if (!address) {
        setWidget(null);
        return;
      }

      const newProvider = {
        async getAccessToken() {
          const response = await fetch('/api/zkme-token');
          const data = await response.json();
          return data.accessToken;
        },
        async getUserAccounts() {
          return [address];
        }
      };

      const newWidget = new ZkMeWidget(
        'M2024053066119595336406774111128',
        'World Association',
        '0x2105',
        newProvider,
        {
          lv: 'MeID',
          mode: 'wallet'
        }
      );
      setWidget(newWidget);
    };

    initializeWidget();
  }, [address]);

  const handleLaunchWidget = () => {
    if (widget) {
      setIsDialogOpen(false);
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          setIsZkMeVerified(true);
          onVerificationChange(isZkMeVerified, isCoinbaseVerified);
          await handleMintMembershipZkMe();
        }
      });
      widget.on('close', () => {
        handleOpenDialog(2);
      });
    }
  };

  const handleMintMembershipZkMe = async () => {
    if (!address || (balanceData && balanceData.value > BigInt(0))) {
      console.log('Minting skipped: No address or already has a token');
      return;
    }

    setIsMinting(true);
    setShowMintDialog(true);
    setMintDialogContent({
      title: 'Issuing membership',
      description: 'Please wait while we issue your membership...'
    });

    try {
      await mintMembershipZkMe(address);
      setMintDialogContent({
        title: 'Success',
        description: 'Membership issued successfully!'
      });
    } catch (error) {
      console.error('Error minting membership SBT:', error);
      setMintDialogContent({
        title: 'Error',
        description: 'Failed to issue membership. Please try again.'
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <DialogDescription>
        Join us simply by proving that you are a real and unique human.
      </DialogDescription>

      {isLoading ? (
        <>
          <VerificationCardSkeleton />
          <div className="-my-1.5 flex w-full items-center">
            <div className="mt-px h-px flex-grow bg-border"></div>
            <span className="mx-2 text-[13px] text-muted-foreground/50">
              AND / OR
            </span>
            <div className="mt-px h-px flex-grow bg-border"></div>
          </div>
          <VerificationCardSkeleton />
          <div className="-my-1.5 flex w-full items-center">
            <div className="mt-px h-px flex-grow bg-border"></div>
            <span className="mx-2 text-[13px] text-muted-foreground/50">
              AND / OR
            </span>
            <div className="mt-px h-px flex-grow bg-border"></div>
          </div>
          <VerificationCardSkeleton />
        </>
      ) : (
        <>
          {/* ZkMe Verification Card */}
          <Card
            onClick={handleLaunchWidget}
            className={`flex cursor-pointer flex-col justify-between ${isZkMeVerified ? 'bg-muted' : ''}`}
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between space-y-0 px-6 pb-1 pt-6">
                <CardTitle
                  className={isZkMeVerified ? 'text-muted-foreground' : ''}
                >
                  {isZkMeVerified ? 'Verified with zkMe' : 'Verify with zkMe'}
                </CardTitle>
                {isZkMeVerified ? (
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
              <p className="pb-4 pl-6 text-[11px] text-muted-foreground">
                {isZkMeVerified
                  ? '0.5 world drachma per day'
                  : '+0.5 world drachma per day'}
              </p>
            </div>
            <CardDescription className="px-6 pb-6 leading-relaxed">
              {isZkMeVerified
                ? 'You already completed the face verification process.'
                : 'Prove your personhood through a fully encrypted face verification process.'}
            </CardDescription>
          </Card>

          <div className="-my-1.5 flex w-full items-center">
            <div className="mt-px h-px flex-grow bg-border"></div>
            <span className="mx-2 text-[13px] text-muted-foreground/50">
              AND / OR
            </span>
            <div className="mt-px h-px flex-grow bg-border"></div>
          </div>

          {/* Coinbase Verification Card */}
          <a
            href="https://www.coinbase.com/onchain-verify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              className={`flex cursor-pointer flex-col justify-between ${isCoinbaseVerified ? 'bg-muted' : ''}`}
            >
              <div className="flex flex-col">
                <div className="flex flex-row justify-between space-y-0 px-6 pb-1 pt-6">
                  <CardTitle
                    className={
                      isCoinbaseVerified ? 'text-muted-foreground' : ''
                    }
                  >
                    {isCoinbaseVerified
                      ? 'Verified with Coinbase'
                      : 'Verify with Coinbase'}
                  </CardTitle>
                  {isCoinbaseVerified ? (
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
                <p className="pb-4 pl-6 text-[11px] text-muted-foreground">
                  {isCoinbaseVerified
                    ? '0.5 world drachma per day'
                    : '+0.5 world drachma per day'}
                </p>
              </div>
              <CardDescription className="px-6 pb-6 leading-relaxed">
                {isCoinbaseVerified
                  ? 'You already verified that you have a valid trading account.'
                  : 'A Coinbase Verification privately attests that you have a valid trading account.'}
              </CardDescription>
            </Card>
          </a>
        </>
      )}

      <AlertDialog open={showMintDialog} onOpenChange={setShowMintDialog}>
        <AlertDialogContent>
          {isMinting ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <AlertDialogDescription>
                {mintDialogContent.description}
              </AlertDialogDescription>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{mintDialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {mintDialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  className="w-40"
                  onClick={() => {
                    setShowMintDialog(false);
                    if (mintDialogContent.title === 'Success') {
                      onNext();
                    }
                  }}
                >
                  Close
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
