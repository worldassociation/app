import { FeatureCard } from '@/components/FeatureCard';
import { DISCORD_LINK, GUILD_LINK, TELEGRAM_LINK } from '@/lib/links';
import { MessageCircle, Send, Castle } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <main className="flex min-h-[calc(100dvh-144px)] flex-col items-center p-4 pb-8 md:justify-center">
      <div className="flex max-w-5xl flex-col gap-6 max-md:max-w-md">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Community</h2>
          <p className="text-[13px] text-muted-foreground">
            Discover ways to engage with our community.
          </p>
        </div>
        <div className="grid grid-cols-3 flex-col gap-6 max-md:flex">
          <FeatureCard
            title="Discord"
            description="Join our Discord for real-time discussions, collaborations, and updates."
            icon={
              <MessageCircle
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="Open Discord"
            buttonLink={DISCORD_LINK}
          />
          <FeatureCard
            title="Telegram"
            description="Stay updated and connect with the community on Telegram."
            icon={
              <Send
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="Open Telegram"
            buttonLink={TELEGRAM_LINK}
          />
          <FeatureCard
            title="Guild"
            description="Get access to special Discord roles, human-only Telegram groups, and more."
            icon={
              <Castle
                className="size-[18px] text-muted-foreground"
                strokeWidth={1}
              />
            }
            buttonText="Visit our Guild"
            buttonLink={GUILD_LINK}
          />
        </div>
      </div>
    </main>
  );
};

export default CommunityPage;
