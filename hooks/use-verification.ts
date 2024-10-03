import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { GLOBAL_VOTER_ID_ZKME_ADDRESS } from '@/lib/constants';
import { mintGlobalVoterIdZkMe } from '@/lib/actions';
import { verifyMeidWithZkMeServices } from '@zkmelabs/widget';

export const useVerification = () => {
  const { address: activeAddress } = useAccount();
  const [isZkMeVerified, setIsZkMeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: activeAddress,
    token: GLOBAL_VOTER_ID_ZKME_ADDRESS
  });

  useEffect(() => {
    const checkVerifications = async () => {
      if (!activeAddress) {
        setIsZkMeVerified(false);
        setIsLoading(false);
        return;
      }

      try {
        const { isGrant } = await verifyMeidWithZkMeServices(
          'M2024053066119595336406774111128',
          activeAddress
        );
        setIsZkMeVerified(isGrant);

        if (isGrant && balanceData && balanceData.value === BigInt(0)) {
          await mintGlobalVoterIdZkMe(activeAddress as string);
          console.log('Global Voter ID minted successfully');
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
    isLoading,
    balanceData,
    isBalanceLoading,
    setIsZkMeVerified
  };
};
