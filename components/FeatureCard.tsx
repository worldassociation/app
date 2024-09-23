import { ReactNode } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  buttonLink: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  buttonText,
  buttonLink
}: FeatureCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardDescription className="px-6 pb-4 leading-relaxed">
        {description}
      </CardDescription>
      <CardFooter>
        <a href={buttonLink} target="_blank" rel="noopener noreferrer">
          <Button>
            {buttonText}
            <ArrowUpRight className="ml-1 size-3" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
