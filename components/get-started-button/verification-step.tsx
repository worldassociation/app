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
import { Loader2, ScanFace, UserRoundCheck } from 'lucide-react';
import { ZkMeWidget } from '@zkmelabs/widget';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DialogDescription } from '../ui/dialog';
import { VerificationCardSkeleton } from '../VerificationCardSkeleton';
import { mintGlobalVoterIdZkMe } from '@/lib/actions';

interface VerificationStepProps {
  widget: ZkMeWidget | null;
  onNext: () => void;
  verificationData: {
    isZkMeVerified: boolean;
    setIsZkMeVerified: (isZkMeVerified: boolean) => void;
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
  onVerificationChange: (zkMe: boolean) => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  widget,
  onNext,
  verificationData,
  setIsDialogOpen,
  handleOpenDialog,
  onVerificationChange
}: VerificationStepProps) => {
  const { address } = useAccount();
  const { isZkMeVerified, setIsZkMeVerified, isLoading, balanceData } =
    verificationData;

  const [showMintDialog, setShowMintDialog] = useState(false);
  const [mintDialogContent, setMintDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isMinting, setIsMinting] = useState(false);

  const handleLaunchWidget = () => {
    if (widget) {
      setIsDialogOpen(false);
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          setIsZkMeVerified(true);
          onVerificationChange(isZkMeVerified);
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
      title: 'Issuing Global Voter ID',
      description: 'Please wait while we issue your Global Voter ID...'
    });

    try {
      await mintGlobalVoterIdZkMe(address);
      setMintDialogContent({
        title: 'Success',
        description: 'Global Voter ID issued successfully!'
      });
    } catch (error) {
      console.error('Error minting voter ID:', error);
      setMintDialogContent({
        title: 'Error',
        description: 'Failed to issue voter ID. Please try again.'
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <DialogDescription>
        Create your Global Voter ID after verifying your identity through facial
        scanning.
      </DialogDescription>

      {isLoading ? (
        <>
          <VerificationCardSkeleton />
        </>
      ) : (
        <>
          {/* ZkMe Verification Card */}
          <Card
            onClick={handleLaunchWidget}
            className={`flex cursor-pointer flex-col justify-between ${isZkMeVerified ? 'bg-muted' : ''}`}
          >
            <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
              <CardTitle
                className={isZkMeVerified ? 'text-muted-foreground' : ''}
              >
                {isZkMeVerified ? 'Voter ID created' : 'Verify your uniqueness'}
              </CardTitle>
              {isZkMeVerified ? (
                <UserRoundCheck
                  className="size-[18px] text-muted-foreground"
                  strokeWidth={1}
                />
              ) : (
                <ScanFace
                  className="size-[18px] text-muted-foreground"
                  strokeWidth={1}
                />
              )}
            </CardHeader>
            <CardDescription className="px-6 pb-6 leading-relaxed">
              {isZkMeVerified
                ? 'You already completed the face verification process.'
                : 'Prove your personhood through a fully encrypted face verification process.'}
            </CardDescription>
          </Card>
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
