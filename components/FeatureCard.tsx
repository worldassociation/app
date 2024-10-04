import { ReactNode } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  buttonLink: string;
  outlinedButtonText?: string;
  outlinedButtonLink?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  buttonText,
  buttonLink,
  outlinedButtonText,
  outlinedButtonLink
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
      <CardFooter className="flex space-x-2">
        <a href={buttonLink} target="_blank" rel="noopener noreferrer">
          <Button>{buttonText}</Button>
        </a>
        {outlinedButtonText && outlinedButtonLink && (
          <a
            href={outlinedButtonLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">{outlinedButtonText}</Button>{' '}
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
