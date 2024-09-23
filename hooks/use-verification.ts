import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { WORLD_ASSOCIATION_MEMBERSHIP_ZKME_ADDRESS } from '@/lib/constants';
import { mintMembershipZkMe } from '@/lib/actions';

export const useVerification = () => {
  const { address: activeAddress } = useAccount();
  const [isZkMeVerified, setIsZkMeVerified] = useState(false);
  const [isCoinbaseVerified, setIsCoinbaseVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: activeAddress,
    token: WORLD_ASSOCIATION_MEMBERSHIP_ZKME_ADDRESS
  });

  useEffect(() => {
    const checkVerifications = async () => {
      if (!activeAddress) {
        setIsZkMeVerified(false);
        setIsCoinbaseVerified(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/verify?address=${activeAddress}`);
        const data = await response.json();

        setIsZkMeVerified(data.isZkMeVerified);
        setIsCoinbaseVerified(data.isCoinbaseVerified);

        if (
          data.isZkMeVerified &&
          balanceData &&
          balanceData.value === BigInt(0)
        ) {
          await mintMembershipZkMe(activeAddress as string);
          console.log('Membership SBT minted successfully');
        }
      } catch (error) {
        console.error('Error during verification process:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerifications();
  }, [activeAddress, balanceData]);

  return {
    isZkMeVerified,
    isCoinbaseVerified,
    isLoading,
    balanceData,
    isBalanceLoading,
    setIsZkMeVerified
  };
};
