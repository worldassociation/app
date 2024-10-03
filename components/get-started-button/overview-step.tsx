import { DialogDescription } from '../ui/dialog';

export const OverviewStep = () => {
  const steps = [
    {
      title: 'Get a voter ID',
      description:
        'Create your voter ID by verifying your identity through facial scanning.'
    },
    {
      title: 'Set up basic income',
      description:
        'Claim your basic income and start receiving our official currency every second.'
    },
    {
      title: 'Unlock access',
      description: 'Get access to human-only communities and resources.'
    }
  ];

  return (
    <>
      <DialogDescription className="mb-4">
        Welcome to the World Association! Please follow these steps to get
        started.
      </DialogDescription>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-primary text-base text-primary-foreground">
                {index + 1}
              </div>
              {index < steps.length - 1 && <div className="h-12"></div>}
            </div>
            <div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
