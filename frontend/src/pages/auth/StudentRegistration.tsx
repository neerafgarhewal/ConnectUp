import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentRegistrationStep1 } from './StudentRegistrationStep1';
import { StudentRegistrationStep2 } from './StudentRegistrationStep2';
import { StudentRegistrationStep3 } from './StudentRegistrationStep3';
import toast, { Toaster } from 'react-hot-toast';
import { studentAPI } from '../../services/api';

export const StudentRegistration = () => {
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
      console.log('Sending registration data:', dataToSend);
      
      // Send data to backend
      const response = await studentAPI.register(dataToSend);
      console.log('Registration response:', response);
      
      toast.success('Registration completed successfully! Redirecting to your profile...');
      
      // Redirect to profile after a delay
      setTimeout(() => {
        navigate('/dashboard/my-profile');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error codes
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;
      
      if (errorCode === 'DB_NOT_CONNECTED' || errorCode === 'DB_ERROR') {
        toast.error(
          '⚠️ Database connection unavailable. Please check MONGODB_SETUP.md for solutions.',
          { duration: 6000 }
        );
      } else if (errorCode === 'DUPLICATE_EMAIL') {
        toast.error('This email is already registered. Please use a different email.');
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else if (error.message?.includes('timeout')) {
        toast.error('Connection timeout. Please check your internet and database connection.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
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
        <StudentRegistrationStep1
          onNext={handleStep1Complete}
          initialData={formData}
        />
      )}
      {currentStep === 2 && (
        <StudentRegistrationStep2
          onNext={handleStep2Complete}
          onBack={handleBack}
          initialData={formData}
        />
      )}
      {currentStep === 3 && (
        <StudentRegistrationStep3
          onComplete={handleStep3Complete}
          onBack={handleBack}
          initialData={formData}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
