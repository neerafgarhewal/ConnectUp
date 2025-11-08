import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, ArrowLeft, Check, Users, Clock } from 'lucide-react';

const step3Schema = z.object({
  mentorshipAreas: z.array(z.string()).min(1, 'Select at least one mentorship area'),
  availability: z.string().min(1, 'Please select your availability'),
  maxMentees: z.string().min(1, 'Please specify max mentees'),
  bio: z.string().min(100, 'Bio must be at least 100 characters').max(500, 'Bio must be less than 500 characters'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type Step3Data = z.infer<typeof step3Schema>;

const mentorshipOptions = [
  'Career Guidance',
  'Technical Skills',
  'Interview Preparation',
  'Resume Review',
  'Networking',
  'Leadership Development',
  'Entrepreneurship',
  'Work-Life Balance',
  'Industry Insights',
  'Project Guidance',
];

interface AlumniRegistrationStep3Props {
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
  initialData?: Partial<Step3Data>;
}

export const AlumniRegistrationStep3 = ({ onComplete, onBack, initialData }: AlumniRegistrationStep3Props) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData || { mentorshipAreas: [] },
  });

  const toggleArea = (area: string) => {
    const newAreas = selectedAreas.includes(area)
      ? selectedAreas.filter((a) => a !== area)
      : [...selectedAreas, area];
    setSelectedAreas(newAreas);
    form.setValue('mentorshipAreas', newAreas);
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
          <h1 className="text-3xl font-bold mb-2">Mentorship Preferences</h1>
          <p className="text-muted-foreground">Step 3 of 3: How you want to help</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onComplete)} className="glass p-8 rounded-2xl space-y-6">
          {/* Mentorship Areas */}
          <div>
            <label className="block text-sm font-medium mb-3">Mentorship Areas *</label>
            <div className="grid grid-cols-2 gap-3">
              {mentorshipOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArea(option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedAreas.includes(option)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {form.formState.errors.mentorshipAreas && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.mentorshipAreas.message}</p>
            )}
          </div>

          {/* Availability & Max Mentees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...form.register('availability')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select availability</option>
                  <option value="1-2 hours/week">1-2 hours/week</option>
                  <option value="3-5 hours/week">3-5 hours/week</option>
                  <option value="5-10 hours/week">5-10 hours/week</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              {form.formState.errors.availability && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.availability.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Mentees</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  {...form.register('maxMentees')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select max mentees</option>
                  <option value="1-2">1-2 mentees</option>
                  <option value="3-5">3-5 mentees</option>
                  <option value="6-10">6-10 mentees</option>
                  <option value="10+">10+ mentees</option>
                </select>
              </div>
              {form.formState.errors.maxMentees && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.maxMentees.message}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Mentor Bio * (100-500 characters)
            </label>
            <textarea
              {...form.register('bio')}
              rows={4}
              placeholder="Share your experience, what you can help with, and what motivates you to mentor students..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              {form.formState.errors.bio && (
                <p className="text-red-500 text-sm">{form.formState.errors.bio.message}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {form.watch('bio')?.length || 0}/500
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Professional Links</h3>
            
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm mb-2">LinkedIn</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...form.register('linkedinUrl')}
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {form.formState.errors.linkedinUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.linkedinUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm mb-2">GitHub (Optional)</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...form.register('githubUrl')}
                  type="url"
                  placeholder="https://github.com/yourusername"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {form.formState.errors.githubUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.githubUrl.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="portfolioUrl" className="block text-sm mb-2">Portfolio/Website (Optional)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...form.register('portfolioUrl')}
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
              {form.formState.errors.portfolioUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.portfolioUrl.message}</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 border border-border rounded-lg hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Complete Registration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
