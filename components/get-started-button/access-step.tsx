import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DialogDescription } from '../ui/dialog';
import { Castle } from 'lucide-react';
import { GUILD_LINK } from '@/lib/links';

export const AccessStep = () => {
  return (
    <>
      <DialogDescription>
        Get access to special Discord roles, private Telegram groups, and more.
      </DialogDescription>

      <a href={GUILD_LINK} target="_blank" rel="noopener noreferrer">
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
            <CardTitle>Visit our Guild</CardTitle>
            <Castle
              className="size-[18px] text-muted-foreground"
              strokeWidth={1}
            />
          </CardHeader>
          <CardDescription className="px-6 pb-6 leading-relaxed">
            Get access to special Discord roles, private Telegram groups, and
            more.
          </CardDescription>
        </Card>
      </a>
    </>
  );
};
