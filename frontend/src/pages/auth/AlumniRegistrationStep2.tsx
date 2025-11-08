import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Briefcase, Building, GraduationCap, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const step2Schema = z.object({
  currentCompany: z.string().min(2, 'Company name is required'),
  currentPosition: z.string().min(2, 'Position is required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  industry: z.string().min(2, 'Industry is required'),
  university: z.string().min(2, 'University name is required'),
  degree: z.string().min(2, 'Degree is required'),
  graduationYear: z.string().regex(/^\d{4}$/, 'Invalid year format'),
});

type Step2FormData = z.infer<typeof step2Schema>;

interface AlumniRegistrationStep2Props {
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
  initialData?: Partial<Step2FormData>;
}

export const AlumniRegistrationStep2 = ({ onNext, onBack, initialData }: AlumniRegistrationStep2Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData,
  });

  const onSubmit = (data: Step2FormData) => {
    toast.success('Professional information saved!');
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
          <h1 className="text-3xl font-bold mb-2">Professional Information</h1>
          <p className="text-muted-foreground">Step 2 of 3: Tell us about your career</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-8 rounded-2xl space-y-6">
          {/* Current Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Company</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('currentCompany')}
                  type="text"
                  placeholder="Google"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {errors.currentCompany && (
                <p className="text-red-500 text-sm mt-1">{errors.currentCompany.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Position</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('currentPosition')}
                  type="text"
                  placeholder="Senior Software Engineer"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {errors.currentPosition && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPosition.message}</p>
              )}
            </div>
          </div>

          {/* Years of Experience & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...register('yearsOfExperience')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>
              {errors.yearsOfExperience && (
                <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...register('industry')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Education</h3>
            
            <div className="space-y-4">
              {/* University */}
              <div>
                <label className="block text-sm font-medium mb-2">University/College</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              {/* Degree & Graduation Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Degree</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      {...register('degree')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                    >
                      <option value="">Select degree</option>
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
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('graduationYear')}
                      type="text"
                      placeholder="2015"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationYear.message}</p>
                  )}
                </div>
              </div>
            </div>
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
