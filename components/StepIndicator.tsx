import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="flex justify-center space-x-2">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-1 w-8 rounded-full ${
            index < currentStep ? 'bg-primary' : 'bg-secondary'
          }`}
        />
      ))}
    </div>
  );
};
