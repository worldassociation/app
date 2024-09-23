import { DialogDescription } from '../ui/dialog';

export const OverviewStep = () => {
  const steps = [
    {
      title: 'Prove your personhood',
      description:
        'Join us simply by proving that you are a real and unique human.'
    },
    {
      title: 'Set up basic income',
      description:
        'Claim your basic income and start receiving world drachma every second.'
    },
    {
      title: 'Unlock access',
      description: 'Gain access to exclusive communities and resources.'
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="mt-1 h-12 w-px bg-primary"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
