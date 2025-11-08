import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlumniRegistrationStep1 } from './AlumniRegistrationStep1';
import { AlumniRegistrationStep2 } from './AlumniRegistrationStep2';
import { AlumniRegistrationStep3 } from './AlumniRegistrationStep3';
import toast, { Toaster } from 'react-hot-toast';
import { alumniAPI } from '../../services/api';

export const AlumniRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStep1Complete = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Complete = async (data: any) => {
    const completeData = { ...formData, ...data };
    
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...dataToSend } = completeData;
    
    try {
      setIsLoading(true);
      console.log('Sending alumni registration data:', dataToSend);
      
      // Send data to backend
      const response = await alumniAPI.register(dataToSend);
      console.log('Alumni registration response:', response);
      
      toast.success('Registration completed successfully! Redirecting to your dashboard...');
      
      // Redirect to alumni dashboard after a delay
      setTimeout(() => {
        navigate('/alumni-dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Alumni registration error:', error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <>
      <Toaster position="top-right" />
      {currentStep === 1 && (
        <AlumniRegistrationStep1
          onNext={handleStep1Complete}
          initialData={formData}
        />
      )}
      {currentStep === 2 && (
        <AlumniRegistrationStep2
          onNext={handleStep2Complete}
          onBack={handleBack}
          initialData={formData}
        />
      )}
      {currentStep === 3 && (
        <AlumniRegistrationStep3
          onComplete={handleStep3Complete}
          onBack={handleBack}
          initialData={formData}
        />
      )}
    </>
  );
};
