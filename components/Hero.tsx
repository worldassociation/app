import { CardDescription } from './ui/card';

export default function Hero() {
  return (
    <>
      <h1 className="text-center text-[32px] font-extrabold leading-tight md:text-5xl">
        World Association
      </h1>
      <CardDescription className="mx-auto py-6 text-center text-[15px]">
        Democratizing global governance.
      </CardDescription>
    </>
  );
}
