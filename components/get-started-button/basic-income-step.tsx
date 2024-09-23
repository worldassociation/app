import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DialogDescription } from '../ui/dialog';
import { ArrowUpRight, ExternalLink, HandCoins, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { DEMO_STREAM_LINK } from '@/lib/links';
import { createTestDrachmaStream } from '@/lib/actions';
import { FLOW_RATE } from '@/lib/constants';

interface BasicIncomeStepProps {
  isBasicIncomeSetUp: boolean;
  setIsBasicIncomeSetUp: (value: boolean) => void;
  refetchFlowrate: () => void;
  isZkMeVerified: boolean;
  isCoinbaseVerified: boolean;
  flowrateData: bigint | null;
}

export const BasicIncomeStep: React.FC<BasicIncomeStepProps> = ({
  isBasicIncomeSetUp,
  setIsBasicIncomeSetUp,
  refetchFlowrate,
  isZkMeVerified,
  isCoinbaseVerified,
  flowrateData
}) => {
  const { address: activeAddress } = useAccount();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogContent, setResultDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(8);

  const canUpgradeStream =
    isBasicIncomeSetUp &&
    BigInt(flowrateData || 0) === BigInt(FLOW_RATE) &&
    isZkMeVerified &&
    isCoinbaseVerified;

  const handleCreateOrUpgradeDrachmaStream = async () => {
    if (!activeAddress) {
      return;
    }

    if (!isZkMeVerified && !isCoinbaseVerified) {
      setShowVerificationDialog(true);
      return;
    }

    setIsProcessing(true);
    setShowResultDialog(true);

    const newFlowRate =
      isZkMeVerified && isCoinbaseVerified
        ? BigInt(FLOW_RATE) * BigInt(2)
        : BigInt(FLOW_RATE);

    try {
      await createTestDrachmaStream(activeAddress, newFlowRate);
      setResultDialogContent({
        title: isBasicIncomeSetUp ? 'Stream upgraded' : 'Stream created',
        description: isBasicIncomeSetUp
          ? 'Your basic income stream has been successfully upgraded.'
          : 'Your basic income stream has been successfully created.'
      });
      setIsBasicIncomeSetUp(true);
      refetchFlowrate();
      setIsSuccess(true);
      setIsButtonDisabled(true);
      setCountdown(8);
    } catch (error) {
      setResultDialogContent({
        title: 'Error',
        description: `Failed to ${isBasicIncomeSetUp ? 'upgrade' : 'create'} drachma stream. Please try again.`
      });
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isButtonDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isButtonDisabled && countdown === 0) {
      setIsButtonDisabled(false);
      setIsBasicIncomeSetUp(true);
    }
    return () => clearTimeout(timer);
  }, [isButtonDisabled, countdown]);

  const getUserStreamLink = () => {
    if (!activeAddress) return '';
    return DEMO_STREAM_LINK.replace(
      /0x30deD934aac8bb469997AeC40854E38ecd9dC99A/g,
      activeAddress
    );
  };

  return (
    <>
      <DialogDescription>
        Get our official currency, the world drachma, flow into your account
        every second.
      </DialogDescription>

      {isBasicIncomeSetUp ? (
        <>
          <a
            href={getUserStreamLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="flex flex-col justify-between">
              <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                <CardTitle>View your basic income stream</CardTitle>
                <ExternalLink
                  className="size-[18px] text-muted-foreground"
                  strokeWidth={1}
                />
              </CardHeader>
              <CardDescription className="px-6 pb-6 leading-relaxed">
                Check out your active basic income stream on Superfluid.
              </CardDescription>
            </Card>
          </a>
          {canUpgradeStream && (
            <Card
              onClick={handleCreateOrUpgradeDrachmaStream}
              className="mt-4 flex cursor-pointer flex-col justify-between"
            >
              <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                <CardTitle>Upgrade your basic income</CardTitle>
                <HandCoins
                  className="size-[18px] text-muted-foreground"
                  strokeWidth={1}
                />
              </CardHeader>
              <CardDescription className="px-6 pb-6 leading-relaxed">
                You're eligible for an increased basic income. Upgrade your
                stream now!
              </CardDescription>
            </Card>
          )}
        </>
      ) : (
        <>
          <Card
            onClick={handleCreateOrUpgradeDrachmaStream}
            className="flex cursor-pointer flex-col justify-between"
          >
            <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
              <CardTitle>Claim your basic income</CardTitle>
              <HandCoins
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            </CardHeader>
            <CardDescription className="px-6 pb-6 leading-relaxed">
              Set up your basic income stream and start receiving world drachma
              every second.
            </CardDescription>
          </Card>

          <a href={DEMO_STREAM_LINK} target="_blank" rel="noopener noreferrer">
            <Card className="flex flex-col justify-between">
              <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                <CardTitle>View demo stream</CardTitle>
                <ExternalLink
                  className="size-[18px] text-muted-foreground"
                  strokeWidth={1}
                />
              </CardHeader>
              <CardDescription className="px-6 pb-6 leading-relaxed">
                Never heard of money streaming? Check out a demo before setting
                up your own.
              </CardDescription>
            </Card>
          </a>
        </>
      )}

      <AlertDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to prove your personhood with at least one method to
              create a stream.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              className="w-40"
              onClick={() => setShowVerificationDialog(false)}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <AlertDialogDescription>
                {isBasicIncomeSetUp ? 'Upgrading' : 'Creating'} your basic
                income stream...
              </AlertDialogDescription>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{resultDialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {resultDialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter
                className={`flex w-full gap-2 ${isSuccess ? 'justify-between' : 'justify-center'}`}
              >
                <Button
                  onClick={() => {
                    setShowResultDialog(false);
                  }}
                  className="w-40"
                  variant={isSuccess ? 'outline' : 'default'}
                >
                  Close
                </Button>
                {isSuccess && (
                  <a
                    href={getUserStreamLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-40 sm:w-auto"
                  >
                    <Button className="w-40" disabled={isButtonDisabled}>
                      {isButtonDisabled
                        ? `View stream (${countdown}s)`
                        : 'View stream'}
                      {!isButtonDisabled && (
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </a>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};