import { Card, CardDescription, CardFooter } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const MembershipCardSkeleton = () => (
  <Card className="flex h-[203.38px] flex-col justify-between sm:w-[325.34px]">
    <div className="flex flex-col pb-3">
      <div className="flex flex-row justify-between space-y-0 px-6 pb-1 pt-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[18px] w-[18px] rounded-full" />
      </div>
      <Skeleton className="ml-6 mt-0.5 h-2 w-32" />
    </div>
    <div className="px-6 pb-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
    <div className="px-6 pb-6">
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  </Card>
);
