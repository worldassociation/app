import { DialogHeader, DialogTitle } from '../ui/dialog';
import { StepIndicator } from '../StepIndicator';

interface ModalHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  currentStep,
  totalSteps
}) => {
  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Overview';
      case 2:
        return 'Get a voter ID';
      case 3:
        return 'Set up basic income';
      case 4:
        return 'Unlock access';
      default:
        return 'Get started';
    }
  };

  return (
    <DialogHeader>
      <DialogTitle>{getTitle()}</DialogTitle>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
    </DialogHeader>
  );
};
