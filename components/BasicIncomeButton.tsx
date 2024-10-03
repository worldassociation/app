'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Button } from './ui/button';
import {
  CFA_V1_FORWARDER_ABI,
  CFA_V1_FORWARDER_ADDRESS,
  DRACHMA_CONTRACT_ADDRESS,
  FLOW_RATE,
  GLOBAL_VOTER_ID_ZKME_ADDRESS
} from 'lib/constants';
import { ZkMeWidget } from '@zkmelabs/widget';
import {
  createTestDrachmaStream,
  getZkMeToken,
  mintGlobalVoterIdZkMe
} from 'lib/actions';
import { STREAM_LINK_TEMPLATE } from 'lib/links';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

const BasicIncomeButton = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    token: GLOBAL_VOTER_ID_ZKME_ADDRESS
  });

  const [isBasicIncomeSetUp, setIsBasicIncomeSetUp] = useState(false);
  const { data: flowrateData, refetch } = useReadContract({
    address: CFA_V1_FORWARDER_ADDRESS,
    abi: CFA_V1_FORWARDER_ABI,
    functionName: 'getAccountFlowrate',
    args: [DRACHMA_CONTRACT_ADDRESS, address as `0x${string}`]
  });

  const [widget, setWidget] = useState<ZkMeWidget | null>(null);

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogContent, setResultDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (flowrateData !== undefined) {
      setIsBasicIncomeSetUp(BigInt(flowrateData) > BigInt(0));
    }
  }, [flowrateData]);

  useEffect(() => {
    const initializeWidget = async () => {
      if (!address) {
        setWidget(null);
        return;
      }

      const accessToken = await getZkMeToken();

      try {
        const newProvider = {
          async getAccessToken() {
            return accessToken;
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
      } catch (error) {
        setWidget(null);
      }
    };

    initializeWidget();
  }, [address]);

  const handleLaunchWidget = () => {
    if (widget) {
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          await handleCreateDrachmaStream();
          await handleMintGlobalVoterIdZkMe();
        }
      });
    }
  };

  const handleCreateDrachmaStream = async () => {
    if (!address) {
      return;
    }

    setIsProcessing(true);
    setShowResultDialog(true);

    const newFlowRate = BigInt(FLOW_RATE);

    try {
      await createTestDrachmaStream(address || '', newFlowRate); // Ensure address is a string
      setResultDialogContent({
        title: 'Stream created',
        description: 'Your basic income stream has been successfully created.'
      });
      setIsBasicIncomeSetUp(true);
      refetch();
      setIsSuccess(true);
      setIsButtonDisabled(true);
      setCountdown(8);
    } catch (error) {
      setResultDialogContent({
        title: 'Error',
        description: 'Failed to create basic income stream. Please try again.'
      });
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintGlobalVoterIdZkMe = async () => {
    if (!address || (balanceData && balanceData.value > BigInt(0))) {
      return;
    }

    try {
      await mintGlobalVoterIdZkMe(address);
    } catch (error) {
      console.error('Error minting voter ID:', error);
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
    if (!address) return '';
    return STREAM_LINK_TEMPLATE.replace(/address/g, address);
  };

  return (
    <>
      {!address ? (
        <ConnectWallet
          className="h-10 min-w-0 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
          text="Sign up to claim"
        />
      ) : isBasicIncomeSetUp ? (
        <a href={getUserStreamLink()} target="_blank" rel="noopener noreferrer">
          <Button>Check your basic income</Button>
        </a>
      ) : (
        <Button onClick={handleLaunchWidget}>Claim your basic income</Button>
      )}

      <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <AlertDialogDescription>
                Creating your basic income stream...
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

export default BasicIncomeButton;
