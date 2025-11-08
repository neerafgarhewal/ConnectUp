import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'alumni') => {
    toast.success(`Selected ${role} registration`);
    navigate(`/register/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              CU
            </div>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Join ConnectUp</h1>
          <p className="text-muted-foreground text-lg">Choose your role to get started</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('student')}
            className="glass p-8 rounded-2xl cursor-pointer group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm a Student</h2>
              <p className="text-muted-foreground mb-6">
                Connect with alumni mentors, get career guidance, and access exclusive opportunities
              </p>
              <ul className="text-sm text-left space-y-2 mb-6 w-full">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Find mentors from your field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Get career guidance and advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Access job and internship opportunities</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                Continue as Student
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Alumni Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('alumni')}
            className="glass p-8 rounded-2xl cursor-pointer group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-secondary/30"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm an Alumni</h2>
              <p className="text-muted-foreground mb-6">
                Give back to your alma mater by mentoring students and sharing your experience
              </p>
              <ul className="text-sm text-left space-y-2 mb-6 w-full">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Mentor aspiring professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Share your industry expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Expand your professional network</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-secondary font-medium group-hover:gap-4 transition-all">
                Continue as Alumni
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
