import ClaimButton from 'components/ClaimButton';

function VoterIDPage() {
  return (
    <div className="flex h-full min-h-[calc(100dvh-124px)] w-[100dvw] flex-col items-center justify-center p-4 md:min-h-[calc(100dvh-108px)] xl:w-[80rem]">
      <h1 className="text-center text-[32px] font-extrabold leading-tight md:text-5xl">
        Global Voter ID
      </h1>
      <p className="mx-auto py-6 text-center text-[15px] text-muted-foreground">
        Participate in global democracy.
      </p>
      <ClaimButton />
    </div>
  );
}

export default VoterIDPage;
