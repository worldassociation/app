'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ArrowUpRight,
  ExternalLink,
  HandCoins,
  Loader2,
  ScanFace,
  UserRoundCheck
} from 'lucide-react';
import { DEMO_STREAM_LINK, STREAM_LINK_TEMPLATE } from '@/lib/links';
import { ZkMeWidget } from '@zkmelabs/widget';
import {
  createTestDrachmaStream,
  getZkMeToken,
  mintGlobalVoterIdZkMe
} from '@/lib/actions';
import '@zkmelabs/widget/dist/style.css';
import {
  CFA_V1_FORWARDER_ABI,
  CFA_V1_FORWARDER_ADDRESS,
  FLOW_RATE,
  DRACHMA_CONTRACT_ADDRESS,
  GLOBAL_VOTER_ID_ZKME_ADDRESS
} from '@/lib/constants';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { FeatureCard } from '@/components/FeatureCard';

const GetStartedPage: React.FC = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    token: GLOBAL_VOTER_ID_ZKME_ADDRESS
  });

  const [widget, setWidget] = useState<ZkMeWidget | null>(null);

  const [showIdDialog, setShowIdDialog] = useState(false);
  const [showStreamDialog, setShowStreamDialog] = useState(false);
  const [idDialogContent, setIdDialogContent] = useState({
    title: '',
    description: ''
  });
  const [streamDialogContent, setStreamDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const [isBasicIncomeSetUp, setIsBasicIncomeSetUp] = useState(false);
  const { data: flowrateData, refetch } = useReadContract({
    address: CFA_V1_FORWARDER_ADDRESS,
    abi: CFA_V1_FORWARDER_ABI,
    functionName: 'getAccountFlowrate',
    args: [DRACHMA_CONTRACT_ADDRESS, address as `0x${string}`]
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(8);

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

  const handleLaunchIdWidget = () => {
    if (widget) {
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          await handleMintGlobalVoterIdZkMe();
        }
      });
    }
  };

  const handleMintGlobalVoterIdZkMe = async () => {
    if (!address || (balanceData && balanceData.value > BigInt(0))) {
      return;
    }

    setIsProcessing(true);
    setShowIdDialog(true);

    try {
      await mintGlobalVoterIdZkMe(address);
      setIdDialogContent({
        title: 'Success',
        description: 'Your voter ID has been successfully created!'
      });
    } catch (error) {
      console.error('Error minting voter ID:', error);
      setIdDialogContent({
        title: 'Error',
        description: 'There was an error while creating your voter ID.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (flowrateData !== undefined) {
      setIsBasicIncomeSetUp(BigInt(flowrateData) > BigInt(0));
    }
  }, [flowrateData]);

  const handleLaunchStreamWidget = () => {
    if (widget) {
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          await handleCreateDrachmaStream();
        }
      });
    }
  };

  const handleCreateDrachmaStream = async () => {
    if (!address) {
      return;
    }

    setIsProcessing(true);
    setShowStreamDialog(true);

    const newFlowRate = BigInt(FLOW_RATE);

    try {
      await createTestDrachmaStream(address || '', newFlowRate); // Ensure address is a string
      setStreamDialogContent({
        title: 'Stream created',
        description: 'Your basic income stream has been successfully created.'
      });
      setIsBasicIncomeSetUp(true);
      refetch();
      setIsSuccess(true);
      setIsButtonDisabled(true);
      setCountdown(8);
    } catch (error) {
      setStreamDialogContent({
        title: 'Error',
        description: 'Failed to create basic income stream. Please try again.'
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
    if (!address) return '';
    return STREAM_LINK_TEMPLATE.replace(/address/g, address);
  };

  return (
    <main className="flex min-h-[calc(100dvh-160px)] flex-col items-center p-4 pb-8 md:min-h-[calc(100dvh-144px)] md:justify-center">
      <div className="flex max-w-5xl flex-col gap-6 max-md:max-w-md">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Get started</h2>
          <CardDescription>
            Join us and get your basic income simply by proving that you are a
            real and unique human.
          </CardDescription>
        </div>
        <div className="grid grid-cols-3 flex-col gap-6 max-md:flex">
          <>
            {/* ZkMe Verification Card */}
            <Card
              className={`flex flex-col justify-between ${balanceData && balanceData.value > BigInt(0) ? 'bg-muted' : ''}`}
            >
              <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                <CardTitle
                  className={
                    balanceData && balanceData.value > BigInt(0)
                      ? 'text-muted-foreground'
                      : ''
                  }
                >
                  {balanceData && balanceData.value > BigInt(0)
                    ? 'Voter ID created'
                    : 'Claim your voter ID'}
                </CardTitle>
                {balanceData && balanceData.value > BigInt(0) ? (
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
              <CardDescription className="px-6 leading-relaxed">
                {balanceData && balanceData.value > BigInt(0)
                  ? 'You successfully created your Global Voter ID.'
                  : 'Create your Global Voter ID by verifying your identity through facial scanning.'}
              </CardDescription>
              <CardFooter>
                {!address ? (
                  <ConnectWallet
                    className="mt-4 h-10 min-w-0 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                    text="Sign up to claim"
                  />
                ) : (
                  balanceData &&
                  balanceData.value === BigInt(0) && (
                    <Button className="mt-4" onClick={handleLaunchIdWidget}>
                      Claim your voter ID
                    </Button>
                  )
                )}
              </CardFooter>
            </Card>

            {/* Basic Income Card */}
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
                      Check out your basic income stream on Superfluid.
                    </CardDescription>
                  </Card>
                </a>
              </>
            ) : (
              <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                  <CardTitle>Set up basic income</CardTitle>
                  <HandCoins
                    className="size-[18px] text-muted-foreground"
                    strokeWidth={1}
                  />
                </CardHeader>
                <CardDescription className="px-6 pb-4 leading-relaxed">
                  {isBasicIncomeSetUp
                    ? 'Your basic income stream is active. World drachma flows into your account every second.'
                    : 'Claim your basic income and start receiving our official currency every second.'}
                </CardDescription>
                <CardFooter>
                  {!address ? (
                    <ConnectWallet
                      className="h-10 min-w-0 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                      text="Sign up to claim"
                    />
                  ) : (
                    <Button onClick={handleLaunchStreamWidget}>
                      Claim your basic income
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}

            {/* Demo Stream Card */}
            {!isBasicIncomeSetUp && (
              <FeatureCard
                title="View demo stream"
                description="Never heard of money streaming? Check out a demo before setting
                up your own."
                icon={
                  <ExternalLink
                    className="size-[18px] text-muted-foreground"
                    strokeWidth={1}
                  />
                }
                buttonText="Demo stream"
                buttonLink={DEMO_STREAM_LINK}
              />
            )}
          </>
        </div>
      </div>

      <AlertDialog open={showIdDialog} onOpenChange={setShowIdDialog}>
        <AlertDialogContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <AlertDialogDescription>
                Creating voter ID...
              </AlertDialogDescription>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{idDialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {idDialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex w-full justify-between gap-2">
                <Button
                  onClick={() => {
                    setShowIdDialog(false);
                  }}
                  className="w-40"
                  variant="outline"
                >
                  Close
                </Button>
                <a
                  href="https://snapshot.org/#/worldassociation.eth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-40 sm:w-auto"
                >
                  <Button className="w-40">
                    View proposals
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </a>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStreamDialog} onOpenChange={setShowStreamDialog}>
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
                <AlertDialogTitle>{streamDialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {streamDialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter
                className={`flex w-full gap-2 ${isSuccess ? 'justify-between' : 'justify-center'}`}
              >
                <Button
                  onClick={() => {
                    setShowStreamDialog(false);
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
    </main>
  );
};

export default GetStartedPage;
