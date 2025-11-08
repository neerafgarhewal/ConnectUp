import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { GraduationCap, Building, BookOpen, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const step2Schema = z.object({
  university: z.string().min(2, 'University name is required'),
  degree: z.string().min(2, 'Degree is required'),
  branch: z.string().min(2, 'Branch/Major is required'),
  year: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate']),
  expectedGraduation: z.string().min(4, 'Expected graduation year is required'),
  cgpa: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid CGPA format'),
});

type Step2FormData = z.infer<typeof step2Schema>;

interface StudentRegistrationStep2Props {
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
  initialData?: Partial<Step2FormData>;
}

export const StudentRegistrationStep2 = ({ onNext, onBack, initialData }: StudentRegistrationStep2Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData,
  });

  const onSubmit = (data: Step2FormData) => {
    toast.success('Academic information saved!');
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Academic Information</h1>
          <p className="text-muted-foreground">Step 2 of 3: Tell us about your education</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-8 rounded-2xl space-y-6">
          {/* University */}
          <div>
            <label className="block text-sm font-medium mb-2">University/College</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                {...register('university')}
                type="text"
                placeholder="IIT Ropar"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">{errors.university.message}</p>
            )}
          </div>

          {/* Degree and Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...register('degree')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select Degree</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E">B.E</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="MBA">MBA</option>
                  <option value="Ph.D">Ph.D</option>
                </select>
              </div>
              {errors.degree && (
                <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Branch/Major</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('branch')}
                  type="text"
                  placeholder="Computer Science"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {errors.branch && (
                <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>
              )}
            </div>
          </div>

          {/* Year and Expected Graduation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Year</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...register('year')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Graduation</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('expectedGraduation')}
                  type="text"
                  placeholder="2026"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {errors.expectedGraduation && (
                <p className="text-red-500 text-sm mt-1">{errors.expectedGraduation.message}</p>
              )}
            </div>
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-sm font-medium mb-2">CGPA/Percentage</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                {...register('cgpa')}
                type="text"
                placeholder="8.5"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            {errors.cgpa && (
              <p className="text-red-500 text-sm mt-1">{errors.cgpa.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Enter CGPA out of 10 or percentage</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-foreground/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
