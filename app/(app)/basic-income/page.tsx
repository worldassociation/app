import BasicIncomeButton from 'components/BasicIncomeButton';

function BasicIncomePage() {
  return (
    <div className="flex h-full min-h-[calc(100dvh-160px)] w-[100dvw] flex-col items-center justify-center p-4 md:min-h-[calc(100dvh-144px)] xl:w-[80rem]">
      <h1 className="text-center text-[32px] font-extrabold leading-tight md:text-5xl">
        Global Basic Income
      </h1>
      <p className="mx-auto py-6 text-center text-[15px] text-muted-foreground">
        Get money for being human.
      </p>
      <BasicIncomeButton />
    </div>
  );
}

export default BasicIncomePage;
