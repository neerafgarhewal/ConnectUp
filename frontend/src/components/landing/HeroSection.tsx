import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, MessageSquare, Briefcase } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { ParticlesContainer } from './ParticlesContainer';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <ParticlesContainer />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="gradient-text">Connect Up</span> - Bridge Your Future
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="inline-block min-h-[2.5rem]">
                <Typewriter
                  words={[
                    'Connect with alumni',
                    'Find mentors',
                    'Accelerate your career',
                    'Build your network'
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="_"
                  typeSpeed={50}
                  deleteSpeed={30}
                  delaySpeed={2000}
                />
              </span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a 
                href="/register/student" 
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Join as Student
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="/register/alumni" 
                className="px-8 py-4 bg-transparent border-2 border-primary/20 text-foreground font-medium rounded-full hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                Join as Alumni
              </a>
            </motion.div>

            <motion.div 
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background"></div>
                  ))}
                </div>
                <span>1,000+ Active Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>500+ Alumni Mentors</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              <div className="glass p-1 rounded-3xl overflow-hidden relative">
                <img 
                  src="/images/hero-dashboard.png" 
                  alt="ConnectUp Dashboard Preview" 
                  className="rounded-2xl w-full h-auto shadow-2xl"
                  onError={(e) => {
                    // Fallback to a gradient if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDEwMDAgNjAwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWQpIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA3NmZmO3N0b3Atb3BhY2l0eTowLjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTMzM2ZmO3N0b3Atb3BhY2l0eTowLjgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgo8L3N2Zz4=';
                  }}
                />
              </div>
              
              {/* Floating Feature Cards */}
              <div className="absolute -bottom-8 -left-8 glass p-4 rounded-2xl w-48 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Smart Matching</span>
                </div>
                <p className="text-xs text-muted-foreground">AI-powered mentor matching based on your goals</p>
              </div>
              
              <div className="absolute -top-8 -right-8 glass p-4 rounded-2xl w-48 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Real-time Chat</span>
                </div>
                <p className="text-xs text-muted-foreground">Connect instantly with mentors & peers</p>
              </div>
              
              <div className="absolute -bottom-12 right-20 glass p-4 rounded-2xl w-48 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Career Growth</span>
                </div>
                <p className="text-xs text-muted-foreground">Access exclusive opportunities & resources</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
