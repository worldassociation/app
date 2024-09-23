import { CardDescription } from './ui/card';

export default function Hero() {
  return (
    <>
      <h1 className="text-center text-[32px] font-extrabold leading-tight md:text-5xl">
        The democratic United Nations alternative
      </h1>
      <CardDescription className="mx-auto py-6 text-center text-[14px]">
        Join anonymously, get your basic income, and shape the future of global
        governance.
      </CardDescription>
    </>
  );
}
