'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';
import { ModalHeader } from './modal-header';
import { OverviewStep } from './overview-step';
import { VerificationStep } from './verification-step';
import { BasicIncomeStep } from './basic-income-step';
import { AccessStep } from './access-step';
import {
  CFA_V1_FORWARDER_ABI,
  CFA_V1_FORWARDER_ADDRESS,
  TEST_DRACHMA_CONTRACT_ADDRESS
} from '@/lib/constants';
import { useVerification } from '@/hooks/use-verification';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

const GetStartedButton = () => {
  const { address: activeAddress } = useAccount();
  const { isZkMeVerified, isCoinbaseVerified, isLoading, balanceData } =
    useVerification();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isBasicIncomeSetUp, setIsBasicIncomeSetUp] = useState(false);
  const returnStepRef = useRef(1);

  const handleOpenDialog = useCallback((step?: number) => {
    if (step) {
      returnStepRef.current = step;
    } else {
      returnStepRef.current = 1;
    }
    setIsDialogOpen(true);
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      setCurrentStep(returnStepRef.current);
    }
  }, [isDialogOpen]);

  const { data: flowrateData, refetch } = useReadContract({
    address: CFA_V1_FORWARDER_ADDRESS,
    abi: CFA_V1_FORWARDER_ABI,
    functionName: 'getAccountFlowrate',
    args: [TEST_DRACHMA_CONTRACT_ADDRESS, activeAddress as `0x${string}`]
  });

  useEffect(() => {
    if (flowrateData !== undefined) {
      setIsBasicIncomeSetUp(BigInt(flowrateData) > BigInt(0));
    }
  }, [flowrateData]);

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handlePreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderFooter = () => {
    switch (currentStep) {
      case 1:
        return (
          <DialogFooter className="w-full justify-center">
            {!activeAddress ? (
              <ConnectWallet
                className="h-10 w-[calc(100dvw-48px)] min-w-0 max-w-[398px] rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                text="Sign in"
              />
            ) : (
              <Button onClick={handleNextStep} className="w-full">
                Start verification
              </Button>
            )}
          </DialogFooter>
        );
      case 2:
      case 3:
        return (
          <DialogFooter className="w-full justify-between">
            <Button
              className="w-full"
              variant="outline"
              onClick={handlePreviousStep}
            >
              Back
            </Button>
            <Button className="w-full" onClick={handleNextStep}>
              Next
            </Button>
          </DialogFooter>
        );
      case 4:
        return (
          <DialogFooter className="w-full justify-between">
            <Button
              className="w-full"
              variant="outline"
              onClick={handlePreviousStep}
            >
              Back
            </Button>
            <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
              Finish
            </Button>
          </DialogFooter>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button className="w-full max-w-56" onClick={() => handleOpenDialog()}>
        Get started
      </Button>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            handleOpenDialog();
          } else {
            setIsDialogOpen(false);
          }
        }}
      >
        <DialogContent className="flex min-h-[100dvh] flex-col justify-between sm:min-h-0">
          <div className="flex flex-col gap-4">
            <ModalHeader currentStep={currentStep} totalSteps={4} />
            {currentStep === 1 && <OverviewStep />}
            {currentStep === 2 && (
              <VerificationStep
                onNext={handleNextStep}
                verificationData={{
                  isZkMeVerified,
                  isCoinbaseVerified,
                  isLoading,
                  balanceData: balanceData ?? {
                    decimals: 0,
                    formatted: '0',
                    symbol: '',
                    value: BigInt(0)
                  }
                }}
                onVerificationChange={(zkMe, coinbase) => {
                  console.log('Verification status changed:', {
                    zkMe,
                    coinbase
                  });
                }}
                setIsDialogOpen={setIsDialogOpen}
                handleOpenDialog={handleOpenDialog}
              />
            )}
            {currentStep === 3 && (
              <BasicIncomeStep
                isBasicIncomeSetUp={isBasicIncomeSetUp}
                setIsBasicIncomeSetUp={setIsBasicIncomeSetUp}
                refetchFlowrate={refetch}
                isZkMeVerified={isZkMeVerified}
                isCoinbaseVerified={isCoinbaseVerified}
                flowrateData={flowrateData ?? null}
              />
            )}
            {currentStep === 4 && <AccessStep />}
          </div>
          {renderFooter()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GetStartedButton;
