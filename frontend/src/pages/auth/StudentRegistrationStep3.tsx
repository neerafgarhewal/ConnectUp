import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, ArrowLeft, Check, X } from 'lucide-react';

const step3Schema = z.object({
  careerInterests: z.array(z.string()).min(1, 'Select at least one interest'),
  targetCompanies: z.array(z.string()).optional(),
  targetIndustries: z.array(z.string()).optional(),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must be less than 500 characters'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type Step3Data = z.infer<typeof step3Schema>;

const careerOptions = [
  'Software Development',
  'Data Science',
  'Product Management',
  'UI/UX Design',
  'DevOps',
  'Cybersecurity',
  'Machine Learning',
  'Cloud Computing',
  'Mobile Development',
  'Full Stack Development',
];

interface Step3Props {
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
  initialData?: Partial<Step3Data>;
  isLoading?: boolean;
}

export const StudentRegistrationStep3 = ({ onComplete, onBack, initialData, isLoading }: Step3Props) => {
  const [companyInput, setCompanyInput] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData || { careerInterests: [], targetCompanies: [], targetIndustries: [] },
  });

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      const newCompanies = [...companies, companyInput.trim()];
      setCompanies(newCompanies);
      form.setValue('targetCompanies', newCompanies);
      setCompanyInput('');
    }
  };

  const removeCompany = (company: string) => {
    const newCompanies = companies.filter((c) => c !== company);
    setCompanies(newCompanies);
    form.setValue('targetCompanies', newCompanies);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    form.setValue('careerInterests', newInterests);
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
          <h1 className="text-3xl font-bold mb-2">Interests & Goals</h1>
          <p className="text-muted-foreground">Step 3 of 3: Tell us what you're looking for</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onComplete)} className="glass p-8 rounded-2xl space-y-6">
        {/* Career Interests */}
        <div>
          <label className="block text-sm font-medium mb-3">Career Interests *</label>
          <div className="grid grid-cols-2 gap-3">
            {careerOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleInterest(option)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedInterests.includes(option)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {form.formState.errors.careerInterests && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.careerInterests.message}</p>
          )}
        </div>

        {/* Target Companies */}
        <div>
          <label className="block text-sm font-medium mb-2">Target Companies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
              placeholder="Add a company and press Enter"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            />
            <button
              type="button"
              onClick={addCompany}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <span
                key={company}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
              >
                {company}
                <button type="button" onClick={() => removeCompany(company)} className="hover:text-secondary/70">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio * (50-500 characters)
          </label>
          <textarea
            {...form.register('bio')}
            rows={4}
            placeholder="Tell us about yourself, your goals, and what you're looking for in a mentor..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
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
          <h3 className="text-sm font-medium">Social Links</h3>
          
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm mb-2">LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                {...form.register('linkedinUrl')}
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            {form.formState.errors.linkedinUrl && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.linkedinUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm mb-2">GitHub</label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                {...form.register('githubUrl')}
                type="url"
                placeholder="https://github.com/yourusername"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            {form.formState.errors.githubUrl && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.githubUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="portfolioUrl" className="block text-sm mb-2">Portfolio</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                {...form.register('portfolioUrl')}
                type="url"
                placeholder="https://yourportfolio.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
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
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            {isLoading ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>
      </motion.div>
    </div>
  );
};
