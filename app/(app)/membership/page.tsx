'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useVerification } from '@/hooks/use-verification';
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
  HandCoins,
  Loader2,
  UserRoundCheck,
  UserRoundPlus
} from 'lucide-react';
import { DEMO_STREAM_LINK } from '@/lib/links';
import { ZkMeWidget } from '@zkmelabs/widget';
import { createTestDrachmaStream, mintMembershipZkMe } from '@/lib/actions';
import '@zkmelabs/widget/dist/style.css';
import {
  CFA_V1_FORWARDER_ABI,
  CFA_V1_FORWARDER_ADDRESS,
  FLOW_RATE,
  TEST_DRACHMA_CONTRACT_ADDRESS
} from '@/lib/constants';
import { MembershipCardSkeleton } from '@/components/MembershipCardSkeleton';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

const MembershipPage: React.FC = () => {
  const { address: activeAddress } = useAccount();
  const {
    isZkMeVerified,
    isCoinbaseVerified,
    isLoading,
    setIsZkMeVerified,
    balanceData
  } = useVerification();
  const [widget, setWidget] = useState<ZkMeWidget | null>(null);
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [mintDialogContent, setMintDialogContent] = useState({
    title: '',
    description: ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [isBasicIncomeSetUp, setIsBasicIncomeSetUp] = useState(false);

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

  const canUpgradeStream =
    isBasicIncomeSetUp &&
    BigInt(flowrateData || 0) === BigInt(FLOW_RATE) &&
    isZkMeVerified &&
    isCoinbaseVerified;

  const handleCreateOrUpgradeDrachmaStream = async () => {
    if (!activeAddress) return;

    const newFlowRate =
      isZkMeVerified && isCoinbaseVerified
        ? BigInt(FLOW_RATE) * BigInt(2)
        : BigInt(FLOW_RATE);

    try {
      await createTestDrachmaStream(activeAddress, newFlowRate);
      setIsBasicIncomeSetUp(true);
      await refetch();
    } catch (error) {
      console.error('Error creating/upgrading drachma stream:', error);
    }
  };

  const getUserStreamLink = () => {
    if (!activeAddress) return DEMO_STREAM_LINK;
    return DEMO_STREAM_LINK.replace(
      /0x30deD934aac8bb469997AeC40854E38ecd9dC99A/g,
      activeAddress
    );
  };

  useEffect(() => {
    const initializeWidget = async () => {
      if (!activeAddress) {
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
          return [activeAddress];
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
  }, [activeAddress]);

  const handleLaunchWidget = () => {
    if (widget) {
      widget.launch();
      widget.on('meidFinished', async (results) => {
        if (results.isGrant) {
          setIsZkMeVerified(true);
          await handleMintMembershipZkMe();
        }
      });
    }
  };

  const handleMintMembershipZkMe = async () => {
    if (!activeAddress || (balanceData && balanceData.value > BigInt(0))) {
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
      await mintMembershipZkMe(activeAddress);
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
    <main className="flex min-h-[calc(100dvh-124px)] flex-col items-center p-4 pb-8 md:justify-center">
      <div className="flex max-w-5xl flex-col gap-6 max-md:max-w-md">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Membership</h2>
          <CardDescription>
            Join us and get your basic income simply by proving that you are a
            real and unique human.
          </CardDescription>
        </div>
        <div className="grid grid-cols-3 flex-col gap-6 max-md:flex">
          {activeAddress && isLoading ? (
            <>
              <MembershipCardSkeleton />
              <MembershipCardSkeleton />
              <MembershipCardSkeleton />
            </>
          ) : (
            <>
              {/* ZkMe Verification Card */}
              <Card
                className={`flex flex-col justify-between ${isZkMeVerified ? 'bg-muted' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between space-y-0 px-6 pb-1 pt-6">
                    <CardTitle
                      className={isZkMeVerified ? 'text-muted-foreground' : ''}
                    >
                      {isZkMeVerified
                        ? 'Verified with zkMe'
                        : 'Verify with zkMe'}
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
                  <p className="pb-4 pl-6 text-xs text-muted-foreground">
                    {isZkMeVerified
                      ? '0.5 world drachma per day'
                      : '+0.5 world drachma per day'}
                  </p>
                </div>
                <CardDescription className="px-6 pb-4 leading-relaxed">
                  {isZkMeVerified
                    ? 'You already completed the face verification process.'
                    : 'Prove your personhood through a fully encrypted face verification process.'}
                </CardDescription>
                <CardFooter>
                  {activeAddress ? (
                    <Button
                      onClick={isZkMeVerified ? undefined : handleLaunchWidget}
                      disabled={isZkMeVerified}
                    >
                      {isZkMeVerified ? 'Verified' : 'Verify now'}
                    </Button>
                  ) : (
                    <ConnectWallet
                      className="h-10 min-w-0 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                      text="Verfiy now"
                    />
                  )}
                </CardFooter>
              </Card>

              {/* Coinbase Verification Card */}
              <Card
                className={`flex flex-col justify-between ${isCoinbaseVerified ? 'bg-muted' : ''}`}
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
                  <p className="pb-4 pl-6 text-xs text-muted-foreground">
                    {isCoinbaseVerified
                      ? '0.5 world drachma per day'
                      : '+0.5 world drachma per day'}
                  </p>
                </div>
                <CardDescription className="px-6 pb-4 leading-relaxed">
                  {isCoinbaseVerified
                    ? 'You already verified that you have a valid trading account.'
                    : 'Coinbase Verifications privately attest that you have a valid trading account and you live in a particular country.'}
                </CardDescription>
                <CardFooter>
                  {isCoinbaseVerified ? (
                    <Button disabled>Verified</Button>
                  ) : (
                    <a
                      href="https://www.coinbase.com/onchain-verify"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        Get verified
                        <ArrowUpRight className="ml-1 size-3" />
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>

              {/* Basic Income Card */}
              <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
                  <CardTitle>Basic income</CardTitle>
                  <HandCoins
                    className="size-[18px] text-muted-foreground"
                    strokeWidth={1}
                  />
                </CardHeader>
                <CardDescription className="px-6 pb-4 leading-relaxed">
                  {!isZkMeVerified && !isCoinbaseVerified
                    ? 'Join us and get our official currency, the world drachma, flow into your account every second.'
                    : !isBasicIncomeSetUp
                      ? 'Create your basic income stream to start receiving world drachma every second.'
                      : canUpgradeStream
                        ? "You're eligible for an increased basic income. Upgrade your stream now!"
                        : 'Your basic income stream is active. World drachma flows into your account every second.'}
                </CardDescription>
                <CardFooter>
                  {!isZkMeVerified && !isCoinbaseVerified ? (
                    <a
                      href={DEMO_STREAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        View demo stream
                        <ArrowUpRight className="ml-1 size-3" />
                      </Button>
                    </a>
                  ) : !isBasicIncomeSetUp ? (
                    <Button onClick={handleCreateOrUpgradeDrachmaStream}>
                      Create your stream
                    </Button>
                  ) : canUpgradeStream ? (
                    <Button onClick={handleCreateOrUpgradeDrachmaStream}>
                      Upgrade your stream
                    </Button>
                  ) : (
                    <a
                      href={getUserStreamLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        View your stream
                        <ArrowUpRight className="ml-1 size-3" />
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </div>

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
                  onClick={() => {
                    setShowMintDialog(false);
                  }}
                >
                  Close
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default MembershipPage;
