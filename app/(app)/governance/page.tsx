import { FeatureCard } from '@/components/FeatureCard';
import { Scroll, Vote, ClipboardPenLine } from 'lucide-react';

const GovernancePage: React.FC = () => {
  return (
    <main className="flex min-h-[calc(100dvh-124px)] flex-col items-center p-4 pb-8 md:min-h-[calc(100dvh-108px)] md:justify-center">
      <div className="flex max-w-5xl flex-col gap-6 max-md:max-w-md">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Governance</h2>
          <p className="text-[13px] text-muted-foreground">
            Learn more about our decision-making processes.
          </p>
        </div>
        <div className="grid grid-cols-3 flex-col gap-6 max-md:flex">
          <FeatureCard
            title="Constitution"
            description="Review our constitution and contribute to its ongoing evolution."
            icon={
              <Scroll
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="View on Github"
            buttonLink="https://github.com/blaisekonya/constitution/blob/main/constitution.md"
          />
          <FeatureCard
            title="World Polls"
            description="Experiment with global democracy by creating and voting in global polls."
            icon={
              <Vote
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="View polls"
            buttonLink="https://snapshot.org/#/polls.worldassociation.eth"
          />
          <FeatureCard
            title="World Petitions"
            description="Create and sign anonymous yet verifiably democratic global petitions."
            icon={
              <ClipboardPenLine
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="View petitions"
            buttonLink="https://snapshot.org/#/petitions.worldassociation.eth"
          />
        </div>
      </div>
    </main>
  );
};

export default GovernancePage;
