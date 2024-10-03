import { Card, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const VerificationCardSkeleton = () => (
  <Card className="flex h-[144.75px] w-full flex-col justify-between">
    <div className="flex flex-col">
      <div className="flex flex-row justify-between space-y-0 px-6 pb-1 pt-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="ml-6 mt-1 h-4 w-40" />
    </div>
    <CardDescription className="px-6 pb-4 pt-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </CardDescription>
  </Card>
);
